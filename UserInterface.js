
function timeToString(time) {
var hours, mins, secs;
var mod, temp;
var str;
  mod = time % 3600000;
  hours = (time-mod)/3600000;
  if (hours<1) str="00"
  else if (hours<10) str = "0" + hours
  else str = hours;
  str+=":";
  
  temp=time-hours*3600000;
  mod= temp%60000;
  mins = (temp-mod)/60000;
  if (mins<1) str+="00"
  else if (mins<10) str +="0" + mins
  else str+=mins;
  str+=":";
 
  temp-=mins*60000;
  mod = temp%1000;
  secs =(temp-mod)/1000;
  
  if (secs<1) str+="00"
    else  if (secs<10) str +="0" + secs
  else str+=secs;
  
  return str;
}


function QuitDialog() {
    dlg = app.CreateDialog( "Quit App? ");
    layDlg = app.CreateLayout( "linear", "VCenter,FillXY" );
    layDlg.SetSize( 0.7, 0.3 );
    dlg.AddLayout( layDlg );
    
    btnDlgOK = app.CreateButton( "OK", 0.6, 0.1 );
    btnDlgOK.SetOnTouch( btnDlg_OnTouch );
    btnDlgOK.SetBackColor( "#aa0000" );
    layDlg.AddChild( btnDlgOK );
    
    btnDlgCancel = app.CreateButton("Cancel", 0.6,0.1);
    btnDlgCancel.SetOnTouch( btnDlgCancel_OnTouch );
    btnDlgCancel.SetBackColor( "#00aa00" );
    layDlg.AddChild (btnDlgCancel);
    return dlg;

}

function ResetODODialog() {
    dlgResetODO = app.CreateDialog( "Reset ODO? ");
    
    layDlg = app.CreateLayout( "linear", "VCenter,FillXY" );
    layDlg.SetSize( 0.7, 0.3 );
    dlgResetODO.AddLayout( layDlg );
    
    btnODODlgOK = app.CreateButton( "OK", 0.6, 0.1 );
    btnODODlgOK.SetOnTouch( btnODODlg_OnTouch );
    layDlg.AddChild( btnODODlgOK );
    
    btnODODlgCancel = app.CreateButton("Cancel", 0.6,0.1);
    btnODODlgCancel.SetOnTouch( btnODODlgCancel_OnTouch );
    layDlg.AddChild (btnODODlgCancel);
    return dlgResetODO;
}

