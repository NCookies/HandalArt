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

var eventsArray;

var insertOrUpdateCalendar = function(calendar) {
	eventsArray = JSON.stringify((calendar.fullCalendar('clientEvents').map(function(e) {
		return {
			id: e._id,
			start: e.start,
			end: e.end,
			title: e.title,
			allday: e.allDay
		};
	})));

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
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	var calendar = $('#calendar').fullCalendar(
	{
		lang : 'ko',
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
			allDayDefault: true, // false일 때 하루종일 수행하는 일정을 추가했을 경우 주에서 all-day에 표시되지 않고 시간대를 처음부터 끝까지 차지함
			weekends: true, // false일 때 주말 안나옴
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
		defaultView: 'month',
		selectable: true,
		selectHelper: true,
		select: function(start, end, allDay) // dayClick 함수는 클릭이벤트만 있는 반면, select 함수는 드래그이벤트도 있음
		{
			$('#addModal').modal
			({
  					title: event.title,
   					content: event.content
			});

            $("#addModal").off("keydown").on("keydown", function(evt) {
                enterKey(evt, "#add");
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
		   	        allDay: allDay,
                    _id: Math.floor(Math.random() * 100000) + 1
	    	    };
                
				$('#calendar').fullCalendar('renderEvent', newEvent, 'stick');
				insertOrUpdateCalendar($('#calendar')); // DB 저장
				$('#addModal').modal('hide');
			});
			title = $('#addTitle').val('');		// 앞에 썼던 title 내용 초기화, 나중에 썼던 title 내용이 지금까지 클릭했던 모든 날에 들어감

		},
		
		eventClick: function(event, calEvent, jsEvent, view, element) 
		{
  			$('#editModal').modal ({
    				title: event.title,
   					content: event.content
   			});

            $("#editModal").off("keydown").on("keydown", function(evt) {
                enterKey(evt, "#edit");
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
                $('#calendar').fullCalendar('removeEvents', calendarId);
				$('#editModal').modal('hide');
                $.ajax({
                    url: '/calendar/remove',
                    type: 'POST',
                    data: { events: JSON.stringify(calendarId) },
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
 			title = $('#editTitle').val(event.title); // title란에 기존에 입력했던 event의 이름이 나옴
		},
		editable: true, // 드래그로 일정 위치 및 크기 수정
		eventLimit: true
 	});

function enterKey(evt, buttonId) {
    var keyCode = evt.keyCode || evt.which;
    if(evt.keyCode == 13)
        $(buttonId).trigger("click");
}

$(".fc-button-agendaWeek").on("click", function() {
    $(".fc-view-agendaDay").remove(); // d3 제거
    $("#sequence").remove(); // 라디오버튼 제거	
});

$(".fc-button-month").on("click", function() {
    $(".fc-view-agendaDay").remove(); 
    $("#sequence").remove(); 
});

$(".fc-button-agendaDay").on("click", function() {
    buildDayPie();    
});

function buildDayPie() {
    buildDayHtml();
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
                .attr("transform", "translate(" + Gr + "," + Gr + ")"); // 원의 중심 지정

    var arc = d3.svg.arc().outerRadius(Gr).innerRadius(Gr-130);

    var pie = d3.layout.pie()
                .value(function(d){ return d.value; })
                .sort(null);

    var paths = vis.selectAll(".slice")
                .data(pie).enter()
                .append("g")
                .attr("class", "slice")
                .append("path")
                .each(function(d, i) { // 각 파이의 인덱스 지정
                    d3.select(this)
                    .attr("index", i)
                })
                .on("mousedown", mousedown)
                .on("mouseover", mouseover)
                .on("mouseup", mouseup)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout);

    var tooltip = d3.selectAll(".slice")         
    .append('div')                          
    .attr('class', 'tooltip');           

    tooltip.append('div')                    
    .attr('class', 'label');                     

    tooltip.append('div')                   
    .attr('class', 'percent');            
        paths.transition().duration(500)
        .attr("d", arc)
        .each(function(d) { this._current = d; });

    var dragging;
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

    // 데이터로 path 그리기
    eventsArray = JSON.stringify((calendar.fullCalendar('clientEvents').map(function(e) {
        return {
            id: e._id,
            start: e.start,
            end: e.end,
            title: e.title,
            allday: e.allDay
        };
    })));       

    //2016-07-11T01:30:00.000Z
    eventsArray = JSON.parse(eventsArray); // 배열로 만듬

    // 다음 날짜 버튼 누를 때마다 다시 그리기
    var date = $('#date').text().match(/\d+/g);
    for(var i=1; i<=2; i++) { //7을 07로 만듬
        if(date[i].length == '1')
        date[i] = "0"+date[i];
    }    
    date = date.join('-'); // 화면에 보여지는 날짜 보여줌

    // 화면에 보여지는 날짜와 배열의 이름 비교
    for(var i=0; i<eventsArray.length; i++) {
        var whole = eventsArray[i].start;        
        var startD = whole.substr(0,10);   
        if(startD == date) {
            // 날짜가 같으면 시간을 체크하고 path 재생성
            console.log("start"+startD);
            var startT = whole.substr(11,15);
            console.log(startT);

            var target = $('path').filter(function() {
                return $(this).data.label == startT;
            }).attr("index");
            change(target);
        }
    } 

    function sumData(data) { // 퍼센트 구할 때 필요
        var arr = 0;
        for (var i = 0; i < 24; i++) {
            arr += data[i].value;
        }
        return arr;
    }

   function mouseout(d) {
        tooltip.style('display', 'none');      
   }

   function mousemove(d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
            .style('left', (d3.event.layerX + 10) + 'px');
    }

   function mousedown(d) {
        dragging = true;
        sumValue = 0;
        startIndex = $(this).attr("index");
        sumValue += d.value;
        d.data.value = 0;
    }

    function mouseover(d) {
        $("#clock-face").on("mouseenter", function() {
            d3.select("#percentage")
            .text("EDIT")
            .on("dblclick", dblclick);
        });

        if( dragging ) {
            if( d.value == 30 ) {
                sumIndex += ($(this).attr("index")+",");
            }
            if( $(this).attr("index") > startIndex ){
                $('path').filter(function() {
                return $(this).attr('index') == startIndex;
                }).addClass("smallerFilling"); 
                $(this).addClass("smallerFilling");
            }
            else if( $(this).attr("index") < startIndex ){
                $('path').filter(function() {
                return $(this).attr('index') == startIndex;
                }).addClass("biggerFilling");
                 $(this).addClass("biggerFilling");
            }
            sumValue += d.value;
            d.data.value = 0;
            // mouse control
            // $("#graph").on("mouseover", mouseup($(this)));
            // $("#clock-face").on("mouseover", mouseup($(this)));
        }

        var percentage = (100 * d.value / sumData(data) ).toPrecision(3);
        var percentageString = percentage + "%";
        if (percentage < 0.1) { percentageString = "< 0.1%"; }     
        d3.select("#percentage")
        .text(d.data.label); 
        tooltip.select('.label').html(d.data.label);
        tooltip.select('.percent').html(percentageString);
        tooltip.style('display', 'block'); 
        
        $("path").css("stroke", "black").attr("opacity", "1");
        $("path").filter(function() {
            return $(this).attr("class") == "biggerFilling" || $(this).attr("class") == "smallerFilling";
        }).attr("opacity", "1");
    }
    
    $("g").on("mouseout", function() {        
        $("path").css("stroke", "rgba(0,0,0,0)").css("fill", "rgba(0,0,0,0);");
        $("path").filter(function() {
            return $(this).attr("class") == "biggerFilling" || $(this).attr("class") == "smallerFilling";
        }).attr("opacity", "1");
        
    });

    function mouseup(d) {
        dragging = false;
        d.data.value = sumValue;         
        if(sumIndex != " ") {
            $(this).attr("sumIndex", sumIndex);
            sumIndex = " ";    
        }
        
        // 오름차순 내림차순 구별하고 마지막path에 index저장
        if ($(this).attr("startIndex") == undefined) {
            $(this).attr("startindex", startIndex); // targetPath 속성에 저장
        }

        target = $(this).attr("index"); // 추가 된 파이 식별하기 위해 필요 
        var strDate = $('#date').text().match(/\d+/g); // 만들어진 날짜 파싱
        thatDate(d, $(this).attr("class"), strDate, target);
        editModal(d); // 처음에 일정이름 추가
    }

    // 이름 사용하기 위한 path, bigger or small 판단하는 필링클래스, 파싱한 날짜, 마지막path인덱스
    function thatDate(d, classN, strDate, target) {
        var fromTime, endTime;
        if(classN == "biggerFilling") { // biggerFilling의 d.data.label = starttime
            fromTime = d.data.label;
            endTime = time;
        } else {
            fromTime = time;
            endTime = d.data.label;
        }
        if(fromTime.length == 1)
            fromeTime = "0"+fromTime;
        if(endTime.length == 1)
            endTime = "0"+endTime;

        // 2016-07-06T06:00:00.000Z
        for(var i=1; i<=2; i++) { //7을 07로 만듬
            if(strDate[i].length == '1')
                strDate[i] = "0"+strDate[i];
        }

        // 두 개의 path에 각각 date를 저장함
        if(classN == "biggerFilling") {
            $("path").filter(function() {
                return $(this).attr("index") == target;
            }).attr("fromdate", strDate[0]+"-"+strDate[1]+"-"+strDate[2]+
                            "T"+fromTime+":00.000Z")
              .attr("todate", strDate[0]+"-"+strDate[1]+"-"+strDate[2]+
                            "T"+endTime+":00.000Z");
            return;
        }
        else {
            $("path").filter(function() {
                return $(this).attr("index") == target;
            }).attr("fromdate", strDate[0]+"-"+strDate[1]+"-"+strDate[2]+
                            "T"+fromTime+":00.000Z")
              .attr("todate", strDate[0]+"-"+strDate[1]+"-"+strDate[2]+
                            "T"+endTime+":00.000Z");
            return;
        }
    }

    function change(target) {
        paths.data(pie(data));
        $("path").filter(function() {
            return $(this).attr("index") == target;
        }).css("fill", color[Math.floor(Math.random() * color.length)]); // up한 path 색깔 바꿈

        paths.transition().duration(750)
        .attrTween("d", arcTween); // path 다시 그림
    }                            

    // 보이는 path들을 _currend에 저장
    // _current를 interpolate하고 바뀐 것을 업데이트함
    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);

        return function(t) {
            return arc(i(t));
        };
    }

    function editModal(d) {
        $("#editModal_day").modal();    
        // cancel했을 때 path생성 안되게
        var targetPath = $('path').filter(function() {
                return $(this).attr('index') == target;
        });
        var front = targetPath.attr("startIndex");
        var back = targetPath.attr("index");  
        if(front > back) {
            // 큰 수부터 드래그 시 숫자 바꿔줌
            var temp;
            temp = front;
            front = back;
            back = temp;
       }
       var start_ = calcTime(front);
       var end_ = calcTime(back);    
       var idadd="";
          
       // 엔터 키 사용
       $("#editModal_day").off("keydown").on("keydown", function(evt) {
           enterKey(evt, "#edit_day")
       });

        $("#edit_day").off('click').on('click', function() {
            d.data.label = $('#editTitle_day').val(); // change label  
            change(target);  // redraw path
            $('#editTitle_day').val(''); // reset textbox
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

        // sumIndex의 index를 가진 path.value = 30
        $("#remove_day").off('click').on('click', function() {
            if(targetPath.attr("sumIndex") == undefined) { // path를 1개만 선택했으면
                var time = calcTime(target);
                d.data.label = time;
                targetPath.removeClass();
                targetPath.attr("class", "");
                return;
            }
            var sumIndex = $('path').filter(function() {
                return $(this).attr('index') == target;
            }).attr("sumIndex");  
            var seperIndex = sumIndex.split(","); // sumIndex 배열로     
            var length = seperIndex.length; // path의 갯수 
            seperIndex.sort(function(left, right) { // 오름차순정렬
                 return left-right;
            });
            var lastnum=parseInt(seperIndex[length-1]); // 문자열로 인식하지 않게 하기위해     

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
        
        // path의 이름, 크기를 계산하고 다시그림
        function calcPath(i){
            if(i%2 == 0) // 2의 배수이면
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
            var fromDate = targetPath.attr("fromdate");
            var toDate = targetPath.attr("todate");
            if( targetPath.attr("add") == "true" ) {
                // 만들어진 일정이 있어서 수정으로 
                setJsonEdit(targetPath, fromDate, toDate);
                return;
            }  
            for (var i=0; i<3; i++)
                    idadd += targetPath.attr("index");
            idadd += (Math.floor(Math.random() * 1000000) + 1).toString();
            var newEvent = {
                    id: idadd,
	   		        title: d.data.label,
	   	    	    start: fromDate,
		   	        end: toDate,
		   	        allDay: false	
	    	};
            targetPath.attr("id", idadd);
            infoJsonArray.push(newEvent); // 배열에 object 넣기  
            targetPath.attr("add", "true");
        }

        function setJsonEdit(targetPath, fromDate, toDate) {
            // start, end 똑같은 path 찾아서 title 수정
            // 중복일정 시 수정 필요 x : 똑같은 시간으로 만들지 않을 것이기 때문
            for (var i=0; i<infoJsonArray.length; i++) {
                if( idadd = infoJsonArray[i].id ) {
                    console.log("in");
                    infoJsonArray[i].title = d.data.label;
                }       
            }   
        }

        function setJsonRemove(target) {
            // 삭제한 id를 DB에 전송
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

    function drawClock() {
        updateClock();
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

      // EDIT 모드시, 텍스트로 path생성
      function dblclick(){
            var fo = d3.select("#percentage");
            var ta = document.createElementNS("http://www.w3.org/1999/xhtml", "textbox");
            ta.rows = 3;
            ta.cols = 30;
            fo.appendChild(ta);
            document.getElementById("svg").appendChild(fo);

            d3.selectAll(".slice").off("mouseover");
      }

      // 라디오 버튼 value 값 조건 비교
      // 오전,오후 구별
      function div_OnOff(v,id){
          if(v == "1")  
              buildDayPie();
          else 
              buildDayPie();
      }

      function buildDayHtml() {
            $(".agendaDay").remove(); // 기존의 테이블 제거
            $('#fc-content').append("<div id='sequence'></div>");

            $('#fc-content').append("<div class ='fc-view-agendaDay'>"+
                "<svg id ='graph' xmls='http://www.w3.org/2000/svg'>"+
                "<foreignobject id=" + "'percentage' x='250' y='250'>" +
                "</foreignobject></svg></div>"); 

            $("#sequence").append( // 오전, 오후 라디오 버튼
                    "<label for='radio-am' class='radio-inline'>"+
                    "<input type='radio' value='1' name='quality' id='radio-am' onclick='div_OnOff(this.value,'graph');'> <span> 오전 </span>"+
                    "</label>"   +
                    "<label for='radio-pm' class='radio-inline'>"+
                    "<input type='radio' value='2' name='quality' id='radio-pm' checked='true' onclick='div_OnOff(this.value,'graph');'> <span> 오후 </span>"+
                    "</label>"               
            );
        }
});
