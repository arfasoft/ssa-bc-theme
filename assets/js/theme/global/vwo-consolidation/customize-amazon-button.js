export default function() {
  let cartAmazonInit;

  if (window.triggerCartClicked === undefined) {
    window.triggerCartClicked = false;
  }

  function styleAmazonCTA() {
    clearInterval(cartAmazonInit);

    cartAmazonInit = setInterval(function() {
      if (document.querySelector('body > #previewModal .AmazonPayContainer > div, .cart-additionalCheckoutButtons .AmazonPayContainer > div') && document.querySelector('.AmazonPayContainer > div').shadowRoot != null){
        const host = document.querySelector('.AmazonPayContainer > div');
        const style = document.createElement('style');

        style.innerHTML = '.amazonpay-button-container .amazonpay-button-view1 {border-radius: 100px; -webkit-border-radius: 100px; -moz-border-radius: 100px; padding: 3px 0;} .amazonpay-button-container .amazonpay-button-view3 {padding: 0 10px;}';
        host.shadowRoot.appendChild(style); 
        clearInterval(cartAmazonInit);
      }
    }, 200);
  }

  if (window.location.href.indexOf('/cart.php') !== -1 || window.triggerCartClicked) {
    window.triggerCartClicked = false;
    styleAmazonCTA();
  }

  var cartBtn = document.querySelector('.productView-details #form-action-addToCart');

  if (cartBtn){
    cartBtn.addEventListener('click', function() {
      styleAmazonCTA();
    });
  }
}
