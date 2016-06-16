$(document).ready(function() {

  var del_bool = true;    //list 삭제시 삭제중인가를 판별
  var comp_bool = false;  //list 편집시 편집중인지를 판별

//dialog 생성
$('#dialog').dialog({
  autoOpen: false,
  title: 'Test'
});

// 추가 버튼 전에 새로운 노드를 추가
{var num = ($('#tmain').children('tbody').children('tr').length);
  $('tbody').children().last().after("<tr>"
  +"<td class=\"checkbox\"><input type=\"checkbox\" class=\"check\"></td>"
  +"<td>"+num+"</td><td><input type=\"text\"class=\'input\' id=\"content\" placeholder =\'내용\'></td>"
  +"<td><input type=\"date\" placeholder =\'목표 일자\' class=\'input\' id=\"goal\"></td>"
  +"<td><button type=\"button\" name=\"isComp\" id=\"isComp\">목표완료</button></td>"
  +"</tr>");}
  $('.checkbox').css('visibility','hidden');
          //확인여부

//새로운 리스트 생성
  $('#addList').on('click',function() {
    var num = $('#tmain').children('tbody').children('tr').length;
    $('tbody').children().last().after("<tr>"
    +"<td class=\"checkbox\"><input type=\"checkbox\" class=\"check\"></td>"
    +"<td>"+num+"</td>"
    +"<td><input type=\"text\"class=\'input\' id=\"content\" placeholder =\'내용\'></td>"
    +"<td><input type=\"date\" placeholder =\'목표 일자\' class=\'input\' id=\"goal\"></td>"
    +"<td><button type=\"button\" name=\"isComp\" id=\"isComp\">목표완료</button></td>"
    +"</tr>");
    $('#editList').html("완료");

    $('.checkbox').css('visibility','hidden');
    $('#delete').css('font-size','25px');
    $('#delete').html("삭제");
    del_bool=true;

    comp_bool=false;
  });

//리스트 편집 완료
$('#editList').on('click',function () {
  if(comp_bool==true){
    $('input').removeAttr('readonly');
    $('#editList').html('완료')
    comp_bool=false;
}else if(comp_bool==false){
  $('input').attr('readonly','true');
  $('#editList').css('font-size','25px');
  $('#editList').html('내용 편집');
  comp_bool=true;
}
});

//리스트 삭제
$('#delete').on('click',function () {
  if(del_bool===true){
    $('.checkbox').css('visibility','visible');
    $('button').css('transition-duration','0s');  //delete btn의 글자
    $('#delete').css('font-size','25  px');       //내용을
    $('#delete').html("삭제 완료");                //바꿔준다.
    del_bool=false;
}else{
    $('input:checked[class=\"check\"]').parents('tr').remove();
    $('#allcheck').prop('checked',false);
    $('.checkbox').css('visibility','hidden');
    $('button').css('transition-duration','0.5s');
    $('#delete').css('font-size','25px');
    $('#delete').html("삭제");
    del_bool=true;
}
});
//전체 선택
$('#allcheck').on('click',function() {
  if($('#allcheck:checked').is(":checked")){
    $('input[type="checkbox"]').prop('checked',true);
  }else{
    $('input[type="checkbox"]').prop('checked',false);
  }
});


//calendar icon hover
$('#calendar').hover(function () {
  $('#calendar').attr("src","imgs/calender_hover_icon.png");
}, function () {
  $('#calendar').attr("src","imgs/calendar_icon.png");
});
//mandal icon hover
$('#mandalart').hover(function () {
    $('#mandalart').attr("src","imgs/mandal_hover_icon.png");
    }, function () {
    $('#mandalart').attr("src","imgs/mandal_icon.png");
  });

$('#isComp').on('click',function () {
  $('#dialog').dialog('open');
  $('.ui-button-text').html('×');
  });
});
