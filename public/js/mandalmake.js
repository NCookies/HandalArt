var rote = false;

$(document).ready(function(){
    $('ul').fadeOut(0);

    $('#addbtn').on('click',function () {
        if (rote == false) {
            $('#addbtn').css('transform','rotate(45deg)');
            $('ul').slideDown(1000);
            rote = true;
        }
        else {
            $('#addbtn').css('transform','rotate(0deg)');
            $('ul').slideUp(1000);
            rote = false;
        }
    });

    $(".preview").load("/mandal/main .mandal-center");
});
