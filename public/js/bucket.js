$(function() {
  var nowEvent;
/****************Append List*******************/
  $(document).on("click","#ok",function () {
    num = $("li").length+1;
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
        $("#goal").val("");
        $("#date").val("");
        $("#description").val("");
        /*************ul 내부에 li가 하나도 존재하지 않을경우********/
            if($("li").length == 0){
              $("#list").html("<li>"
                +"<div class=\"content\">"
                +  "<button type=\"button\" name=\"delete\" class=\"delete\">삭제</button>"
                  +"<div class=\"info\"><span id=\"scomp\" hidden>yet</span><span id=\"snum\">1</span> <span id=\"sgoal\">목표</span> <br> <span id=\"sdate\">목표일시</span></div>"
                  +"<div class=\"button\">"
                  +  "<button type=\"button\" name=\"show\" class=\"show\">▼내용보기</button>"
                    +  "<button type=\"button\" name=\"edit\" class=\"edit\">수정</button>"
                    +  "<button type=\"button\" name=\"complete\" class=\"complete\">완료</button>"
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
              +"<div class=\"content\">"
              +  "<button type=\"button\" name=\"delete\" class=\"delete\">삭제</button>"
                +"<div class=\"info\"><span id=\"scomp\" hidden>yet</span><span id=\"snum\">1</span> <span id=\"sgoal\">목표</span> <br> <span id=\"sdate\">목표일시</span></div>"
                +"<div class=\"button\">"
                +  "<button type=\"button\" name=\"show\" class=\"show\">▼내용보기</button>"
                  +  "<button type=\"button\" name=\"edit\" class=\"edit\">수정</button>"
                  +  "<button type=\"button\" name=\"complete\" class=\"complete\">완료</button>"
                  +"</div>"
                  +"<div class=\"desc\" hidden>"
                  +"<pre>"+desc+"</pre>"
                  +"</div>"
                +"</div>"
            +"</li>");
            $("#inputModal").modal("hide");
            }
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
      url: '/bucketEdit',
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
    $(nowEvent).parents("li").remove();
    console.log($("#list").children("li").children());
    console.log($("#list").children("li").eq(0).children("#snum").text());
    $("#deleModal").modal("hide");
  });

  $(document).on("click",".complete",function(event) {
    nowEvent = event.target;
    $("#compModal").modal("show");
  });

  $(document).on("click","#compOk",function () {
    $(nowEvent).parents().prev(".info").children("#scomp").text("complete");
    $("#compModal").modal("hide");
    console.log($(nowEvent).parents().prev(".info").children("#scomp").text());
  });


});
