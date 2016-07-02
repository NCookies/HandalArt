/*
	jQuery document ready
*/

$(document).ready(function()
{
	var fc_chk_byte = function(aro_name, ari_max, keyCode) {

            var ls_str = aro_name.val(); // 이벤트가 일어난 컨트롤의 value 값
            var li_str_len = ls_str.length; // 전체길이

            var li_max = ari_max; // 제한할 글자수 크기
            var i = 0; // for문에 사용
            var li_byte = 0; // 한글일경우는 2 그밗에는 1을 더함
            var li_len = 0; // substring하기 위해서 사용
            var ls_one_char = ""; // 한글자씩 검사한다
            var ls_str2 = ""; // 글자수를 초과하면 제한할수 글자전까지만 보여준다.

            console.log(ls_str);

            if (li_byte > li_max - 3 &&keyCode == 8) {
                console.log('backspace');
                return li_byte - 1;
            }

            for (i = 0; i < li_str_len; i++) {
                // 한글자추출
                ls_one_char = ls_str.charAt(i);

                // 한글이면 2를 더한다.
                if (escape(ls_one_char).length > 4) {
                    li_byte += 2;
                }
                    // 그밖의 경우는 1을 더한다.
                else {
                    li_byte++;
                }

                // 전체 크기가 li_max를 넘지않으면
                if (li_byte <= li_max) {
                    li_len = i + 1;
                }
            }

            // 전체길이를 초과하면
            if (li_byte > li_max) {
                console.log(li_max + " Cannot input more. \n The exceed information will be automatically deleted. ");
                ls_str2 = ls_str.substr(0, li_len);
                aro_name.val(ls_str2);
            }

            return li_byte;
        }
	/*
		date store today date.
		d store today date.
		m store current month.
		y store current year.
	*/
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	
	/*
		Initialize fullCalendar and store into variable.
		Why in variable?
		Because doing so we can use it inside other function.
		In order to modify its option later.
	*/
	
	var calendar = $('#calendar').fullCalendar(
	{
		
		lang : 'ko',
		/*
			header option will define our calendar header.
			left define what will be at left position in calendar
			center define what will be at center position in calendar
			right define what will be at right position in calendar
		*/
		header:
		{
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay',
		},

		titleFormat: {
			month: "yyyy년 MMMM",
			week: "[yyyy] MMM d일 - { [yyyy] MMM d일}",
			day: "yyyy년 MMM d일 dddd"
			},
			allDayDefault: true,		// false로 하면 하루종일 수행하는 일정을 추가했을 경우 주에서 all-day에 표시되지 않고 시간대를 처음부터 끝까지 차지함
			weekends: true,				// false로 하면 일요일이랑 토요일이 안나옴
			monthNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
			monthNamesShort: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
			dayNames: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
			dayNamesShort: ["일","월","화","수","목","금","토"],
			buttonText: {
			today: "오늘",
			month: "월별",
			week: "주별",
			day: "일별"
		},
		/*
			defaultView option used to define which view to show by default,
			for example we have used agendaWeek.
		*/
		defaultView: 'month',			// 첫 화면
		/*
			selectable:true will enable user to select datetime slot
			selectHelper will add helpers for selectable.
		*/
		selectable: true,
		selectHelper: true,
		/*
			when user select timeslot this option code will execute.
			It has three arguments. Start,end and allDay.
			Start means starting time of event.
			End means ending time of event.
			allDay means if events is for entire day or not.
		*/
		//select: function(start, end, allDay)
		//{
				// after selection user will be promted for enter title for event.
			/*var title = prompt('Event Title:');
				// if title is enterd calendar will add title and event into fullCalendar.
			if (title)
			{
				calendar.fullCalendar('renderEvent',
					{
						title: title,
						start: start,
						end: end,
						allDay: allDay
					},
					true // make the event "stick"
				);
				// ajax call to store event in DB
			}*/
		//calendar.fullCalendar('unselect');
		//},
			// 모달 띄우기
		select: function(start, end, allDay)		// dayClick 함수는 클릭이벤트만 있는 반면, select 함수는 드래그이벤트도 있음
		{
			//var dragging;
			$('#addModal').modal
			({
  					title: event.title,
   					content: event.content
			});
			$("#add").off('click').one("click", function() 
			{
				var title = $('#addTitle').val();
				/*if (title)		// 이벤트 추가 다른방법 (원래예제)
				{
					calendar.fullCalendar('renderEvent',
						{
							title: title,
							start: start,
							end: end,
							allDay: allDay
						},
						true // make the event "stick"
					);
					// ajax call to store event in DB
				}
				calendar.fullCalendar('unselect');
				});*/
				//var newEvent = null;
				//dragging = true;
				console.log(start);
				var newEvent = {
	   		        title: title,
	   	    	    start: start,
		   	        end: end,
		   	        allDay: allDay		// 시간인식
	    	    };
	    	    console.log(newEvent);
				$('#calendar').fullCalendar('renderEvent', newEvent, 'stick');
				$('#addModal').modal('hide');
				// title = $('#title').val('');		// 앞에 썼던 title 내용 초기화, 나중에 썼던 title 내용이 맨 처음 클릭했던 날에만 들어감, 다른 날에는 빈칸으로 들어감
			});
			title = $('#addTitle').val('');		// 앞에 썼던 title 내용 초기화, 나중에 썼던 title 내용이 지금까지 클릭했던 모든 날에 들어감
			
			// enter쳐도 일정 추가가능
			$("#addTitle").off("keydown").on("keydown", function(evt){
				var keyCode = evt.keyCode || evt.which;

				fc_chk_byte($(this), 50, keyCode);

				if(evt.keyCode == 13){
					$("#add").trigger("click");
				}
			});
		},
		
		eventClick: function(event, calEvent, jsEvent, view, element) 
		{
			//var title = $('#title').val();
  			$('#editModal').modal
  			({
    				title: event.title,
   					content: event.content
   			});
  			$("#edit").off('click').on("click", function() 
  			{
  				var title = $('#editTitle').val();
  				event.title = title;
   				//event.title = event.changetitle;
				$('#calendar').fullCalendar('updateEvent', event);
				$('#editModal').modal('hide');
   			});
   			$("#remove").off('click').one("click", function()
  			{
  				var title = event._id;
    			$('#calendar').fullCalendar('removeEvents', title);
 				//$('#calendar').fullCalendar('addEventSource', newEvent);		// 사용할 경우 function()에 (newEvent)를 해주어야함
				$('#editModal').modal('hide');
 			});
 			title = $('#editTitle').val(event.title);			// title란에 기존에 입력했던 event의 이름이 나옴
			 
			$("#editTitle").off("keydown").on("keydown", function(evt){
				var keyCode = evt.keyCode || evt.which;

				fc_chk_byte($(this), 50, keyCode);

				if(evt.keyCode == 13){
					$("#edit").trigger("click");
				}
			});
 			// 자세히 버튼을 누름
 			$('#detail').on("click", function(){
 				$('#editModal')
 				.modal('hide')
 				.on('hidden.bs.modal', function(){
 	
 					$('#detailModal').modal('show');		// detailModal 열기
 						$("#editDetail").off('click').one("click", function(){		// 저장 버튼을 누름
 							var title = $('#detailTitle').val();			// 일정 이름
 	
 							event.title = title;
	
							$('#calendar').fullCalendar('updateEvent', event);
 							$('#detailModal').modal('hide');		// 저장 버튼을 누르면 modal이 사라짐
 						});
 					$(this).off('hidden.bs.modal');		// detailModal 닫기 (modal을 열고 끈 뒤 다음번에 editModal을 열고 껐을 때 자동으로 detail modal이 뜨는 것을 방지)
 				});
 			});

 			title = $('#detailTitle').val(event.title);			// title란에 기존에 입력했던 event의 이름이 나옴

		// enter쳐도 일정 수정가능
 			$("#detailTitle").off("keydown").on("keydown", function(evt){
				var keyCode = evt.keyCode || evt.which;

				fc_chk_byte($(this), 50, keyCode);

				if(evt.keyCode == 13){
					$("#editDetail").trigger("click");
				}
			});
		},
		// dayClick: function (date, allDay, jsEvent, view) {
		// 	$('#fullCalendar').fullCalendar('changeView', 'agendaDay').fullCalendar('gotoDate', date.getFullYear(), date.getMonth(), date.getDate());
		// },
		// eventRender: function (event, element, view) {
        //         element.qtip({
        //            content: event.QText,

        //            position: {
        //                my: 'CenterBottom',
        //                    at:'TopCenter'

        //            },
        //            style: {
        //                tip: 'bottomMiddle'

        //            }
        //        });
        //        $(element).removeClass('MaxHeight');
        //        if (view.name == 'month') {

        //                $(element).addClass('MaxHeight');
        //            var year = event.start.getFullYear(), month = event.start.getMonth() + 1, date = event.start.getDate();
        //            var result = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
        //            $(element).addClass(result);
        //            var ele = $('td[data-date="' + result + '"]'),count=$('.' + result).length;
        //            $(ele).find('.viewMore').remove();
        //            if ( count> 3) {
        //                $('.' + result + ':gt(2)').remove();                          
        //                $(ele).find('.fc-day-number').after('<a class="viewMore"> More</a>');

        //            } 
        //        }

        //    },
        //    eventAfterAllRender: function (view) {
        //         var allevents = $('#calendar').fullCalendar('clientEvents');
        //             var countevents = 0;
        //             if( allevents.length ) {
        //                 countevents = countevents + allevents.length;
        //             }
        //             if(!countevents) {
        //                 // alert('event count is'+countevents);
        //                 console.log('event count is',countevents);
        //             }
        //        },
           
		/*
			editable: true allow user to edit events.
		*/
		editable: true,		// 드래그로 일정 위치 및 크기 수정
		eventLimit: true,
		/*
			events is the main option for calendar.
			for demo we have added predefined events in json object.
		*/
		events: [
			{
				title: 'All Day Event',
				start: new Date(y, m, 1)
			},
			{
				title: 'Long Event',
				start: new Date(y, m, d-5),
				end: new Date(y, m, d-2)
			},
			{
				title: 'Repeating Event',
				start: new Date(y, m, d-3, 16, 0),
				allDay: false
			},
			{
				title: 'Repeating Event',
				start: new Date(y, m, d+4, 16, 0),
				allDay: false
			},
			{
				title: 'Meeting',
				start: new Date(y, m, d, 10, 30),
				allDay: false
			},
			{
				title: 'Lunch',
				start: new Date(y, m, d, 12, 0),
				end: new Date(y, m, d, 14, 0),
				allDay: false
			},
			{
				title: 'Birthday Party',
				start: new Date(y, m, d+1, 19, 0),
				end: new Date(y, m, d+1, 22, 30),
				allDay: false
			},
			{
				title: 'Go to Google',
				start: new Date(y, m, 28),
				end: new Date(y, m, 29),
				// url: 'http://google.com/'
			}
		]
 	});

	$(".fc-button-agendaDay").on('click', function() {
		var eventsArray = JSON.stringify((calendar.fullCalendar('clientEvents').map(function(e) {
			return {
				start: e.start,
				end: e.end,
				title: e.title,
				allDay: e.allDay,
				id: e._id
			};
		})));

		console.log(eventsArray);

		$.ajax({
			url: '/calendar/day',
			type: 'POST',
			data: { events: eventsArray },
			success: function(data) {
				if (data.success) {
					console.log('데이터 전송 성공!!');
				} else {
					console.log('오류 발생!!');
				}
			},
			error: function() {
				console.log('오류 발생2!!');
			}
		});
		

		//var renderedData = new EJS({url:'/calendar/day'}).render({data: eventsArray});
		$(".fc-view-agendaDay").load("/calendar/day");
		//$(".fc-view-agendaDay").load("/calendar/day")
	});
});
