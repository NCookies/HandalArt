var rote = false;

$(document).ready(function(){
    $('#mandal_slide').fadeOut(0);

    $('#addbtn').on('click',function () {
        if (rote == false) {
            $('#addbtn').css('transform','rotate(45deg)');
            $('#mandal_slide').slideDown(1000);
            rote = true;
        }
        else {
            $('#addbtn').css('transform','rotate(0deg)');
            $('#mandal_slide').slideUp(1000);
            rote = false;
        }
    });

    $(".preview").load("/mandal/main .mandal-center");
});
