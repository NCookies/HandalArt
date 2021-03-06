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

        $("html, body").animate({scrollTop: $('.zoomContainer').height()}, 1000);
        // 페이지가 로드 되었을 때 스크롤 이동(줌 했을 때 화면이 잘리지 않도록)


        $(".falseSub")
        .append('<input type="button" class="input-button btn btn-secondary"'
        + 'data-toggle="tooltip" title=" ">')
        .append('<p class="text-field"></p>')

        $(".detailGoal")
        .append('<input type="button" class="input-button btn btn-secondary"'
        + 'data-toggle="tooltip" title=" ">')
        .append('<p class="text-field"></p>')
        .append('<input type="hidden" name="detailArticle" class="hidden-field">');
        // 최종 목표

        $(".subGoal")
        .append('<input type="button" class="input-button btn btn-secondary"'
        + 'data-toggle="tooltip" title=" ">')
        .append('<p class="text-field"></p>')
        .append('<input type="hidden" name="subArticle" class="hidden-field">');
        // 보조 목표

        $(".ultimateGoal")
        .append('<input type="button" class="input-button btn btn-secondary"'
        + 'data-toggle="tooltip" title=" ">')
        .append('<p class="text-field"></p>')
        .append('<input type="hidden" name="ultimateArticle" class="hidden-field">');
        // 실천 사항

        // 버튼, 내용 텍스트, 제출용 영역을 모든 테이블에 생성


        $('.input-button').css('visibility', 'hidden');
        // 기본적으로 버튼은 평소에 보이지 않게


        $('.input-button').on('click', function() { // 버튼 클릭 시 모달 생성 및 내용 입력
            var $this = $(this);
            var prevArticle = $this.next(".text-field").text();

            $("#modal-article").val("");
            // 초기화

            if (prevArticle != "") {
                $("#add-modal").text("편집");
                $("#modal-article").val(prevArticle);
            }

            $('#layerpop').modal();

            $("#modal-article").off("keydown").on("keydown", function(evt) {
                var keyCode = evt.keyCode || evt.which;

                fc_chk_byte($(this), 100, keyCode);

                if (evt.keyCode == 13) {
                    $("#add-modal").trigger("click");
                }
            }); // 엔터를 입력하면 추가/편집

            $("#modal-cancle").on("click", function() {
                $('#modal-article').val('');
            }); // 값 초기화
            
            $("#add-modal").off('click').on('click', function() {
                var article = $("#modal-article").val(); 

                $this.next('.text-field').text(article)
                .next('.hidden-field').val(article);
                $('#modal-article').val('');

                var center_table_id = $this.parents(".zoomTarget").attr("id");
                var table_id;

                if ($this.parent(".zoomTarget").hasClass('center')) {
                    table_id = $this.parents('.mandal-top, .mandal-mid, .mandal-bot').attr('id');
                }

                // 만다라트 보조 목표 내용들이 연동될 수 있도록
                switch (true) {
                    case center_table_id == 'mandal-zoom1':
                        $('#mandal1').find('.center').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case center_table_id == 'mandal-zoom2':
                        $('#mandal2').find('.center').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case center_table_id == 'mandal-zoom3':
                        $('#mandal3').find('.center').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case center_table_id == 'mandal-zoom4':
                        $('#mandal4').find('.center').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case center_table_id == 'mandal-zoom5':
                        $('#mandal5').find('.center').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case center_table_id == 'mandal-zoom6':
                        $('#mandal6').find('.center').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case center_table_id == 'mandal-zoom7':
                        $('#mandal7').find('.center').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case center_table_id == 'mandal-zoom8':
                        $('#mandal8').find('.center').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case table_id == 'mandal1':
                        $('#mandal-zoom1').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case table_id == 'mandal2':
                        $('#mandal-zoom2').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case table_id == 'mandal3':
                        $('#mandal-zoom3').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case table_id == 'mandal4':
                        $('#mandal-zoom4').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case table_id == 'mandal5':
                        $('#mandal-zoom5').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case table_id == 'mandal6':
                        $('#mandal-zoom6').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case table_id == 'mandal7':
                        $('#mandal-zoom7').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    case table_id == 'mandal8':
                        $('#mandal-zoom8').children('.text-field').text(article)
                        .next('.hidden-field').val(article);
                        break;

                    default:
                        break;
                }

                $("#layerpop").modal("hide");  // 모든 처리가 끝나면 모달을 숨김
            })        

            return false;
        });

        $('.table-article').on('mouseover', function() {
            var article = $(this).children(".text-field").text()

            if (article == "") {
                $(this).children('.input-button')
                .tooltip("hide");
            }
            // 내용이 초기화 상태일 때에는 tooltip을 띄우지 않음

            $(this).children('.input-button').css('visibility', 'visible')
            .attr("title", article) // 테이블에 마우스를 올리면 해당 칸에 버튼이 보임
            .tooltip({
                placement: 'top',
                container: 'body'
            })
            .tooltip("fixTitle");
            // tooltip 옵션 설정 및 내용 수정

            return false;
        });


        $('#sendData').on('click', function() {
            $.each($('.detailGoal'), function(index) {
                $(this).children('.text-field').text("detail_" + index)
                .next('.hidden-field').val("detail_" + index);
            });

            $.each($('.subGoal'), function(index) {
                $(this).children('.text-field').text("sub_" + index)
                .next('.hidden-field').val("sub_" + index);
            });

            $('.ultimateGoal').children('.text-field').text("ultimate_")
                .next('.hidden-field').val("ultimate_");
        });
        

        $('.mandalForm').on('submit', function(evt) {
            evt.preventDefault();

            var href = window.location.href;
            var lastSegment = href.split('/').pop();

            console.log(lastSegment);

            var action = $(this).attr('action');
            console.log($(this).serialize());

            $.ajax({
               url: action + '/' + lastSegment,
               type: 'POST',
               data: $(this).serialize(),
               success: function(data) {
                    if (data.success) {
                        console.log('데이터 전송 성공!!');
                    } else {
                        console.log('오류 발생!!');
                    }
                },
                error: function() {
                    console.log('오류 발생2!!');
               }
            });
            window.location.href = "/mandal";
            
        });

        $('.table-article').on('mouseleave', function(e) { // 마우스가 영역 떠났을 때
            $(this).children('.input-button').css('visibility', 'hidden');

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
