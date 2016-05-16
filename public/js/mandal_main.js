$(document).ready(function() {
    $(".mandal-top, .mandal-mid, .mandal-bot").load('/mandal/table', function() {
        // mandal_table.html 을 불러와서 9개의 테이블 생성
        console.log("Table was loaded!!");
    });
});
$(function() {
    $("#mandal-container").draggable({ containment: ['.article'] });                                                                    
});

$(document).ready(function() {
    $('#mandal-container').bind('mousewheel', function(e){
        // 마우스 휠 이벤트를 받았을 때 테이블을 확대 또는 축소를 함
        var delta;
        var zoom = $('#mandal-container').css("zoom");
        var scale = 0;
        
        if (e.originalEvent.wheelDelta > 0)
        {
            scale = parseFloat(zoom) + 0.1
            if (scale > 2.0) {
                console.log("Can not expand more!!");
                return;
            }
            $('#mandal-container').css("zoom", parseFloat(scale));
        }

        else
        {
            scale = parseFloat(zoom) - 0.1;
            if (scale < 1.0) {
                console.log("Can not reduce more!!");
                return;
            }
            $('#mandal-container').css("zoom", parseFloat(scale));
        }
    });
});