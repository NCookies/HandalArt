var w = 400;
var h = 400;
var r = h/2;
var color = d3.scale.category20c();

var data = [{"label":"Category A", "value":20}, 
		     {"label":"Category B", "value":50}, 
		     {"label":"Category C", "value":30}];


var vis = d3.select('#graph').append("svg:svg")
            .data([data])
            .attr("width", w)
            .attr("height", h)
            .append("svg:g")
            .attr("transform", "translate(" + r + "," + r + ")"); //원의 중심 지정
            
var arc = d3.svg.arc().outerRadius(r).innerRadius(r-100);
            
var pie = d3.layout.pie()
            .value(function(d){ return d.value; });
            
var paths = vis.selectAll("g.slice")
              .data(pie).enter()
              .append("svg:g")
              .attr("class", "slice")
              .append("path")
              .on("click", function(d) {
                  d.data.value = 80;
                  paths.each(change); //path마다 함수 실행
              });
                  
paths.transition().duration(500)
.attr("fill", function(d, i){ return color(i); })
.attr("d", arc)
.each(function(d) { this._current = d; });

function change(d) {
    console.log(data);
    paths.data(pie(data)); // compute the new angles
    paths.transition().duration(750).attrTween("d", arcTween); // redraw the paths
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