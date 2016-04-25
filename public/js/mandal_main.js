$(document).ready(function() {
    $(".mandal-top, .mandal-mid, .mandal-bot, .mandal-center").load('/mandal/table', function() {
        // mandal_table.html 을 불러와서 9개의 테이블 생성
    });
    
    $('.mandal-center').on('mouseover', function(e) {        
        $(this).find('.table-article').addClass('zoomTarget');
        
        var i = 1;
        $(this).find('.table-article').each(function() {
            if ($(this).hasClass('center')) {
            }
            else {
                $(this).attr('id', 'mandal' + i);
                i++;
            }
        });
        
        return false;
    });
});
