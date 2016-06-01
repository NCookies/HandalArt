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

    //가독성 위해 jQuery로 바꿔서 modal이랑 통합 필요
    function mousedown(d) {
        sumValue = 0;
        //isfilled = d3.select(this).classed("filling"); //hasclass
        
        d3.select(this).classed("filling", true); //addclass
        sumValue += d.value;
        d.data.value = 0;
        dragging = true;   
        
    }
        
    function mouseover(d) {
        if( dragging ) {
            d3.select(this).classed("filling", true);
            sumValue += d.value;
            d.data.value = 0;
        }
        
        var percentage = (100 * d.value / sumData(data) ).toPrecision(3);
        var percentageString = percentage + "%";
        if (percentage < 0.1) { percentageString = "< 0.1%"; }     
        d3.select("#percentage")
            .text(percentageString+"　　　　"+d.data.label);

        $("path").attr("opacity", "0.3");
        $("path").filter(".filling").attr("opacity", "1");
    }

    function mouseup(d) {
        dragging = false;
        d.data.value = sumValue;
        target = d3.select(this).attr("index"); //추가 된 파이 식별하기 위해 필요

        jQuery.each(change(d, target));      
        edit(d); //처음에 일정이름 추가
    }

    function sumData(data) {
        var arr = 0;
        var str = $.parseJSON(JSON.stringify(data));
            
        for (var i = 0; i < 24; i++) {
            arr += str[i].value;
        }
        return arr;
    }

    $("g").on("mouseout", function() {
        $("path").attr("opacity", "1");
    });

    function change(d, target) {
        paths.data(pie(data)); // compute the new angles
        jQuery.each( $("path"), function (d) {
            if( $(this).attr("index") == target ) {
                $(this).css("fill", color[Math.floor(Math.random() * color.length)]);
            }
        })
        //.attr("fill", function(d, i){ return color(i); });
    
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

    function edit(d) { 
        $("#createModal").modal({ backdrop: true });
        
        $("#save").on("click", function() {
            var label = $("#label").val(); // 입력받은 일정 이름
            d.data.label = label;
            $(this).css("clickOutside", true); // 화면 밖이나 x 클릭하면 modal close
            $("#label").val(''); // reset textbox

        });

        $("#remove").on("click", function(d) {
            d.value = 0;
            $(this).css("clickOutside", true);
        });
    }

    function drawClock(){ //create all the clock elements
        updateData();	//draw them in the correct starting position
        var svg = d3.select("#graph").append("svg")
            .attr("width", Cw)
            .attr("height", Ch)
            .attr("x", clockRadius/3.8)
            .attr("y", clockRadius/4)
            .style("opacity", "0.5");

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

        var hands = face.append('g').attr('id','clock-hands');

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

     function updateData(){
          var t = new Date();
          handData[0].value = (t.getHours() % 12) + t.getMinutes()/60 ;
          handData[1].value = t.getMinutes();
     }

      setInterval(function(){
          updateData();
          moveHands();
      }, 1000);

      d3.select(self.frameElement).style("height", Ch + "px");

});
