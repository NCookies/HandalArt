$(document).ready(function(){
    
  var random = Math.floor((Math.random()*10+1)/2);
  switch(random){
      case 0:
        $('h4').text('\'시간을 도구로 사용할 뿐, 시간에 의존해서는 안된다.\'');
        break;
      case 1:
        $('h4').text('\'무엇을 잘 하는 것은 시간낭비일 때가 많다.\'');
        break;
      case 2:
        $('h4').text('\'미래는 현재 우리가 무엇을 하는가에 달려 있다.\'');
        break;
      case 3:
        $('h4').text('\'나는 미래에 대해 생각하는 법이 없다. 어차피 곧 닥치니까.\'');
        break;
      case 4:
        $('h4').text('\'순간들을 소중히 여기다 보면, 긴 세월은 저절로 흘러간다.\'');
        break;
      case 5:
        $('h4').text('\'예측은 매우 어려우며, 미래에 대해서는 특히 그렇다\'');
        break;
      default:
        $('h4').text('\'미래를 예측하는 방법은 미래를 창조하는 것이다.\'');
        break;
  }

  $('#calender').hover(function () {
      $('#calender').attr("src","imgs/calender_hover_icon.png");
      }, function () {
      $('#calender').attr("src","imgs/calendar_icon.png");
    });

    $('#bucket').hover(function () {
        $('#bucket').attr("src","imgs/bucket_hover_icon.png");
        }, function () {
        $('#bucket').attr("src","imgs/bucket_icon.png");
      });

      $('#mandalart').hover(function () {
          $('#mandalart').attr("src","imgs/mandal_hover_icon.png");
          }, function () {
          $('#mandalart').attr("src","imgs/mandal_icon.png");
        });

  $('#login_form').on('submit', function(evt) {
        evt.preventDefault();
        var action = $(this).attr('action');

        console.log($(this).serialize());
        

        $.ajax({
            url: '/auth/login',
            type: 'POST',
            data: $(this).serialize(),
            success: function(data, err) {
                if (data.success) {
                    console.log('데이터 전송 성공!!');
					          //location.reload();
                } else {
                    console.log('오류 발생!!');
					          //location.reload();
                }
            },
            error:function(request, status, error) {
                console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });

        
    });


    $("#modal_submit").one('click', function() {

		if ($("#modal_password").val() != $("#modal_pwck").val()) {
			console.log("비밀번호가 같지 않음");
			return false;
		}

    	
		var action = $(this).attr('action');


		$.ajax({
            url: action,
            type: 'POST',
            data: $(this).serialize(),
            success: function(data, err) {
                if (data.success) {
                    console.log('데이터 전송 성공!!');
					          //location.reload();
                } else {
                    console.log('오류 발생!!');
					          //location.reload();
                }
            },
            error:function(request, status, error) {
                console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });

        //location.href='http://localhost:3000/';


    });
});
