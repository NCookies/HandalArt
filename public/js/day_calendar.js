var w = 400;
var h = 400;
var r = h/2;

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

var color = d3.scale.category20c();

var vis = d3.select('#graph').append("svg:svg")
            .data([data])
            .attr("width", w)
            .attr("height", h)
            .append("g")
            .attr("transform", "translate(" + r + "," + r + ")"); //원의 중심 지정
            
var arc = d3.svg.arc().outerRadius(r).innerRadius(r-100);
            
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
//.attr("fill", function(d, i){ return color(i); })
.attr("fill", "white")
.attr("d", arc)
.each(function(d) { this._current = d; });

$("percent").click(function() {
    console.log("Dd");
})
// draggable 
// api.jqueryui.com/draggable/#event-drag
// containment: ".slice", //limit area
var dragging;
var isfilled = false;
var sumValue = 0;
var target;

//가독성 위해 jQuery로 바꿔서 modal이랑 통합 필요
function mousedown(d) {
    sumValue = 0;
    isfilled = d3.select(this).classed("filling");
    if( isfilled ){
        edit(); //이미 있는 일정의 이름 수정
    }
    else {
        d3.select(this).classed("filling", true);
        sumValue += d.value;
        d.data.value = 0;
        dragging = true;   
    }
}
    
function mouseover(d) {
    if( dragging ) {
        d3.select(this).classed("filling", true);
        sumValue += d.value;
        d.data.value = 0;
    }
}

function mouseup(d) {
    edit(); //처음에 일정이름 추가

    dragging = false;
    target = d3.select(this).attr("index"); //추가 된 파이 식별하기 위해 필요
    d.data.value = sumValue;
    paths.each(change);
}

// 수정필요: 마지막 path 찾기 위해 index비교 하고 색깔 바꿈.      
function change(d) {
    paths.data(pie(data)); // compute the new angles
/*
    if ( d3.select(this).attr("index") == target ) {
        console.log(this); 
        d3.select(this).attr("fill", function(d, i){ return color(i); });
    }
*/
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

function edit() {
    $("#createModal").modal({backdrop: true});
}

/*$(document).ready(function(){
    //색깔이 이미 채워져 있을 때 일정 수정 or 삭제
    $("path").mouseup(function(){
        if( !isfilled ) {
           $("#myModal").modal({backdrop: true});
        }
    });*/
    
