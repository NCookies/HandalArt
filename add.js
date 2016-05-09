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
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//데이터 로딩
d3.csv("add.csv", type, function(error, data) {
  if (error) throw error;

//데이터를 파이로, class를 arc로
var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

// path 태그 속성 값 지정
g.append("path")
    .attr("d", arc)
    .each(function(d, i) {
        d3.select(this)
        .attr("index", i);
    })
    .style("fill", function(d) { return color(d.data.name); })
    .on("dragstart", function (d) {
        console.log("start");
    })
    .on("drag", function (d) {
        d3.select(this)
        .classed("dragging", true)
        .style("fill", "#d3d3d3");
        console.log("drag");
      
    })
    .on("dragend", function (d) {
        console.log("end");
    });
/*
    .on("click", function(d) { //클릭 시 색 바뀜
        d3.select(this)
        .style("fill", "#80aaff");
    })

    .on("click", function(d) { //파이의 색깔에 따라 결정됨. 미완성
        if(d3.select(this).style == "#ffffff") {
            console.log ('asda');
            d3.select(this).style("fill", "#80aaff");
        }
        else { //index +1 한 후 색 변경
            d3.select()
        }
    })
*/

// text 태그 속성 값 지정 
g.append("text")
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.data.name; });
});

// 툴 팁 생성
var tooltip = d3.select('arc')
    .append('div')
    .attr('class', 'tooltip');
    
tooltip.append('div')
    .attr('class', 'name');
    
tooltip.append('div')
    .attr('class', 'hour');
    
/*tooltip.append('div')
    .attr('class', 'percent');*/

d3.csv('add.csv', function(error, dataset) {
    dataset.forEach(function(d) {
        d.count = +d.count;
    });

g.on('mouseover', function(d) {
    var total = d3.sum(dataset.map(function(d) {
        return d.count;
    }));
    var percent = Math.round(1000 * d.data.count / toal) / 10;
    tooltip.select('.name').html(d.data.name);
//    tooltip.select('.hour').html(d.data.hour);
    tooltip.select('.percent').html(d.data.percent + '%');
    tooltip.style('display', 'block');
});

g.on('mouseout', function(d) {
    tooltip.style('display', 'none');
}) 

function type(d) {
  d.hour = +d.hour;
  return d;
}

/*드래그 함수들
function dragstarted(d) {
            console.log ('a');
    d3.event.sourceEvent.stopPropation();
    d3.selet(this).classed("dragging", true);
}

function dragged(d) {
                console.log ('b');

    d3.select(this)
    .style("fill", "#80aaff");
}

function dragended(d) {
                console.log ('C');

    d3.select(this).classed("dragging", false);
}*/

/* 버튼 누르면 텍스트 생기고 클래스 이름 지정
(function($) {
    $(document).ready(function() {
        $('input.but').on('click', function() {
            $('path').each(function(index) {
                $(this).addClass('csv' + index);
            });
           console.log('dfsdf');
           $('text').text('sdfds');
          // $('path').attr('style', 'fill: rgb(50, 50, 50)');
          d3.select("tihs").style("fill", "purple");
        });
    });
})(jQuery);
*/