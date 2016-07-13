$(function() {
  var nowEvent;
  var linum = 2;
  var listColor = ["#ED0000"];
/****************Append List*******************/
  $(document).on("click","#ok",function () {
    num = $("li").length-3;
    if($("#goal").val() == ""){
      alert("내용을 입력해주세요.");
    }else if($("#date").val()==""){
      alert("내용을 입력해주세요.");
    }else if($("#description").val()==""){
      alert("내용을 입력해주세요.");
    }else{
        var goal = $("#goal").val();
        var date = $("#date").val();
        var desc = $("#description").val();
        /*************ul 내부에 li가 하나도 존재하지 않을경우********/
            if($("li").length-4 == 0){
              $("#list").html("<li>"
                +"<div class=\"content\">"
                +  "<button type=\"button\" name=\"delete\" class=\"delete bbtn\">X</button>"
                  +"<div class=\"info\"><span hidden class=\"listNum\">"+linum+"</span><span id=\"scomp\" hidden>yet</span><span id=\"snum\">"+num+"</span> <span id=\"sgoal\">"+goal+"</span> <br> <span id=\"sdate\">"+date+"</span></div>"
                  +"<div class=\"button\">"
                  +  "<button type=\"button\" name=\"show\" class=\"show bbtn\">▼내용보기</button>"
                    +  "<button type=\"button\" name=\"edit\" class=\"edit bbtn\">수정</button>"
                    +  "<button type=\"button\" name=\"complete\" class=\"complete bbtn\">완료</button>"
                    +"</div>"
                    +"<div class=\"desc\" hidden>"
                    +"<pre>"+desc+"</pre>"
                    +"</div>"
                  +"</div>"
              +"</li>");
              $("#inputModal").modal("hide");}
              /*************End ul 내부에 li가 하나도 존재하지 않을경우********/
              /*************Modal에서 값을 받아 List 생성**************/
        else{
            $("#list").children().last().after("<li>"
            +  "<button type=\"button\" name=\"delete\" class=\"delete bbtn\">X</button>"
              +"<div class=\"content\">"
                +"<div class=\"info\"><span hidden class=\"listNum\">"+linum+"</span><span id=\"scomp\" hidden>yet</span><span class=\"snum\">"+num+"</span> <span id=\"sgoal\">"+goal+"</span> <br> <span id=\"sdate\">"+date+"</span></div>"
                +"<div class=\"button\">"
                +  "<button type=\"button\" name=\"show\" class=\"show bbtn\">▼내용보기</button>"
                  +  "<button type=\"button\" name=\"edit\" class=\"edit bbtn\">수정</button>"
                  +  "<button type=\"button\" name=\"complete\" class=\"complete bbtn\">완료</button>"
                  +"</div>"
                  +"<div class=\"desc\" hidden>"
                  +"<pre>"+desc+"</pre>"
                  +"</div>"
                +"</div>"
            +"</li>");
            $("#inputModal").modal("hide");
            }
            console.log($("form[name=appendform]").serialize());
            $.ajax({
              url: '/bucket/add',
              dataType:'json.stringify()',
              type: 'POST',
              data: $("form[name=appendform]").serialize(),
              success: function (result) {
                console.log('success');
              },
              error: function (err) {
                console.log(err);
              }
            });
            $("#goal").val("");
            $("#date").val("");
            $("#description").val("");
      }
      /*************End Modal에서 값을 받아 List 생성**************/
  });
/****************End Append List****************/
  $(document).on("click",".show",function(event) {
    if($(event.target).text()=="▼내용보기"){
    $(event.target).text("▲내용접기");
    $(event.target).parent().next(".desc").removeAttr("hidden");
    console.log($(event.target).parent().prev(".info").children("#snum").text());
    console.log("hidden off");
  }else {
    $(event.target).text("▼내용보기");
    $(event.target).parent().next(".desc").attr("hidden",true);
  }
  });

  $(document).on("click",".edit",function(event) {
    console.log("hello");
    nowEvent = event.target;
    $("#editModal").modal("show");
    console.log(nowEvent);
  });

  $(document).on("click","#editok",function() {
    if($("#editGoal").val() == ""){
      alert("내용을 입력해주세요.");
    }else if($("#editDate").val()==""){
      alert("내용을 입력해주세요.");
    }else if($("#edescription").val()==""){
      alert("내용을 입력해주세요.");
    }else{
    $.ajax({
      url: '/bucket/edit',
      dataType:'json.stringify()',
      type: 'POST',
      data: $("form[name=editForm]").serialize(),
      success: function (result) {
        console.log('success');
      },
      error: function (err) {
        console.log(err);
      }
    });
    var egoal = $("#editGoal").val();
    var edate = $("#editDate").val();
    var edesc = $("#edescription").val();
    $("#editGoal").val("");
    $("#editDate").val("");
    $("#edescription").val("");
    var now = $(nowEvent).parent(".button").prev(".info");
    $(now).children("#sgoal").text(egoal);
    $(now).children("#sdate").text(edate);
    $(nowEvent).parent(".button").nextAll(".desc").children("pre").text(edesc);
    $("#editModal").modal("hide");
    }
  });
  $(document).on("click",".delete",function(event) {
    nowEvent = event.target;
    $("#deleModal").modal("show");
  });

  $(document).on("click","#deleOk",function (event) {
    listNum = $(nowEvent).siblings(".content").children(".info").children(".listNum").text();
    console.log(listNum);
    $(nowEvent).parents("li").remove();
    for(var i = 0; i<$("li").length;i++){
      $(".snum").eq(i).text(i+1);
    }
    $.ajax({
      url: '/bucket/delete',
      type: 'POST',
      data: listNum,
      success: function (result) {
        console.log('success');
      },
      error: function (err) {
        console.log(err);
      }
    });
    $("#deleModal").modal("hide");
  });

  $(document).on("click",".complete",function(event) {
    nowEvent = event.target;
    $("#compModal").modal("show");
  });

  $(document).on("click","#compOk",function () {
    $(nowEvent).parents().prev(".info").children("#scomp").text("complete");
    $("#compModal").modal("hide");
    $(nowEvent).parents("li").hide();
    console.log($(nowEvent).parents().prev(".info").children("#scomp").text());
  });
  $("#completed").on("click",function(){
    $(nowEvent).parents("li").show();
  });  
});