function MainScreen() {
    lay = app.CreateLayout( "Linear", "Vertical, FillXY" );
    
    // line0 Chorno
    line0 = app.CreateLayout( "Linear", "Horizontal, FillX" );
    lay.AddChild( line0);
    
    btn_arm_reset = app.CreateButton("Arm Reset",0.2, 0.1);
    btn_arm_reset.SetOnTouch(btnArmReset);
    line0.AddChild(btn_arm_reset);
    
    txt_time = app.CreateText( "0", 0.6, 0.1 , "VCenter");
    txt_time.SetTextSize( 26 );
    txt_time.SetTextColor( "White" );
    line0.AddChild(txt_time);
    
    btn_reset= app.CreateButton("Reset",0.2,0.1);
    btn_reset.SetOnTouch(btnReset);
    btn_reset.SetEnabled( false );
    line0.AddChild(btn_reset);
    
    //line1 ODO
    line1= app.CreateLayout( "Linear", "Horizontal" );
    lay.AddChild( line1 );
    
    btn_odo_minus = app.CreateButton( "-", 0.2,0.1 );
    btn_odo_minus.SetOnTouch( btn_odo_minus_OnTouch );
    line1.AddChild( btn_odo_minus );
    
    txt_dist = app.CreateText( "0",0.6,0.1 );
    txt_dist.SetTextSize( 22 );
    line1.AddChild( txt_dist );
    
    btn_odo_plus = app.CreateButton( "+" ,0.2,0.1);
    btn_odo_plus.SetOnTouch( btn_odo_plus_OnTouch );
    line1.AddChild(btn_odo_plus);
    // blank
    
    txt_blank = app.CreateText("");
    txt_blank.SetTextSize(22);
    lay.AddChild( txt_blank );
    
    // line 2 Current speed
    line2 = app.CreateLayout( "Linear", "Horizontal" );
    lay.AddChild(line2);
    txt_text = app.CreateText("Current speed:",0.5,0.1,"Left");
    txt_text.SetTextSize(20);
    line2.AddChild(txt_text);
    
    txt_speed = app.CreateText("0",0.5,0.1,"Left");
    txt_speed.SetTextSize(22);
    line2.AddChild(txt_speed);
    
    // line3 Target speed
    line3 = app.CreateLayout( "Linear", "Horizontal" );
    lay.AddChild(line3);
    txt_text = app.CreateText("Target speed:",0.5,0.1,"Left");
    txt_text.SetTextSize(20);
    line3.AddChild(txt_text);
    
    txt_target_speed = app.CreateText("0",0.5,0.1,"Left");
    txt_target_speed.SetTextSize(22);
    line3.AddChild(txt_target_speed );
    
    // blank
    txt_blank = app.CreateText("");
    txt_blank.SetTextSize(22);
    lay.AddChild( txt_blank );
    
    // Line4 TargetTime
    line4 = app.CreateLayout( "Linear", "Horizontal,FillX");
    lay.AddChild( line4 );
    
    btn_time_minus = app.CreateButton("-",0.2,0.1);
    btn_time_minus.SetOnTouch(btnTimeMinus);
    line4.AddChild(btn_time_minus);
    
    line4c =  app.CreateLayout( "Linear", "Vertical,FillY");
    line4c.SetPadding(0.0,0.01,0.00,0.01);
    line4.AddChild(line4c);
    
    txt_target_time = app.CreateText("0",0.6,0.035);
    txt_target_time.SetTextSize(15);
    txt_target_time.SetTextColor ("#808080");
    line4c.AddChild(txt_target_time);
    
    txt_remaining_time = app.CreateText ("0",0.6,0.065);
    txt_remaining_time.SetTextSize(18);
    line4c.AddChild(txt_remaining_time);
    
    btn_time_plus = app.CreateButton("+",0.2,0.1);
    btn_time_plus.SetOnTouch(btnTimePlus);
    line4.AddChild(btn_time_plus);
    
    //Line 5 TargetDistance
    
    line5 = app.CreateLayout( "Linear", "Horizontal,FillX" );
    lay.AddChild( line5 );
    
    btn_dist_minus = app.CreateButton("-",0.2,0.10);
    btn_dist_minus.SetOnTouch(btnDistMinus);
    line5.AddChild(btn_dist_minus);
    
    line5c =  app.CreateLayout( "Linear", "Vertical,FillY");
    line5c.SetPadding(0.0,0.01,0.00,0.01);
    line5.AddChild (line5c);
    
    txt_target_distance = app.CreateText("0",0.6,0.035);
    txt_target_distance.SetTextSize(15);
    txt_target_distance.SetTextColor("#808080");
    line5c.AddChild(txt_target_distance);
    
    txt_remaining_distance = app.CreateText("0",0.6,0.065);
    txt_remaining_distance.SetTextSize(18);
    line5c.AddChild(txt_remaining_distance);
    
    btn_dist_plus = app.CreateButton("+",0.2,0.10);
    btn_dist_plus.SetOnTouch(btnDistPlus);
    line5.AddChild(btn_dist_plus);
    
    // line6 last update // ip address
    line6 = app.CreateLayout( "Linear", "Horizontal" );
    lay.AddChild( line6 );
    txt_text = app.CreateText("Last GPS update:",0.3,0.1,"Left");
    txt_text.SetTextSize(14);
    line6.AddChild(txt_text);
    
    txt_lastGPS = app.CreateText( "0",0.2,0.1,"Left" );
    txt_lastGPS.SetTextSize(14);
    line6.AddChild(txt_lastGPS);
    
    txt_text = app.CreateText("Server:",0.15,0.1,"Left");
    txt_text.SetTextSize(14);
    line6.AddChild(txt_text);
    
    txt_webserver = app.CreateText( "0",0.35,0.1,"Left" );
    txt_webserver.SetTextSize(14);
    line6.AddChild(txt_webserver);
    
    //line8 reset ODO
    btn_odo_reset = app.CreateButton( "Reset ODO",1,0.1 );
    btn_odo_reset.SetBackColor( "#aa0000" );
    btn_odo_reset.SetOnTouch( btn_odo_reset_OnTouch );
    lay.AddChild( btn_odo_reset );
    
    //Last line
    line9 = app.CreateLayout( "Linear", "Horizontal,Bottom,FillY" );
    lay.AddChild( line9 );
    
    btn = app.CreateButton( "Quit",1,0.06,"Bottom,FillY" );
    btn.SetBackColor( "Black" );
    btn.SetOnTouch( quit );
    line9.AddChild( btn );
    
    return lay;
}
