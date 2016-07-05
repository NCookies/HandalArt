/*
	jQuery document ready
*/

var insertOrUpdateCalendar = function(calendar) {
	var eventsArray = JSON.stringify((calendar.fullCalendar('clientEvents').map(function(e) {
		return {
			id: e._id,
			start: e.start,
			end: e.end,
			title: e.title,
			allday: e.allDay
		};
	})));

	console.log(eventsArray);

	$.ajax({
		url: '/calendar',
		type: 'POST',
		data: { events: JSON.stringify(eventsArray) },
		complete: function(response, textStatus) {
			console.log("complete");
		},	
		success: function(data) {
			if (data.success) {
				console.log('데이터 전송 성공!!');
			} else {
				console.log('오류 발생!!');
			}
		},
		error: function() {
			console.log('오류 발생2!!');
		},
	});
}
 
$(document).ready(function()
{
	
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
			week: "[yyyy] MMM d일 - { [yyyy] MMM d일}",		// {}이거 왜있어 승우야?
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
				
				var newEvent = {
	   		        title: title,
	   	    	    start: start,
		   	        end: end,
		   	        allDay: allDay		// 시간인식
	    	    };
	    	    console.log(newEvent);
				$('#calendar').fullCalendar('renderEvent', newEvent, 'stick');

				insertOrUpdateCalendar($('#calendar')); // DB 저장

				$('#addModal').modal('hide');
				// title = $('#title').val('');		// 앞에 썼던 title 내용 초기화, 나중에 썼던 title 내용이 맨 처음 클릭했던 날에만 들어감, 다른 날에는 빈칸으로 들어감
			});
			title = $('#addTitle').val('');		// 앞에 썼던 title 내용 초기화, 나중에 썼던 title 내용이 지금까지 클릭했던 모든 날에 들어감
			
			// enter쳐도 일정 추가가능
			$("#addTitle").off("keydown").on("keydown", function(evt){
				var keyCode = evt.keyCode || evt.which;

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

				insertOrUpdateCalendar($('#calendar'));

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
			
			// enter쳐도 일정 수정
			$("#editTitle").off("keydown").on("keydown", function(evt){
				var keyCode = evt.keyCode || evt.which;

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

				if(evt.keyCode == 13){
					$("#editDetail").trigger("click");
				}
			});
		},

		/*
			editable: true allow user to edit events.
		*/
		editable: true,		// 드래그로 일정 위치 및 크기 수정
		eventLimit: true,
		/*
			events is the main option for calendar.
			for demo we have added predefined events in json object.
		*/
		/*events: [
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
				id: 999,
				title: 'Repeating Event',
				start: new Date(y, m, d-3, 16, 0),
				allDay: false
			},
			{
				id: 999,
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
		]*/
 	});
 
	/*$(".addEvent, .edit").on('click', function() {
		var eventsArray = JSON.stringify((calendar.fullCalendar('clientEvents').map(function(e) {
			return {
				id: e._id,
				start: e.start,
				end: e.end,
				title: e.title,
				allday: e.allDay
			};
		})));

		console.log(eventsArray);
 
		$.ajax({
			url: '/calendar',
			type: 'POST',
			data: { events: JSON.stringify(eventsArray) },
			complete: function(response, textStatus) {
                   console.log("complete");
            },	
			success: function(data) {
				if (data.success) {
					console.log('데이터 전송 성공!!');
				} else {
					console.log('오류 발생!!');
				}
			},
			error: function() {
				console.log('오류 발생2!!');
			},
		});
	});*/
});