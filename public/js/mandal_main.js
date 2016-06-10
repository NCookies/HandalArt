(function($) {
    $(document).ready(function() {
        /*var fc_chk_byte = function(aro_name, ari_max, keyCode) {

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
        }*/

        // html 이 페이지에 로딩되었을 때 기본 동작

        $("td")
        .append('<input type="button" value="" class="input-button">')
        .append('<p class="text-field"></p>')
        .append('<input type="hidden" name="mandalArticle" class="hidden-field">');

            /*.append
            ('<textarea class="text-field" style="border:0" cols="5" rows="5"></textarea>')*/

        $('.input-button').css('visibility', 'hidden');

        $('.input-button').on('click', function() {
            var text = prompt("내용을 입력해주세요", $(this).parent().text());
            if (text == null) text = '';

            $(this).next('.text-field').text(text)
            .next('.hidden-field').val(text);
            // table-article 안에 text-field라는 클래스의 엘리먼트가 있으면 편집

            return false;
        });
        // 버튼 클릭 시 텍스트 필드에 입력 가능 및 커서

        $('.table-article').on('mouseover', function(e) {
            e.stopPropagation();

            $(this).children('.input-button').css('visibility', 'visible');

            return false;
        });

        $('.mandalForm').on('submit', function(evt) {
            evt.preventDefault();
            var action = $(this).attr('action');
            var $container = $(this).closest('.formConatiner');
            console.log($(this).serialize());

            $.ajax({
               url: action,
               type: 'POST',
               data: $(this).serialize(),
               success: function(data) {
                    if (data.success) {
                        $container.html('<h2>Thank you!</h2>');
                    } else {
                        $container.html('There was a problem');
                    }
               },
               error: function() {
                   $container.html('There was a problem');
               }
            });
        });

        $('.table-article').on('mouseleave', function(e) { // 마우스가 영역 떠났을 때
            $(this).children('.input-button').css('visibility', 'hidden');

            var article = $(this).text();
            var center_table_id = $(this).attr('id');
            var table_id;

            if ($(this).hasClass('center')) {
                table_id = $(this).parents('.mandal-top, .mandal-mid, .mandal-bot').attr('id');
            }

            switch (true) {
                case center_table_id == 'mandal-zoom1':
                    $('#mandal1').find('.center').children('.text-field').text(article)
                    .next('.hidden-field').val(article);
                    return false;

                case center_table_id == 'mandal-zoom2':
                    $('#mandal2').find('.center').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case center_table_id == 'mandal-zoom3':
                    $('#mandal3').find('.center').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case center_table_id == 'mandal-zoom4':
                    $('#mandal4').find('.center').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case center_table_id == 'mandal-zoom5':
                    $('#mandal5').find('.center').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case center_table_id == 'mandal-zoom6':
                    $('#mandal6').find('.center').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case center_table_id == 'mandal-zoom7':
                    $('#mandal7').find('.center').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case center_table_id == 'mandal-zoom8':
                    $('#mandal8').find('.center').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case table_id == 'mandal1':
                    $('#mandal-zoom1').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case table_id == 'mandal2':
                    $('#mandal-zoom2').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case table_id == 'mandal3':
                    $('#mandal-zoom3').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case table_id == 'mandal4':
                    $('#mandal-zoom4').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case table_id == 'mandal5':
                    $('#mandal-zoom5').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case table_id == 'mandal6':
                    $('#mandal-zoom6').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case table_id == 'mandal7':
                    $('#mandal-zoom7').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                case table_id == 'mandal8':
                    $('#mandal-zoom8').children('.text-field').text(article)
                    .next('.hidden-field').val(article);;
                    return false;

                default:
                    return false;
            }
        }); // mouseleave 이벤트 종료

        zoom_settings = {
            targetsize: 0.25,
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

        $('.zoomTarget')
        .on('mouseover', function() {
            $(this).zoomTarget(zoom_settings); // .zoomTarget을 준비상태로...
        })
        .on('dblclick', function(e) {
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

        /*$(window).on('click', function(e) {
            $('body').zoomTo(zoom_settings);
            console.log($(this));

            return false;
        });*/
        //$('body').zoomTo();
    });
})(jQuery);
