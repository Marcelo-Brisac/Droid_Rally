
var dist_travelled;
var previous_location; //as Location;
var txt_dist, txt_time;
var time_start;
var target_time;
var target_distance;
var time_curr;
var target_speed;
var distanceWarning;
var quitdlg;    // quit dialog
var dlgResetODO;// reset ODO dialog
var lay;        // main layout

function getCurrentSpeed() {
     if (previous_location!=null) 
            return (previous_location.speed*3.6)
      else
           return 0;
}

function Location(latitude, longitude, speed, time) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.speed= speed;
    this.time = time;
}

function DrawUserInterface() {
    quitdlg = QuitDialog(); 
    dlgResetODO = ResetODODialog();
    lay = MainScreen();
    app.AddLayout( lay );
    var ip = app.GetIPAddress();
    if (ip=="0.0.0.0") {
        ip="192.168.43.1";}
    txt_webserver.SetText(ip+":8080");
    refreshScreen();
}

//Called when application is started.
function OnStart()
{   
    time_curr = new Date().getTime();
    app.LoadScript("UserInterface.js", DrawUserInterface);
    
    if (!app.FolderExists("/sdcard/mwbrally")) {
      app.MakeFolder("/sdcard/mwbrally");
    }
    if (!app.FileExists("/sdcard/mwbrally/index.html")) 
      app.ExtractAssets(app.GetAppPath()+"Html","/sdcard/mwbrally",true);
      
    if (!app.FileExists("/sdcard/mwbrally/rally.css")) 
      app.ExtractAssets("Html","/sdcard/mwbrally",true);
      
    //Create and start location sensor.
    //(Achievable update rate is hardware specific)
    loc = app.CreateLocator( "GPS" );
    loc.SetOnChange( loc_OnChange ); 
    loc.SetRate( 1 ); //10 seconds.
    loc.Start();
    
    
    //create server
    serv = app.CreateWebServer(8080,"ListDir");
    //app.Alert( app.GetAppPath() +"/user/Html/");
    serv.SetFolder("/sdcard/mwbrally","ListDir");
    serv.AddServlet("/message",OnServlet);
    serv.Start();

	
    dist_travelled=0;
    target_distance=0;
    time_start=new Date().getTime();
    target_time = time_start;
    time_last_location = time_start-10000;
    app.EnableBackKey( false );
    app.PreventScreenLock( true );
    app.SetOrientation("Portrait");
    distanceWarning=false;
    previous_location=null;
    setInterval(refreshScreen,1000)
}

function OnPause() {
   //app.SetAlarm("Cancel",1234);
  //app.Exit();
}

function OnResume() {
    curr_time = new Date().getTime();
    loc.Start();
    //app.SetAlarm( "Set", 1234, OnAlarm, curr_time + 1000,1000 );
}

function OnServlet(request, info) {
var response;
var s;

    if (request.field!==undefined) {
        response = "invalid field requested";
        switch (request.field) {
            case "currentspeed" :
                 response= getCurrentSpeed().toFixed(0);
                 break;
            case "targetspeed" :
                response=(target_speed).toFixed(0);
                break;
             case "chrono" : 
                 response =(( time_curr - time_start)/1000);
                 break;
             case "odo" :
                 response = dist_travelled;
                 break;
             case "timeremaining" :
                 response =( target_time- time_curr)/1000;
                 break;
             case "distanceremaining" :
                 response =target_distance - dist_travelled;
                 break;
                 
        }
        
    } else {
           if (target_speed + 2 < getCurrentSpeed()) {
                                              s=  "increase speed";
                                             } else {
                                               if (target_speed -2 > getCurrentSpeed()) {
                                                s= "reduce speed";
                                               } else {
                                                 s="maintain speed";
                                               }
                                             }
        response=JSON.stringify({"currentspeed":getCurrentSpeed().toFixed(0)+" km/h",
                                        "targetspeed": (target_speed).toFixed(0)+ " km/h",
                                        "speeddifference":(target_speed-getCurrentSpeed()).toFixed(0) + " km/h",
                                        "chrono":timeToString(( time_curr - time_start)),
                                        "odo": (dist_travelled/1000).toFixed(2)+ " km",
                                        "timeremaining": timeToString(( target_time- time_curr)),
                                        "distanceremaining":((target_distance - dist_travelled)/1000).toFixed(2)+" km",
                                        "targetdistance": (target_distance/1000).toFixed(2)+ " km",
                                        "targettime": timeToString(target_time - time_start),
                                        "dowhat":s   
                                        });
             
    }
    serv.SetResponse(response);
}    
//Called when we get a change in location.
function loc_OnChange( data )
{
    var dist;
    
    if (previous_location == null) {
       previous_location = new Location(data.latitude, data.longitude, data.speed, new Date().getTime());
    }   
    previous_location.time= new Date().getTime();
    previous_location.speed = data.speed;
    dist= loc.GetDistanceTo(previous_location.latitude, previous_location.longitude );
    if(dist>5) {
        dist_travelled+=dist;
        previous_location.latitude= data.latitude;
        previous_location.longitude = data.longitude;
        if ((!distanceWarning) && (target_distance-dist_travelled<100)) {
            distanceWarning=true;
            //app.TextToSpeech( "Approaching Milestone" );
        }
            if (target_distance-dist_travelled>100) distanceWarning=false;
    }
}

