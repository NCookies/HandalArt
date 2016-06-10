/*
	jQuery document ready
*/

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
			right: 'month,agendaWeek,agendaDay'
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
			$('#view_eventadd').modal
			({
  					title: event.title,
   					content: event.content
			});
			$("#add").off('click').one("click", function() 
			{
				var title = $('#title').val();
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
				var newEvent = null;
				//dragging = true;
				newEvent = {
	   		        title: title,
	   	    	    start: start,
		   	        end: end,
		   	        allDay: allDay		// 시간인식
	    	    };

				$('#calendar').fullCalendar('renderEvent', newEvent, 'stick');
				$('#view_eventadd').modal('hide');
				// title = $('#title').val('');		// 앞에 썼던 title 내용 초기화, 나중에 썼던 title 내용이 맨 처음 클릭했던 날에만 들어감, 다른 날에는 빈칸으로 들어감
			});
			title = $('#title').val('');		// 앞에 썼던 title 내용 초기화, 나중에 썼던 title 내용이 지금까지 클릭했던 모든 날에 들어감
		},
		
		eventClick: function(event, calEvent, jsEvent, view, element) 
		{
  			$('#view_event').modal
  			({
    				title: event.title,
   					content: event.content
   			});
  				
  			$("#edit").off('click').on("click", function() 
  			{
  				var title = $('#changetitle').val();
  				event.title = title;
   				//event.title = event.changetitle;
   				console.log(event.title);
				$('#calendar').fullCalendar('updateEvent', event);
				$('#view_event').modal('hide');
   			});
   			$("#remove").off('click').one("click", function()
  			{
  				var title = event._id;
    			console.log(title);
    			$('#calendar').fullCalendar('removeEvents', title);
 				//$('#calendar').fullCalendar('addEventSource', newEvent);		// 사용할 경우 function()에 (newEvent)를 해주어야함
				$('#view_event').modal('hide');
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
		events: [
			{
				title: 'All Day Event',
				start: new Date(y, m, 1)
			}
		]
 	});

	$(".sendClientEvents").on('click', function() {
		var arr = calendar.fullCalendar('clientEvents');
		var jsonObj;
		$.each(arr, function(index, val) {
			console.log(arr[index]);
			jsonObj += JSON.stringify(arr[index]);
		});

		console.log(jsonObj);

		$.ajax({
			url: '/calendar',
			type: 'POST',
			data: { events: jsonObj },
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

	});
});
