(function($) {
    $(document).ready(function() {
        
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
      
        $(".mandal-top, .mandal-mid, .mandal-bot")
        .load('/mandal/table', function() {
            // mandal_table.html 을 불러와서 8개의 테이블 생성
            console.log('Loaded Table Successfully!')
        });
        
        $(".mandal-center")
        .load('/mandal/table/center', function() {
            console.log('Loaded Center Table Successfully!')
        });
        
        $(document).one('mouseover', function() {
            $(".table-article")
            .append
            ('<textarea id="text-field" style="border:0" cols="5" rows="5" readonly="true"></textarea>')
            .append
            ('<input type="button" value="..." class="input-button">');
            
            $('.input-button').css('visibility', 'hidden');
            
            // $('body').removeClass('zoomTarget');
            
            $('.input-button').on('click', function() {            
                var $this = $(this);
                
                $(this).prev().attr("readonly", false); // 더블클릭 이벤트를 받았을 때 TextArea 편집 가능
                $(this).prev().focus();
                
                fc_chk_byte($this.prev(), 22);
                
                return false;
            });
            
            $('.table-article').on('mouseover', function(e) {
                $(this).children('.input-button').css('visibility', 'visible');
                
                //return false;
            });
            
            $('.table-article').on('mouseleave', function(e) {  
                $(this).children('.input-button').css('visibility', 'hidden');
                $(this).children('#text-field').attr('readonly', true);
                
                //return false;
            });
            
            settings = {
                targetsize: 0.3,

                scalemode: "both",

                duration: 450,

                easing: "ease",

                root: $(document.body),

                debug: false,

                animationendcallback: null,

                closeclick: true,

                preservescroll: true
            }
            
            /*$('.table-article').on('mouseover', function() {
                $('.zoomTarget').zoomTarget(settings);
              
                return false;                
            });*/
            
            $('.zoomTarget').on('dblclick', function(e) {
                var $this = $(this);
                
                switch ($(this).attr('id')) {
                    case 'mandal-zoom1': 
                        $('#mandal1').zoomTo();
                        return false;

                    case 'mandal-zoom2':
                        $('#mandal2').zoomTo();
                        return false;
                     
                    case 'mandal-zoom3':
                        $('#mandal3').zoomTo();
                        return false;
                        
                    case 'mandal-zoom4':
                        $('#mandal4').zoomTo();
                        return false;
                            
                    case 'mandal-zoom5':
                        $('#mandal5').zoomTo();
                        return false;
                        
                    case 'mandal-zoom6':
                        $('#mandal6').zoomTo();
                        return false;
                    
                    case 'mandal-zoom7':
                        $('#mandal7').zoomTo();
                        return false;
                        
                    case 'mandal-zoom8':
                        $('#mandal8').zoomTo();
                        return false;
                            
                    default:
                        $(this).zoomTo(settings);
                        e.stopPropagation();
                }
                
            });
            
            $(window).on('click', function(e) {
                $('body').zoomTo(settings);
                
                return false;
            });
            
            $('body').zoomTo();
        // after loaded all DOM    
        });
    });
         
})(jQuery);
