// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('#navupdown').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});
setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);
// function hasScrolled() {
//     var st = $(this).scrollTop();
//
//     // Make sure they scroll more than delta
//     if(Math.abs(lastScrollTop - st) <= delta)
//         return;
//
//     // If they scrolled down and are past the navbar, add class .nav-up.
//     // This is necessary so you never see what is "behind" the navbar.
//     if (st > lastScrollTop && st > navbarHeight){
//         // Scroll Down
//         $('#navupdown').removeClass('nav-down').addClass('nav-up');
//     } else {
//         // Scroll Up
//         if(st + $(window).height() < $(document).height()) {
//             $('#navupdown').removeClass('nav-up').addClass('nav-down');
//         }
//     }
//
//     lastScrollTop = st;
function hasScrolled() {
    var st = $(this).scrollTop();
    var toppx = st + 'px';
    // Make sure they scroll more than delta
    $('#navupdown').css({
      'top': toppx
    });

    lastScrollTop = st;
}

function hovering(x, srcc){
  x.children[0].setAttribute('src', srcc + '_icon_hover.png');
}
function hoveringOut(x, srcc){
  x.children[0].setAttribute('src', srcc);
}
