$(function() {
  var num = 2;
  var nowEvent;
  $("#append").on("click",function () {

  });

  $("#ok").on("click",function () {
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
        console.log($("li").length);
            if($("li").length == 0){
              console.log("sibal");
              $("#list").html("<li>"
                +"<div class=\"content\">"
                +  "<button type=\"button\" name=\"delete\" class=\"delete\">삭제</button>"
                  +"<div class=\"info\"><p>"+num+" ."+goal+"<br>"+date+"</p></div>"
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
              num++;
              $("#inputModal").modal("hide");}
        else{
            $("#list").children().last().after("<li>"
              +"<div class=\"content\">"
              +  "<button type=\"button\" name=\"delete\" class=\"delete\">삭제</button>"
                +"<div class=\"info\"><p>"+num+" ."+goal+"<br>"+date+"</p></div>"
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
            num++;
            $("#inputModal").modal("hide");
            }
      }
      $(".show").on("click",function(event) {
        console.log('sdfd');

        if($(event.target).text()=="▼내용보기"){
        console.log("hello");
        $(event.target).text("▲내용접기");
        $(event.target).parent().next(".desc").removeAttr("hidden");
      }else {
        $(event.target).text("▼내용보기");
        $(event.target).parent().next(".desc").attr("hidden",true);
      }
      });

      $(".edit").on("click",function(event) {
        console.log("hello");
        nowEvent = event.target;
        $("#editModal").modal("show");
        console.log(nowEvent);
      });

      $("#editok").on("click",function() {
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

      });

      $(".delete").on("click",function (event) {
        console.log("hi");
        $(event.target).parents("li").remove();
      });
  });

  $(".show").on("click",function(event) {
    console.log('sdfd');

    if($(event.target).text()=="▼내용보기"){
    console.log("hello");
    $(event.target).text("▲내용접기");
    $(event.target).parent().next(".desc").removeAttr("hidden");
  }else {
    $(event.target).text("▼내용보기");
    $(event.target).parent().next(".desc").attr("hidden",true);
  }
  });

  $(".edit").on("click",function(event) {
    console.log("hello");
    nowEvent = event.target;
    $("#editModal").modal("show");
    console.log(nowEvent);
  });

  $("#editok").on("click",function() {
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

  });

  $(".delete").on("click",function (event) {
    console.log("hi");
    $(event.target).parents("li").remove();
  });

});
