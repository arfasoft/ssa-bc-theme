import $ from 'jquery';

export default class PageManager {
    constructor(context) {
        this.context = context;
    }

    type() {
        return this.constructor.name;
    }

    onReady() {
    }

    static load(context) {
        const page = new this(context);

        $(document).ready(() => {
            page.onReady.bind(page)();
        });

        // This manipulates the badge counter on the cart.
        const cartBadge = $('.navUser-action--badge');
        const badgeCount = Number(cartBadge.data('badge-cart-quantity'));
        
        if (badgeCount >= 10) {
            cartBadge.data('badge-cart-quantity', '9+').trigger('');
            cartBadge.html('9+')
        }
    }
}
