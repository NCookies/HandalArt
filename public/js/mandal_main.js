(function($) {
    $(document).ready(function() {
        
        var fc_chk_byte = function(aro_name, ari_max, keyCode) {
            
            var ls_str = aro_name.val(); // 이벤트가 일어난 컨트롤의 value 값
            var li_str_len = ls_str.length; // 전체길이

            var li_max = ari_max; // 제한할 글자수 크기
            var i = 0; // for문에 사용
            var li_byte = 0; // 한글일경우는 2 그밗에는 1을 더함
            var li_len = 0; // substring하기 위해서 사용
            var ls_one_char = ""; // 한글자씩 검사한다
            var ls_str2 = ""; // 글자수를 초과하면 제한할수 글자전까지만 보여준다.

            if (li_byte > li_max - 3 &&keyCode == 8) {
                console.log('backspace');
                return li_byte - 1;
            }
            
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
            
            return li_byte;
        }
        
        $(".table-article")
            .append
            ('<textarea class="text-field" style="border:0" cols="5" rows="5" readonly="true"></textarea>')
            .append
            ('<input type="button" value="..." class="input-button">');
            
        $('.input-button').css('visibility', 'hidden');
        // html 이 페이지에 로딩되었을 때 기본 동작
                    
        $('.input-button').on('click', function() {            
            $(this).prev().attr("readonly", false);
            $(this).prev().focus();
            
            return false;
        });
        // 버튼 클릭 시 텍스트 필드에 입력 가능 및 커서
            
        $('.text-field').on('keydown', function(event) {
            var keyCode = event.keyCode ? event.keyCode : event.which;
            
            fc_chk_byte($(this), 20, keyCode);
        });
        
        $('.table-article').on('mouseover', function(e) {
            e.stopPropagation();
            
            $(this).children('.input-button').css('visibility', 'visible');
            
            //return false;
        });
            
        $('.table-article').on('mouseleave', function(e) { // 마우스가 영역 떠났을 때
            $(this).children('.input-button').css('visibility', 'hidden');
            $(this).children('.text-field').attr('readonly', true);
            
            var article = $(this).children('.text-field').val();
            var center_table_id = $(this).attr('id');
            var table_id;
            
            if ($(this).hasClass('center')) {
                table_id = $(this).parents('.mandal-top, .mandal-mid, .mandal-bot').attr('id');
            }
                            
            switch (true) {
                case center_table_id == 'mandal-zoom1': 
                    $('#mandal1').find('.center').children('.text-field').val(article);
                    return false;
                    
                case center_table_id == 'mandal-zoom2':
                    $('#mandal2').find('.center').children('.text-field').val(article);
                    return false;
                    
                case center_table_id == 'mandal-zoom3':
                    $('#mandal3').find('.center').children('.text-field').val(article);
                    return false;
                    
                case center_table_id == 'mandal-zoom4':
                    $('#mandal4').find('.center').children('.text-field').val(article);
                    return false;
                        
                case center_table_id == 'mandal-zoom5':
                    $('#mandal5').find('.center').children('.text-field').val(article);
                    return false;
                    
                case center_table_id == 'mandal-zoom6':
                    $('#mandal6').find('.center').children('.text-field').val(article);
                    return false;
                
                case center_table_id == 'mandal-zoom7':
                    $('#mandal7').find('.center').children('.text-field').val(article);
                    return false;
                    
                case center_table_id == 'mandal-zoom8':
                    $('#mandal8').find('.center').children('.text-field').val(article);
                    return false;
                    
                case table_id == 'mandal1': 
                    $('#mandal-zoom1').children('.text-field').val(article);
                    return false;
                    
                case table_id == 'mandal2': 
                    $('#mandal-zoom2').children('.text-field').val(article);
                    return false;
                    
                case table_id == 'mandal3': 
                    $('#mandal-zoom3').children('.text-field').val(article);
                    return false;
                    
                case table_id == 'mandal4': 
                    $('#mandal-zoom4').children('.text-field').val(article);
                    return false;
                    
                case table_id == 'mandal5': 
                    $('#mandal-zoom5').children('.text-field').val(article);
                    return false;
                    
                case table_id == 'mandal6': 
                    $('#mandal-zoom6').children('.text-field').val(article);
                    return false;
                    
                case table_id == 'mandal7': 
                    $('#mandal-zoom7').children('.text-field').val(article);
                    return false;
                    
                case table_id == 'mandal8': 
                    $('#mandal-zoom8').children('.text-field').val(article);
                    return false;
                        
                default:
                    return false;
            }
        }); // mouseleave 이벤트 종료
                    
        zoom_settings = {
            targetsize: 0.3,
            scalemode: "both",
            duration: 500,
            easing: "ease",
            root: $('.zoomContainer'),
            debug: false,
            animationendcallback: null,
            closeclick: true,
            preservescroll: true
        }
        
        settings = {
            targetsize: 0.3,
            scalemode: "both",
            duration: 500,
            easing: "ease",
            root: $(document.body),
            debug: false,
            animationendcallback: null,
            closeclick: true,
            preservescroll: true
        }
        
        /*$('.zoomTarget').on('mouseover', function() {
            console.log('clicked');
            $('.zoomTarget').off('click')
        });*/
        
        $('.zoomTarget').on('dblclick', function(e) {          
            //$(this).zoomTarget(zoom_settings); // .zoomTarget을 준비상태로...
            switch ($(this).attr('id')) {
                // 최종목표 주위의 목표들을 클릭하면 해당 테이블로
                case 'mandal-zoom1': 
                    //e.stopPropagation();
                    $('#mandal1').find('.center').zoomTo(zoom_settings);
                    return false;

                case 'mandal-zoom2':
                    //e.stopPropagation();
                    $('#mandal2').find('.center').zoomTo(zoom_settings);
                    return false;
                    
                case 'mandal-zoom3':
                    //e.stopPropagation();
                    $('#mandal3').find('.center').zoomTo(zoom_settings);
                    return false;
                    
                case 'mandal-zoom4':
                    //e.stopPropagation();
                    $('#mandal4').find('.center').zoomTo(zoom_settings);
                    return false;
                        
                case 'mandal-zoom5':
                    //e.stopPropagation();
                    $('#mandal5').find('.center').zoomTo(zoom_settings);
                    return false;
                    
                case 'mandal-zoom6':
                    //e.stopPropagation();
                    $('#mandal6').find('.center').zoomTo(zoom_settings);
                    return false;
                
                case 'mandal-zoom7':
                    //e.stopPropagation();
                    $('#mandal7').find('.center').zoomTo(zoom_settings);
                    return false;
                    
                case 'mandal-zoom8':
                    //e.stopPropagation();
                    $('#mandal8').find('.center').zoomTo(zoom_settings);
                    return false;
                        
                default:
                    //e.stopPropagation();
                    $(this).zoomTo(zoom_settings);
                    return false;
            }
        });
            
        /*$(window).on('dblclick', function(e) {
            $('body').zoomTo(settings);
            
            return false;
        });*/
        //$('body').zoomTo(settings);
    });
})(jQuery);
