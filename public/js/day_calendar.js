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
    
var isMouseDown = false, isfilled;
var arr = 0;

/*
http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart
정확히는 모르겠지만 DOM과 연결해 높이, 너비를 지정하는 듯
*/
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

$(document).ready(function() {

    //데이터 로딩
    d3.csv("add.csv", type, function(error, data) {
        if (error) throw error;
  
       //데이터를 파이로, class를 arc로 만듬
       var g = svg.selectAll(".arc")
       .data(pie(data))
       .enter().append("g")
       .attr("class", "arc")    
       
        g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.name); }) 
        .each(function(d, i) { //각 파이의 인덱스 지정
            d3.select(this)
            .attr("index", i)
        })
        .style("fill", function(d) { return color(d.data.name); })
            
        .on("mousedown", function () { 
            isMouseDown = true;
            $(this).toggleClass("filling");
            isfilled = $(this).hasClass("filling");
            return false; // prevent text selection
        })
        .on("mouseover", function() {
            if (isMouseDown) {
                $(this).toggleClass("filling", isfilled);
                //collect index
                arr = $(this).index;
                console.log(arr);
            }
            
            var percentage = (100 * d.hour / totalSize).toPrecision(3);
            var percentageString = percentage + "%";
            if (percentage < 0.1) {
                percentageString = "< 0.1%";
            }
            d3.select("#percentage")
            .text(percentageString);
            
        })
        .on("mouseup", function() { //중복선택되도 일정 따로 생성하기
            if(isfilled) { //중복선택시 isMousedown으로 
                var eventName = window.prompt('event name', '');
                //select only save index
                
                $(this).next().text( eventName );
            }
            isMouseDown = false;
        });
  
        //text 태그
        g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em");  
      
    })
})
    function type(d) {
        d.hour = +d.hour;
        return d;
    }
