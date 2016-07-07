(function($) {
    $.fn.flash_message = function(options) {
      options = $.extend({
        text: 'Done',
        time: 1000,
        how: 'before',
        class_name: ''
      }, options);
      
      return $(this).each(function() {
        if( $(this).parent().find('.flash_message').get(0) )
          return;
        
        var message = $('<span />', {
          'class': 'flash_message ' + options.class_name,
          text: options.text
        }).hide().fadeIn('fast');
        
        $(this)[options.how](message);
        
        message.delay(options.time).fadeOut('normal', function() {
          $(this).remove();
        });
      });
    };
})(jQuery);


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
				
				if (title == "") {
					$('#status-area').flash_message({
						text: '일정 이름을 입력해주세요!!',
						how: 'append'
					});

					return false;
				}
				var newEvent = {
	   		        title: title,
	   	    	    start: start,
		   	        end: end,
		   	        allDay: allDay,		// 시간인식
                    _id: Math.floor(Math.random() * 100000) + 1
	    	    };
	    	    console.log(newEvent);
				$('#calendar').fullCalendar('renderEvent', newEvent, 'stick');

				insertOrUpdateCalendar($('#calendar')); // DB 저장

				$('#addModal').modal('hide');
				// title = $('#title').val('');		// 앞에 썼던 title 내용 초기화, 나중에 썼던 title 내용이 맨 처음 클릭했던 날에만 들어감, 다른 날에는 빈칸으로 들어감
			});
			title = $('#addTitle').val('');		// 앞에 썼던 title 내용 초기화, 나중에 썼던 title 내용이 지금까지 클릭했던 모든 날에 들어감
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
				$('#calendar').fullCalendar('updateEvent', event);

                insertOrUpdateCalendar($('#calendar'));

				$('#editModal').modal('hide');
   			});
   			$("#remove").off('click').one("click", function()
  			{
  				var calendarId = event._id;

                $('#calendar').fullCalendar('removeEvents', title);
				$('#editModal').modal('hide');

                $.ajax({
                    url: '/calendar/remove',
                    type: 'POST',
                    data: { events: calendarId },
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
 			});
 			title = $('#editTitle').val(event.title);			// title란에 기존에 입력했던 event의 이름이 나옴
		},
		/*
			editable: true allow user to edit events.
		*/
		editable: true,		// 드래그로 일정 위치 및 크기 수정
		eventLimit: true
 	});

$(".fc-button-agendaWeek").on("click", function() {
    $(".fc-view-agendaDay").remove(); //d3 제거	
});

$(".fc-button-month").on("click", function() {
    $(".fc-view-agendaDay").remove(); //d3 제거	
});

$(".fc-button-agendaDay").on("click", function() {
    buildDayPie();
});

