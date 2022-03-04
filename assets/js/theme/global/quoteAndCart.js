
export default function () {

  // logic for quote cart
  if (typeof (QN) !== 'undefined') {
    QN.addEventListener('current-quote', function (e) {
      console.log('loop through and calculate total number of items on quote');

      let itemCount = 0;
      // loop through and calculate total number of items on quote
      for (let i = 0; i < e.data.products.length; i++) {
        itemCount += e.data.products[i].qty;
      }

      // Hiding and showing the quote buttons
      const quote = document.getElementById("quote");
      const quoteMobile = document.getElementById("quoteCartNumberMobile");
      const quoteMobileListItem = document.getElementById("quoteMobileListItem");

      if (itemCount > 0) {
        quoteMobile.classList.add("active");
        quoteMobile.innerHTML = itemCount;
        quoteMobileListItem.classList.remove("inactive");
        quoteMobileListItem.classList.add("active");
        quote.classList.remove("inactive");
        quote.classList.add("active");
        quote.setAttribute("data-quote-number", itemCount);
      } else {
        quoteMobile.classList.remove("active");
        quoteMobileListItem.classList.remove("active");
        quoteMobileListItem.classList.add("inactive");
        quote.classList.remove("active");
        quote.classList.add("inactive");
      }

      // grabbing product id for the current page the user is on
      const currentProductID = document.getElementById('product_id').value;
      // These are the product ids we are allowing quotes to show on
      const productIdArray = [
        "94", // Luxury Liner Roll (1lb/2lb)
        "225", // Acoustic Pro Anchorage Fabric Panels
        "227", // Acoustic Pro Anchorage Ceiling Clouds
        "243", // Underblock
        "244", // Sound Lock Door Seals
        "255", // Fantastic Frame
        "256", // Soundproof Door
        "257", // Quiet Quilt Soundproof Blanket
        "258", // Quiet Quilt Acoustic Blanket
        "259", // Quiet Quilt 2-Sided Barrier Blanket
        "260", // RSIC
        "261", // Soundproof Window
      ];
      // if the product page the user is on is the same one as what is in the array it will return true and the quote logic runs
      let productFound = productIdArray.includes(currentProductID);
      // hiding the the buy now button on pages with product ids that have the quote set up
      if (productFound === true) {
        document.getElementById('form-action-buyNow').style.display = 'none';
      }
    });
  }

  // logic for cart number
  fetch('/api/storefront/cart', {
    credentials: 'include'
  }).then(function (response) {
    return response.json();
  }).then(function (myJson) {
    let cartNumber = 0;
    if(myJson.length) {
      cartNumber = myJson[0].lineItems.physicalItems.length;
    }
    const cart = document.getElementById("cartNumber");
    const cartMobile = document.getElementById("cartNumberMobile");
    cartMobile.innerHTML = cartNumber;
    cart.innerHTML = cartNumber;
    if (cartNumber > 0) {
      cart.classList.add("active");
      cartMobile.classList.add("active");
    } else {
      cart.classList.remove("active");
      cartMobile.classList.remove("active");
    }
  });
}

