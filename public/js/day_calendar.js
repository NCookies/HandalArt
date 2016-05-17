var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

//파이 색깔 조정
var color = d3.scale.ordinal()
    .range(["#ffffff"]);

//arc 생성
var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

//label 생성
var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

//pie 크기 계산
var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.hour; });

/*
http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart
정확히는 모르겠지만 DOM과 연결해 높이, 너비를 지정하는 듯
*/
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//데이터 로딩
d3.csv("add.csv", type, function(error, data) {
  if (error) throw error;

//데이터를 파이로, class를 arc로 만듬
  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.name); }) 
    .each(function(d, i) { //각 파이의 인덱스 지정
        d3.select(this)
        .attr("index", i)
    })
    .style("fill", function(d) { return color(d.data.name); })
/*
    .on("dragstart", dragstart)
    .on("drag", drag)
    .on("dragend", function (d) {
        console.log("end");
    })
*/
    
    .on("mouseup", mousedown)
    .on("click", mouseup)
    .on("mousemove", mousemove);

//text 태그 속성 값 지정
  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.name; });
});

var userDrag = false;
var onMousedown;

function mousedown() {
    userdrag = true;
    d3.select(this)
//   .style("fill", "#80aaff");
//    onMousedown = d3.select(this).style("fill", "#80aaff"); //hasclass
    .classed("filling", true);
    console.log("onMousedown");
    return false;
}

function mouseover() {
    console.log("over");
}

function mouseup() {
//    d3.select(this)
//    .style("fill", "none"); 
    onMousedown = false;
    console.log("up");
}

function type(d) {
  d.hour = +d.hour;
  return d;
}


