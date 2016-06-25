$(document).ready(function() {
  $("#accountModal").dialog({
    autoOpen: false
  });

  $("#modal").on("click",function() {
    $("#accountModal").dialog("open");
  });
  $("#submit").on("click",function () {
    var id =$("#id").val();
    var password =$("#password").val();
    var email =$("#email").val();
    var nickname =$("#nickname").val();

    if(id=" "){
      alert("ID를 입력해주시오");
    }
    if(password=" "){
      alert("Password를 입력해주시오");
    }
    if(email=" "){
      alert("E-Mail을 입력해주시오");
    }
    if(nickname=" "){
      alert("NickName을 입력해주시오");
    }
  });
});
