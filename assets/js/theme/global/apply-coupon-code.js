import swal from 'sweetalert2';
import utils from '@bigcommerce/stencil-utils';

function applyCouponCode(code) {
  utils.api.cart.applyCode(code, (err, response) => {
    if (response.data.status === 'success') {
        window.location.href = '/cart.php';
    } else {
        swal({
            text: response.data.errors.join('\n'),
            type: 'error',
        });
    }
  });
}

export default function() {
  window.applyCouponCode = applyCouponCode;
}