function buildDayPie() {
    //if(needAppend)
        buildDayHtml();
	//day_calendar.js
	var Gw = 600;
    var Gh = 600;
    var Gr = Gh/2;

    var data = [{"label":"00:00", "value":30}, 
                {"label":"00:30", "value":30}, 
                {"label":"01:00", "value":30},
                {"label":"01:30", "value":30},     
                {"label":"02:00", "value":30}, 
                {"label":"02:30", "value":30},      
                {"label":"03:00", "value":30}, 
                {"label":"03:30", "value":30}, 
                {"label":"04:00", "value":30}, 
                {"label":"04:30", "value":30}, 
                {"label":"05:00", "value":30},
                {"label":"05:30", "value":30},
                {"label":"06:00", "value":30},
                {"label":"06:30", "value":30},
                {"label":"07:00", "value":30},
                {"label":"07:30", "value":30},
                {"label":"08:00", "value":30},
                {"label":"08:30", "value":30},
                {"label":"09:00", "value":30},
                {"label":"09:30", "value":30},
                {"label":"10:00", "value":30}, 
                {"label":"10:30", "value":30},
                {"label":"11:00", "value":30},
                {"label":"11:30", "value":30},       
            ];
   
    var data = $.parseJSON(JSON.stringify(data));           

    var color = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","WhiteSmoke","Yellow","YellowGreen"
    ];
        
    var vis = d3.select('#graph').append("svg")
                .data([data])
                .attr("width", Gw)
                .attr("height", Gh)
                .append("g")
                .attr("transform", "translate(" + Gr + "," + Gr + ")"); //원의 중심 지정
                
    var arc = d3.svg.arc().outerRadius(Gr).innerRadius(Gr-130);
                
    var pie = d3.layout.pie()
                .value(function(d){ return d.value; })
                .sort(null);
                        
    var paths = vis.selectAll(".slice")
                .data(pie).enter()
                .append("g")
                .attr("class", "slice")
                .append("path")
                .each(function(d, i) { //각 파이의 인덱스 지정
                    d3.select(this)
                    .attr("index", i)
                })
                .on("mousedown", mousedown)
                .on("mouseover", mouseover)
                .on("mouseup", mouseup);

    $("#graph").on("mouseleave", mouseleave);

    paths.transition().duration(500)
    .attr("d", arc)
    .each(function(d) { this._current = d; });

    // api.jqueryui.com/draggable/#event-drag
    // containment: ".slice", //limit area
    var dragging;
    //var isfilled = false;
    var sumValue = 0;
    var totalSize;
    var startBig = false;
    var infoJsonArray = new Array();
    
    var radians = 0.0174532925, 
	clockRadius = 190,
	margin = 50,
	Cw = (clockRadius+margin)*2,
    Ch = (clockRadius+margin)*2,
    hourHandLength = clockRadius/2,
    minuteHandLength = clockRadius-50,
    hourLabelRadius = clockRadius - 40
    hourLabelYOffset = 7;

    var hourScale = d3.scale.linear()
        .range([0,330])
        .domain([0,11]);
            
    var minuteScale = secondScale = d3.scale.linear()
        .range([0,354])
        .domain([0,59]);
    
    var handData = [
        {
            type:'hour',
            value:0,
            length:-hourHandLength,
            scale:hourScale
        },
        {   
            type:'minute',
            value:0,
            length:-minuteHandLength,
            scale:minuteScale
        }    
    ];
    
    drawClock();
    var sumIndex=" ";
    var startIndex = 0;
    var overLast;

    function sumData(data) { // 퍼센트 구할 때 필요
        var arr = 0;
        for (var i = 0; i < 24; i++) {
            arr += data[i].value;
        }
        return arr;
    }

    function mouseleave(d) {
        d3.selectAll("path").on("mouseover", null);
        d3.selectAll("path")
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .each("end", function() {
                    d3.select(this).on("mouseover", mouseover);
                    });            
    }

    // 클릭할때마다 값이 초기화되서 주의
    function mousedown(d) {
        dragging = true;
        sumValue = 0;
        startIndex = $(this).attr("index");
        sumValue += d.value;
        d.data.value = 0;
    }

    function mouseover(d) {
/* 마우스컨트롤 / 모달뜨고 아무것도안눌렀을때 해결하면 같이될듯. 
          //over할 때마다 실행되서 leave가 여러번 호출됨.
            //modal안띄우고 데이터 초기화 & mouseup
            //千載一遇*/
            $("#graph").one("mouseleave", function() {
                
               dragging = false;
                //$("path").removeAttr("class").removeClass(); //색깔 없앰
                //드래그 한 path들도 없어져야 함. 색깔뿐만아니라
                return;
            });

            $("#clock-face").one("mouseenter", function() {

                $("path").off("mouseover");
                return;
            });

        if( dragging ) {
            if( d.value == 30 ) {
                sumIndex += ($(this).attr("index")+",");
            }
            if( $(this).attr("index") > startIndex ){
                $('path').filter(function() {
                return $(this).attr('index') == startIndex;
                }).attr("class", "smallerFilling");
                //}).attr("sort", "smaller").css("fill", "#bfbfbf");
                //$(this).attr("sort", "smaller")
                //        .css("fill", "#bfbfbf");
                $(this).attr("class", "smallerFilling");
            }
            else if( $(this).attr("index") < startIndex ){
                $('path').filter(function() {
                return $(this).attr('index') == startIndex;
                }).attr("class", "biggerFilling");
                 //}).attr("sort", "bigger").css("fill", "#bfbfbf");
                //$(this).attr("sort", "bigger")
                 //      .css("fill", "#bfbfbf");
                 $(this).attr("class", "biggerFilling");
            }
            sumValue += d.value;
            d.data.value = 0;
            overLast = $(this).attr("index");            
            //mouse control
            //$("#graph").on("mouseover", mouseup($(this)));
            //$("#clock-face").on("mouseover", mouseup($(this)));
        }
        var percentage = (100 * d.value / sumData(data) ).toPrecision(3);
        var percentageString = percentage + "%";
        if (percentage < 0.1) { percentageString = "< 0.1%"; }     
        d3.select("#percentage")
        .text(d.data.label); 
        
        $("path").css("stroke", "black").attr("opacity", "0.5");
        $("path").filter(function() {
            return $(this).attr("class") == "biggerFilling" || $(this).attr("class") == "smallerFilling";
        }).attr("opacity", "1");
    }
    
    //mouse 관련 효과
    $("g").on("mouseout", function() {        
        $("path").css("stroke", "white").attr("opacity", "0.5");
        $("path").filter(function() {
            return $(this).attr("class") == "biggerFilling" || $(this).attr("class") == "smallerFilling";
        }).attr("opacity", "1");
        
    });

    // path 밖에서 mouseup하면 mouseover가 연속됨.
    function mouseup(d) {
        dragging = false;
        d.data.value = sumValue;         
        if(sumIndex != " ") {
            $(this).attr("sumIndex", sumIndex);
            sumIndex = " ";    
        }
        
        //오름차순 내림차순 구별하고 마지막path에 index저장
        if ($(this).attr("startIndex") == undefined) {
            $(this).attr("startindex", startIndex); //targetPath 속성에 저장
        }

        target = $(this).attr("index"); //추가 된 파이 식별하기 위해 필요 
        $(this).attr("date", (new Date()).yyyymmdd());

        editModal(d); //처음에 일정이름 추가
    }

    // yyyymmdd 형태로 포매팅된 날짜 반환 
    // 2016-07-06T06:00:00.000Z
    Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth() + 1).toString();
        var dd = this.getDate().toString();
        var hh = this.getHours().toString();
        var nn = this.getMinutes().toString();
        var ss =  this.getSeconds().toString();
        return yyyy + "-" + (mm[1] ? mm : '0'+mm[0]) + "-" + (dd[1] ? dd : '0'+dd[0] + 
                "T" + (hh[1]? hh : '0'+hh[0])) + ":" + (nn[1]? nn : '0'+nn[0]) + ":" + (ss[1]? ss : '0'+ss[0]) + "Z";
    }

    function change(target) {
        //up한 path 색깔 바꾸고, 다시 그림
        paths.data(pie(data));
        $("path").filter(function() {
            return $(this).attr("index") == target;
        }).css("fill", color[Math.floor(Math.random() * color.length)]);

        paths.transition().duration(750)
        .attrTween("d", arcTween); // redraw the paths
    }                            

    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);

        return function(t) {
            return arc(i(t));
        };
    }

    function editModal(d) {
        $("#editModal").modal();    
        //remove click event before adding it.    
        //cancel했을 때 path생성 안되게
        var targetPath = $('path').filter(function() {
                return $(this).attr('index') == target;
        });
        var front = targetPath.attr("startIndex");
        var back = targetPath.attr("index");  
        if(front > back) {
            //큰 수부터 드래그 시 숫자 바꿔줌
            var temp;
            temp = front;
            front = back;
            back = temp;
       }
       var start_ = calcTime(front);
       var end_ = calcTime(back);    
       var idadd="";
          
       //use enter key
       $("#editModal").off("keydown").on("keydown", function(evt) {
           var keyCode = evt.keyCode || evt.which;
            if( evt.keyCode == 13 ) {
                $("#edit").trigger("click");
            }
       });

        $("#edit").off('click').on('click', function() { 
            d.data.label = $('#editTitle').val(); // change label  
            change(target);  // redraw path
            $('#editTitle').val(''); //reset textbox
            setJsonAdd(targetPath);

            console.log('day calendar : ' + JSON.stringify(infoJsonArray));

            $.ajax({
                url: '/calendar/day',
                type: 'POST',
                data: { events: JSON.stringify(infoJsonArray) },
                dataType: "json",            
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
        });   

        //sumIndex의 index를 가진 path.value = 30
        $("#remove").off('click').on('click', function() {
            if(targetPath.attr("sumIndex") == undefined) { //path를 1개만 선택했으면
                var time = calcTime(target);
                d.data.label = time;
                targetPath.attr("class", "");
                return;
            }
            var sumIndex = $('path').filter(function() {
                return $(this).attr('index') == target;
            }).attr("sumIndex");  
            var seperIndex = sumIndex.split(","); //sumIndex 배열로     
            var length = seperIndex.length; //path의 갯수 
            seperIndex.sort(function(left, right) { //오름차순정렬
                 return left-right;
            });
            var lastnum=parseInt(seperIndex[length-1]); //문자열로인식하지않게하기위해      
            if(targetPath.hasClass("smallerFilling")){
                console.log("smlaller");
                for(var i=seperIndex[1]-1; i<=lastnum; i++)
                    calcPath(i);
            }
            
            else if(targetPath.hasClass("biggerFilling")){
                console.log("biggler");                
                for(var i=seperIndex[1]; i<lastnum+2; i++)
                    calcPath(i);       
            }
            setJsonRemove(target);
        }); 

        function calcTime(i) {
            var time = 0;
            if(i%2 == 0) //2의 배수이면
                time = i/2+":00";
            else
                time = Math.floor(i/2)+":30";        
            return time;
        }

        //path의 이름, 크기를 계산하고 다시그림
        function calcPath(i){
            if(i%2 == 0) //2의 배수이면
                data[i].label = i/2+":00";
            else
                data[i].label = Math.floor(i/2)+":30";
            data[i].value = 30;
            paths.data(pie(data));
            paths.transition().duration(750)
                 .attrTween("d", arcTween); 
            $('path').filter(function() {
                 return $(this).attr('index') == i;
            }).removeAttr('style').attr("class","")
              .attr("sumIndex", " "); 
        }         

        // 데이터 json 추가
        function setJsonAdd(targetPath) {
            if( targetPath.attr("add") == "true" ) {
                //만들어진 일정이 있어서 수정으로 
                setJsonEdit(targetPath, start_, end_);
                return;
            }  
            for (var i=0; i<3; i++)
                    idadd += targetPath.attr("index");
            idadd += (Math.floor(Math.random() * 1000000) + 1).toString();
            var targetDate = targetPath.attr("date");
            var newEvent = {
                    id: idadd,
	   		        title: d.data.label,
	   	    	    start: '2016-07-06T06:00:00.000Z',
		   	        end: '2016-07-06T06:00:00.000Z',
		   	        allDay: false	
	    	};
            infoJsonArray.push(newEvent); //배열에 object 넣기  
            targetPath.attr("add", "true");
        }

        function setJsonEdit(targetPath, start_, end_) {
            console.log(start_+"+"+end_);
            //start, end 똑같은 path 찾아서 title 수정
            //중복일정 시 수정 필요 x : 똑같은 시간으로 만들지 않을 것이기 때문
            for (var i=0; i<infoJsonArray.length; i++) {
                if(infoJsonArray[i].calendar_start == targetDate+"F"+start_+"Z" && infoJsonArray[i].end == targetDate+"F"+end+"Z" ){
                    infoJsonArray[i].title = d.data.label;
                }       
            }     
        }

        function setJsonRemove(target) {
            //삭제한 id를 DB에 전송
            console.log("delete");
            $.ajax({
                url: '/calendar/remove',
                type: 'POST',
                data: { events: JSON.stringify(idadd) },
                dataType: "json",            
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
    }

    function drawClock() { //create all the clock elements
        updateClock();	//draw them in the correct starting position
        var svg = d3.select("#graph").append("svg")
            .attr("width", Cw+30)
            .attr("height", Ch+30)
            .attr("x", 60)
            .attr("y", 60)
            .style("fill", "white")
            .style("opacity", "0.8");

        var face = svg.append('g')
            .attr('id','clock-face')
            .attr('transform','translate(' + (clockRadius + margin) + ',' + (clockRadius + margin) + ')');

        face.selectAll('.hour-label')
            .data(d3.range(3,13,3))
                .enter()
                .append('text')
                .attr('class', 'hour-label')
                .attr('text-anchor','middle')
                .attr('x',function(d){
                    return hourLabelRadius*Math.sin(hourScale(d)*radians);
                })
                .attr('y',function(d){
                    return -hourLabelRadius*Math.cos(hourScale(d)*radians) + hourLabelYOffset;
                })
                .text(function(d){
                    return d;
                });

        var hands = face.append('g').attr('id','clock-hands')
                        .style("fill", "white");

        face.append('g').attr('id','face-overlay')
            .append('circle').attr('class','hands-cover')
                .attr('x',0)
                .attr('y',0)
                .attr('r',clockRadius/60);
                
        hands.selectAll('line')
            .data(handData)
                .enter()
                .append('line')
                .attr('class', function(d){
                    return d.type + '-hand';
                })
                .attr('x1',0)
                .attr('y1',function(d){
                    return d.balance ? d.balance : 0;
                })
                .attr('x2',0)
                .attr('y2',function(d){
                    return d.length;
                })
                .attr('transform',function(d){
                    return 'rotate('+ d.scale(d.value) +')';
                });
    }

     function moveHands(){
         d3.select('#clock-hands').selectAll('line')
           .data(handData)
           .transition()
           .attr('transform',function(d){
               return 'rotate('+ d.scale(d.value) +')';
            });
     }

     function updateClock(){
          var t = new Date();
          handData[0].value = (t.getHours() % 12) + t.getMinutes()/60 ;
          handData[1].value = t.getMinutes();
     }

      setInterval(function(){
          updateClock();
          moveHands();
      }, 1000);

      d3.select(self.frameElement).style("height", Ch + "px");
	}

    $("#percentage").on('click', function() {
        alert("clickllll");
    });

    function buildDayHtml() {
        $(".agendaDay").remove(); //기존의 테이블 제거
        $('#fc-content').append("<div class = " + "'fc-view-agendaDay'>"+ "<svg id = " + "'graph' xmls=" + "'http://www.w3.org/2000/svg'> <foreignobject id=" + "'percentage' x="+
        "'250' y=" + "'250'>" + "</foreignobject></svg></div>"); 
    }
});