//function OnAlarm( id ) {

//  if ((id==1234)){
//     time_curr = new Date().getTime();
//     refreshScreen();
     //app.SetAlarm("Cancel",1234);
     //app.SetAlarm("Set",1234, OnAlarm, time_curr+1000);
  //}
//}

function OnBack() {
}

function quit()
{
  //app.SetAlarm("Cancel",1234);
  quitdlg.Show();
}

function btnDlg_OnTouch()
{
  loc.Stop();
  quitdlg.Dismiss();
  app.Exit();
}

function btnODODlg_OnTouch() {
  dist_travelled =0;
  previous_location=null;
  dlgResetODO.Dismiss();
  refreshScreen();
}

function btn_odo_reset_OnTouch() {
    app.TextToSpeech( "Are you sure you want to reset?", 1.0, 1.0 );
    dlgResetODO.Show();
}

function btnDlgCancel_OnTouch() {quitdlg.Dismiss();}//app.SetAlarm("Set",1234, OnAlarm, new Date().getTime()+1000,1000);}
function btnODODlgCancel_OnTouch() {dlgResetODO.Dismiss();}
  
function refreshScreen() {
    time_curr = new Date().getTime();
    txt_dist.SetText(" ODO: "+(dist_travelled/1000).toFixed(2)+" km" );
    txt_time.SetText("Chrono: " + (timeToString(time_curr - time_start)));
    
    if (target_time<time_curr)
        target_time = time_curr;
    if (target_distance<dist_travelled)
        target_distance = dist_travelled;
    
    txt_target_time.SetText("Target time: " + (timeToString(target_time - time_start)));
    txt_remaining_time.SetText("Remaining: "+ (timeToString(target_time-time_curr)));
    txt_target_distance.SetText("Target dist: "+((target_distance)/1000).toFixed(2)+" km");
    txt_remaining_distance.SetText("Remaining: "+((target_distance-dist_travelled)/1000).toFixed(2)+" km");

    target_speed = (target_distance-dist_travelled)/((target_time- time_curr)/1000)*3.6
    txt_target_speed.SetText((target_speed).toFixed(0)+" km/h");
    
    // txt_speed.SetText((previous_location.speed*3.6).toFixed(0) + " km/h");
    txt_speed.SetText(getCurrentSpeed().toFixed(0) + " km/h");
 

    if (previous_location!=null) {
        txt_lastGPS.SetText(((time_curr-previous_location.time)/1000).toFixed(1) + "s ago");
        if (time_curr-previous_location.time<3000){
            txt_lastGPS.SetTextColor( "LightGray" );
            if (previous_location.speed*3.6 < target_speed - 2)
                txt_speed.SetTextColor("Red")
            else if (previous_location.speed*3.6 > target_speed + 2) 
                txt_speed.SetTextColor("Green")
                else
                    txt_speed.SetTextColor("LightGray");
        } else {
            txt_speed.SetText("");
            txt_lastGPS.SetTextColor( "Red" );
        }
    }
}

function getTimeIncrement(btn) {
    var now;
    var increment;
    now = new Date().getTime();
    if (now-btn.lastClickTime<200) {
     /* alert("Short click");*/
      increment = 30000;
    } else {
      increment = 10000;
    }
    btn.lastClickTime =now;
    return increment;
}

function getDistIncrement(btn) {
    var now;
    var increment;
    now = new Date().getTime();
    if (now-btn.lastClickTime<200) {
     /* alert("Short click");*/
      increment = 1000;
    } else {
      increment = 100;
    }
    btn.lastClickTime =now;
    return increment;
}

function btnTimePlus() {var increment =getTimeIncrement(this); target_time+=(increment -(target_time-time_start)%increment); refreshScreen();}
function btnTimeMinus() {var increment = getTimeIncrement(this); target_time-=(increment-(target_time-time_start)%increment); refreshScreen();} 
function btn_odo_minus_OnTouch() {dist_travelled-=100; refreshScreen();}
function btn_odo_plus_OnTouch() {dist_travelled+=100; refreshScreen();}
function btnDistPlus() {var inc= getDistIncrement(this); target_distance+=inc-target_distance%inc; refreshScreen();}
function btnDistMinus() {var inc = getDistIncrement(this); target_distance-=inc-target_distance%inc; refreshScreen();}
function btnArmReset() {btn_reset.SetEnabled(!  btn_reset.IsEnabled());}
function btnReset() {time_start = new Date().getTime(); btn_reset.SetEnabled( false );target_time=time_start;refreshScreen();};
