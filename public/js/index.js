$(document).ready(function(){
  var random = Math.floor((Math.random()*10+1)/2);
  console.log(random);
  switch(random){
      case 0:
        $('p').text('\'시간을 도구로 사용할 뿐, 시간에 의존해서는 안된다.\'');
        break;
      case 1:
        $('p').text('\'무엇을 잘 하는 것은 시간낭비일 때가 많다.\'');
        break;
      case 2:
        $('p').text('\'미래는 현재 우리가 무엇을 하는가에 달려 있다.\'');
        break;
      case 3:
        $('p').text('\'나는 미래에 대해 생각하는 법이 없다. 어차피 곧 닥치니까.\'');
        break;
      case 4:
        $('p').text('\'순간들을 소중히 여기다 보면, 긴 세월은 저절로 흘러간다.\'');
        break;
      case 5:
        $('p').text('\'예측은 매우 어려우며, 미래에 대해서는 특히 그렇다\'');
        break;
      default:
        $('p').text('\'미래를 예측하는 방법은 미래를 창조하는 것이다.\'');
        break;
  }
});
