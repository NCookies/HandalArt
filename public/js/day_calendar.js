$(document).ready(function() {
 
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
                
    var arc = d3.svg.arc().outerRadius(Gr).innerRadius(Gr-100);
                
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
	clockRadius = 200,
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
            //千載一遇
            $("#graph").one("mouseleave", function() {
                console.log("leave");
                dragging = false;
                //$("path").removeAttr("class").removeClass(); //색깔 없앰
                //드래그 한 path들도 없어져야 함. 색깔뿐만아니라
                return;
            });
 
            $("#clock-face").one("mouseenter", function() {
                console.log("upup");
                $("path").off("mouseover");
                return;
            });*/
 
        if( dragging ) {
            if( d.value == 30 ) {
                sumIndex += ($(this).attr("index")+",");
            }
            if( $(this).attr("index") > startIndex ){
                $('path').filter(function() {
                return $(this).attr('index') == startIndex;
                //}).addClass("smallerFilling"); //mouseup path //addClass안됨ㅜㅜ
                }).attr("sort", "smaller").css("fill", "#bfbfbf");
                $(this).attr("sort", "smaller")
                       .css("fill", "#bfbfbf");
                //$(this).addClass("smallerFilling"); //red
            }
            else if( $(this).attr("index") < startIndex ){
                $('path').filter(function() {
                return $(this).attr('index') == startIndex;
                 }).attr("sort", "bigger").css("fill", "#bfbfbf");
                $(this).attr("sort", "bigger")
                       .css("fill", "#bfbfbf");
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
        
        $("path").css("stroke", "white").attr("opacity", "0.5");
                $("path").filter(function() {
            return $(this).attr("sort") == "smaller" || $(this).attr("sort") == "bigger";
        }).attr("opacity", "1");
    }
    
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
    Date.prototype.yyyymmdd = function() {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth() + 1).toString();
        var dd = this.getDate().toString();
        return yyyy + "-" + (mm[1] ? mm : '0'+mm[0]) + "-" + (dd[1] ? dd : '0'+dd[0]);
    }
 
    //mouse 관련 효과
    $("g").on("mouseout", function() {
        $("path").css("stroke", "black").attr("opacity", "0.5");
        $("path").filter(function() {
            return $(this).attr("sort") == "smaller" || $(this).attr("sort") == "bigger";
        }).attr("opacity", "1");
    });
 
 
 
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
 
       //use enter key
       $("#editModal").off("keydown").on("keydown", function(evt) {
           var keyCode = evt.keyCode || evt.which;
            if( evt.keyCode == 13 ) {
                $("#save").trigger("click");
            }
       });
 
        $("#save").off('click').on('click', function() { 
            d.data.label = $('#editTitle').val(); // change label  
            change(target);  // redraw path
            $('#editTitle').val(''); //reset textbox
            setJsonAdd(targetPath);
 
            $.ajax({
                url: "/calendar/day",
                type: "POST",
                data: JSON.stringify(infoJsonArray),
                dataType: "json",
                /*complete: function(response, textStatus) {
                     console.log("complete");
                },
                error:function(request,status,error){
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                }*/
            });
        });   
 
        //sumIndex의 index를 가진 path.value = 30
        $("#remove").off('click').on('click', function() {
            if(targetPath.attr("sumIndex") == undefined) { //path를 1개만 선택했으면
                var time = calcTime(target);
                d.data.label = time;
                targetPath.css("fill", "white");
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
 
//            if(targetPath.hasClass("smallerFilling")){
            if(targetPath.attr("sort") == "smaller"){
                console.log("smlaller");
                for(var i=seperIndex[1]-1; i<=lastnum; i++)
                    calcPath(i);
            }
//            else if(targetPath.hasClass("biggerFilling")){
            else if(targetPath.attr("sort") == "bigger"){
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
            }).removeAttr('style').removeClass()
              .attr("sumIndex", " "); 
        }         
 
        // 데이터 json 추가
        function setJsonAdd(targetPath) {
            if( targetPath.attr("add") == "true" ) {
                //만들어진 일정이 있어서 수정으로 
                setJsonEdit(targetPath, start_, end_);
                return;
            }  
            var targetDate = targetPath.attr("date");
            var newEvent = {
                start: targetDate+"F"+start_+"Z",
                end: targetDate+"F"+end_+"Z",
                title: d.data.label
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
            //check removing path's array index
            //바로 삭제안되고 후에 추가나 삭제를 해야 업데이트 됨.
            var x;
            for (i=0; i<infoJsonArray.length; i++) {
                if(infoJsonArray[i].calendar_Start_time == start_ && infoJsonArray[i].calendar_End_time == end_)
                    x = i;
            }         
            infoJsonArray.splice(x,1); //x번째 요소를 1개 없앰
        }    
    }
 
    $(".fc-button-agendaDay").on("click", function() { //상단에 있는 버튼을 클릭하면
        //start 날짜로 이동
        //start의 T로 짜르고 그 시간부터 end의 T로 자른 시간까지 일정만듬
    });
    
    function drawClock() { //create all the clock elements
        updateClock();	//draw them in the correct starting position
        var svg = d3.select("#graph").append("svg")
            .attr("width", Cw)
            .attr("height", Ch)
            .attr("x", clockRadius/3.8)
            .attr("y", clockRadius/4)
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
});