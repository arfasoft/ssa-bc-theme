export default function() {
  /*Request Animation Frame*/
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (timeOutFn) {
    return setTimeout(timeOutFn, 1e3 / 60);
  };
  var popupOpenTime = 10e3;
  function addEvent(obj, evt, fn) {
    if (obj.addEventListener) {
      obj.addEventListener(evt, fn, false);
    } else if (obj.attachEvent) {
      obj.attachEvent("on" + evt, fn);
    }
  }
  var second3201v1Settings = {
    selectors: {
      cartItem: '.cart-item',
      checkoutItem: '.productList-item'
    },
    html: {
      exitPopUp: ['<div class="exit-promo_container">',
        '	<div class="exit-promo_display" aria-label="Less noise. More fun. 5%off your order! or try before you buy with a sample kit" aria-modal="true">',
        '	<button type="button" class="exit-promo_close" alt="Close" aria-label="Close"></button>',
        '	<div class="exit-promo_content">',
        '		<div class="exit-promo_sr_only">Less noise. More fun. 5%off your order! or try before you buy with a sample kit',
        '		</div><a class="exit-promo_submitbutton" href="https://www.secondskinaudio.com/accessories/sample-pack"></a>',
        '		<button class="exit-promo_submitbutton2" type="button" aria-label="redeem 5%"></button>',
        '	</div>',
        '		<div class="exit-promo-img">',
        '		<img src="https://useruploads.visualwebsiteoptimizer.com/useruploads/176372/images/47e0ba4d71cafef78510ac23c0a6d515_secondskinaudio5offdsktp.png"',
        '		aria-hidden="true" alt="Less noise. More fun. 5%off your order! or try before you buy with a sample kit" class="exit-promo-bg"></div>',
        '	</div>',
        '		</div>'].join('')
    },
    functions: {
      setCookie_3201: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1e3));
        var expires = 'expires='+ d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
      },
      getCookie_3201: function(cname) {
        var name = cname + '=';
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length,c.length);
        }
        }
        return '';
      },
      appendPop: function() {
        var body = document.querySelector('body');
        body.insertAdjacentHTML('beforeend', second3201v1Settings.html.exitPopUp);
      },
      showExitPop: function() {
        addEvent(document, "mouseout", function (evt) {
          if (evt.toElement == null && evt.relatedTarget == null) {
            var hasCartItems = document.querySelectorAll('.cart-item').length > 0 || document.querySelectorAll('.productList-item').length > 0;
            var lacksQuoteId = localStorage.qn_quote_id == undefined;
            var modalNotShown = second3201v1Settings.functions.getCookie_3201('exit_3201_shown') !== 'yes';

            if (hasCartItems && lacksQuoteId && modalNotShown) {
              document.querySelector('body').classList.add('second3201v1-exit');
              second3201v1Settings.functions.setCookie_3201('exit_3201_shown', 'yes');
            }
          }
        });
        document.querySelector('.exit-promo_submitbutton2').addEventListener('click', function() {
          second3201v1Settings.functions.applyCoupon('SS5P');
          document.querySelector('body').classList.remove('second3201v1-exit');
        });
      },
      applyCoupon: function(promo) {
        window.applyCouponCode(promo);
      },
      closeExit: function() {
        document.querySelector('.exit-promo_close').addEventListener('click', function() {
          document.querySelector('body').classList.remove('second3201v1-exit');
        });
      }
    }
  };
  window['second3201v1'] = function () {
    if ((document.querySelectorAll('.cart-item').length > 0 || document.querySelectorAll('.productList-item').length > 0) && !document.getElementsByClassName('second3201v1').length) {
      document.querySelector('body').classList.add('second3201v1');
      second3201v1Settings.functions.appendPop();
      second3201v1Settings.functions.showExitPop();
      second3201v1Settings.functions.closeExit();
    } else if (!document.getElementsByClassName('second3201v1').length) {
      window.requestAnimationFrame(second3201v1);
    }
  };
  window.second3201v1();
}
