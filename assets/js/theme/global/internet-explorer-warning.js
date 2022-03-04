// script to find versions of IE less than 12 (Edge)

export default function()  {

    let isIE = false;

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older
        isIE = true;
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11
        isIE = true;
    }

    if(isIE) {
        document.getElementById('ie-warning').style.display = 'block';
    }
}
