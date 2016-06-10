$(document).ready(function() {

  var num = 1;  // bucket_list 순번
  var del_bool = true;
  var comp_bool = true;
// 추가 버튼 전에 새로운 노드를 추가
  $('#lastNode').before("<tr><td>"+num+"</td><td><input type=\"text\"class=\'input\' id=\"content\" placeholder =\'내용\'></td><td><input type=\"date\" placeholder =\'목표 일자\' class=\'input\' id=\"goal\"></td></tr>");
  num++;

//새로운 리스트 생성
  $('#addList').on('click',function() {
    $('#lastNode').before("<tr><td>"+num+"</td><td><input type=\"text\"class=\'input\' id=\"content\" placeholder =\'내용\'></td><td><input type=\"date\" placeholder =\'목표 일자\' class=\'input\' id=\"goal\"></td></tr>");
    $('#editList').html("완료");
    num++;
  });

//리스트 편집 완료
$('#editList').on('click',function () {
  if(comp_bool==true){
    $('input').removeAttr('readonly');
    $('#editList').html('리스트 편집')
    comp_bool=false;
}else if(comp_bool==false){
  $('input').attr('readonly','true');
  $('#editList').html('완료');
  comp_bool=true;
}
});

//리스트 삭제
$('#delete').on('click',function () {
  console.log("click");
  if(del_bool===true){
    $('button').css('transition-duration','0s');
    $('#delete').css('font-size','20px');
    $('#delete').html("삭제 완료");
    del_bool=false;
}else{
    $('button').css('transition-duration','0.5s');
    $('#delete').css('font-size','25px');
    $('#delete').html("삭제");
    del_bool=true;
}

});

})
