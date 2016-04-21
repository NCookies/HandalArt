$(document).ready(function() {
    $(".table-article").append
    ('<textarea id="text-field" style="border:0" cols="5" rows="5" readonly="true"></textarea>');
    //$(".table-article").append('<input type="text" id="text-field" style="border:0" readonly="true">');
    // 모든 테이블에 TextArea 생성
});

(function($) {
    $(document).ready(function() {
        settings = {
            // zoomed size relative to the container element
            // 0.0-1.0
            targetsize: 0.35,
            // scale content to screen based on their size
            // "width"|"height"|"both"
            scalemode: "both",
            // animation duration
            duration: 450,
            // easing of animation, similar to css transition params
            // "linear"|"ease"|"ease-in"|"ease-out"|"ease-in-out"|[p1,p2,p3,p4]
            // [p1,p2,p3,p4] refer to cubic-bezier curve params
            easing: "ease",
            // use browser native animation in webkit, provides faster and nicer
            // animations but on some older machines, the content that is zoomed
            // may show up as pixelated.
            //nativeanimation: true,
            // root element to zoom relative to
            // (this element needs to be positioned)
            root: $(document.body),
            // show debug points in element corners. helps
            // at debugging when zoomooz positioning fails
            debug: false,
            // this function is called with the element that is zoomed to in this
            // when animation ends
            animationendcallback: null,
            // this specifies, that clicking an element that is zoomed to zooms
            // back out
            closeclick: true,
            // don't reset scroll before zooming. less jaggy zoom starts and ends on
            // mobile browsers, but causes issues when zooming to elements when scrolled
            // to a specific distance in document, typically around 2000px on webkit.
            preservescroll: true
        }
        /*$('.zoomTarget').click(function(event) {
            $(this).zoomTo(settings);        
            event.stopPropagation();
        });
        
        $('#mandal-container').click(function(evt) {
            $("body").zoomTo();            
            evt.stopPropagation();
        });
        $("body").zoomTo();*/
        
        $('td').click(function (e) {
            var $this = $(this);
            
            if ($this.hasClass('clicked')){
                //here is your code for double click
                var fc_chk_byte = function(aro_name, ari_max) {
                    var ls_str = aro_name.val(); // 이벤트가 일어난 컨트롤의 value 값
                    var li_str_len = ls_str.length; // 전체길이

                    var li_max = ari_max; // 제한할 글자수 크기
                    var i = 0; // for문에 사용
                    var li_byte = 0; // 한글일경우는 2 그밗에는 1을 더함
                    var li_len = 0; // substring하기 위해서 사용
                    var ls_one_char = ""; // 한글자씩 검사한다
                    var ls_str2 = ""; // 글자수를 초과하면 제한할수 글자전까지만 보여준다.

                    for (i = 0; i < li_str_len; i++) {
                        // 한글자추출
                        ls_one_char = ls_str.charAt(i);

                        // 한글이면 2를 더한다.
                        if (escape(ls_one_char).length > 4) {
                            li_byte += 2;
                        }
                            // 그밗의 경우는 1을 더한다.
                        else {
                            li_byte++;
                        }

                        // 전체 크기가 li_max를 넘지않으면
                        if (li_byte <= li_max) {
                            li_len = i + 1;
                        }
                    }

                    // 전체길이를 초과하면
                    if (li_byte > li_max) {
                        console.log(li_max + " Cannot input more. \n The exceed information will be automatically deleted. ");
                        ls_str2 = ls_str.substr(0, li_len);
                        aro_name.val(ls_str2);
                    }
                }
                
                //if ($this.attr('class') == 'zoomTarget') {
                    var input_table = $(this).children().first(); // 선택한 테이블의 TextArea에 접근하기 위해 변수 선언, Table이 선택됨
                    var article;
                    
                    $(input_table).addClass("input-field");
                    $(input_table).attr("readonly", false); // 더블클릭 이벤트를 받았을 때 TextArea 편집 가능
                    
                    $('.input-field').on('keydown', function(event) { 
                        fc_chk_byte(input_table, 22);
                        // Enter 입력 이벤트
                        if (event.keyCode == 13) {
                            event.stopPropagation();
                            article = $('.input-field').val();
                            $('td #text-field').removeClass('input-field').attr("readonly", true);
                        }
                    });
                    $(document).on('click', function(event) { 
                        // 해당 Text Field 영역을 제외한 클릭 이벤트
                        if ($(event.target).closest('.input-field') > 0) {
                            console.log('clicked');
                            return;
                        }
                        else {
                            event.stopPropagation();
                            article = $('.input-field').val();
                            $('td #text-field').removeClass('input-field').attr("readonly", true);
                        }
                    }); 
                //}
                
                return;
            } else{
                $this.addClass('clicked');
                //your code for single click
                
                if ($this.hasClass('zoomTarget')) {
                    $(this).zoomTo(settings);
                }
                event.stopPropagation();
                
                setTimeout(function() { 
                        $this.removeClass('clicked'); }, 500);
            }//end of else
        });
        
        $('#mandal-container').click(function(evt) {
            $("body").zoomTo();            
            evt.stopPropagation();
        });
        $("body").zoomTo();

    });
    
})(jQuery);
