/////메인 달력 만들기
  //현재 년도와 월에 대해 ny, nm이라는 전역변수를 선언하고, 값을 부여합니다. 값은 javascript로 선언할 수도 있겠지만 간편하게 php로 받습니다.
  //### ASP Coding ###//
  //  var ny = "<%=year(now)%>";
  //  var nm = "<%=month(now)%>";
  var ny = "<?=date("Y")?>";
  var nm = "<?=date("m")?>";
  function makeDiary() {
    var strsm = nm+"";
    if(strsm.length==1) { strsm = "0"+strsm; }
    var nfirstdate = new Date(ny,(nm-1),1);
    var nfirstweek = nfirstdate.getDay();
    var nlastdate = new Date(ny,nm,0);
    var nlastday = nlastdate.getDate();
    var dtmsg = "<tr align='center' height='25'><td width='14%' style='color:#ff0000;border-right:1px solid #cccccc;border-bottom:1px solid #666666;'><b>일</b></td>";
    dtmsg += "<td width='14%' style='border-right:1px solid #cccccc;border-bottom:1px solid #666666;'><b>월</b></td><td width='14%' style='border-right:1px solid #cccccc;border-bottom:1px solid #666666;'><b>화</b></td>";
    dtmsg += "<td width='14%' style='border-right:1px solid #cccccc;border-bottom:1px solid #666666;'><b>수</b></td><td width='14%' style='border-right:1px solid #cccccc;border-bottom:1px solid #666666;'><b>목</b></td>";
    dtmsg += "<td width='14%' style='border-right:1px solid #cccccc;border-bottom:1px solid #666666;'><b>금</b></td><td width='14%' style='border-bottom:1px solid #666666;'><b>토</b></td></tr>";
    var d = 0;
    var ntdsum = nlastday+nfirstweek;
    var dmsg = "";
    for(i=0; i<ntdsum; i++) {
      if(i<nfirstweek) {
        if(i==0) dmsg += "<td valign='top' style='padding-top:3;border-top:1px solid #cccccc;border-right:1px solid #cccccc;'><span style='padding-left:3;color:#ff8989;'></span></td>";
        else dmsg += "<td valign='top' style='padding-top:3;border-top:1px solid #cccccc;border-right:1px solid #cccccc;'><span style='padding-left:3;color:#bbbbbb;'></span></td>";
      }
      else {
        d++;
        var tdfc = "";
        if(((i+1)%7)==1) { tdfc = "color:#ff0000;"; }
        dmsg += "<td valign='top' style='padding-top:3;border-top:1px solid #cccccc;border-right:1px solid #cccccc;color:#474747;'><span style='padding-left:3;"+tdfc+"'>"+d+"</span></td>";
      }
      if(i<ntdsum-1 && ((i+1)%7)==0) { dmsg += "</tr><tr>"; }
    }
    i = 0;
    if(7-(ntdsum%7)>0 && (ntdsum%7)>0) {
      for(i=0; i<(7-(ntdsum%7)); i++) {
        tdfc = "color:#bbbbbb;";
        if(i==0 && (ntdsum%7)==0) { tdfc = "color:#ff8989;"; }
        dmsg += "<td valign='top' style='padding-top:3;border-top:1px solid #cccccc;border-right:1px solid #cccccc;'><span style='padding-left:3;"+tdfc+"'>"+(i+1)+"</span></td>";
      }
    }
    document.getElementById("maindiary").innerHTML = "<table width='100%' height='100%' border='0' cellspacing='0' cellpadding='0'>"+dtmsg+"<tr>"+dmsg+"</tr></table>";
    var ltm = nm-1;
    var lty = ny;
    if(ltm<1) { lty = ny-1; ltm = 12; }
    var tlastdate = new Date(lty,ltm,0);
    var tlastday = tlastdate.getDate();
    var btcnt = -1;
    for(i=0; i<7; i++) {
      if(!document.getElementById("maindiary").childNodes[0].rows[1].cells[i].childNodes[0].innerText) btcnt++;
    }
    var tfirstday = tlastday - btcnt;
    for(i=0; i<=btcnt; i++) {
      document.getElementById("maindiary").childNodes[0].rows[1].cells[i].childNodes[0].innerText = tfirstday+i;
    }
    for(i=1; i<document.getElementById("maindiary").childNodes[0].rows.length; i++) {
      if(document.getElementById("maindiary").childNodes[0].rows[i].cells[6]) {
        document.getElementById("maindiary").childNodes[0].rows[i].cells[6].style.borderRight = "0";
      }
    }
    if(ny=="<?=date("Y")?>" && nm=="<?=date("m")?>") {
      for(i=1; i<document.getElementById("maindiary").childNodes[0].rows.length; i++) {
        for(j=0; j<7; j++) {
          if(document.getElementById("maindiary").childNodes[0].rows[i].cells[j].style.color=="#474747") {
            if(document.getElementById("maindiary").childNodes[0].rows[i].cells[j].innerText=="<?=date("d")*1?>") {
              document.getElementById("maindiary").childNodes[0].rows[i].cells[j].style.backgroundColor = "#fffdc8";
            }
            else {
              document.getElementById("maindiary").childNodes[0].rows[i].cells[j].style.backgroundColor = "";
            }
          }
        }
      }
    }
  }
  makeDiary();