import $ from 'jquery';
import 'slick-carousel';

export default function () {
    const $carousel = $('[data-slick]');
    const optionsString = $carousel.data('slick');

    let options = {};

    if (optionsString && !optionsString.hasOwnProperty('customerLove')) {
        try {
            options = JSON.stringify(optionsString);
        } catch(err) {}
    }

    if ($carousel.length) {
        const multipleSlides = $carousel[0].childElementCount > 1;
        if (optionsString && !optionsString.hasOwnProperty('customerLove')) {
            $carousel.slick(Object.assign({ dots: multipleSlides }, options));
        } else {
            // customerLove carousel on homepage
            $carousel.slick({
                centerMode: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 10000,
                responsive: [
                    {
                      breakpoint: 1024,
                      settings: {
                        slidesToShow: 2,
                        centerMode: false,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true
                      }
                    },
                    {
                      breakpoint: 600,
                      settings: {
                        centerMode: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true
                      }
                    },
                    {
                      breakpoint: 480,
                      settings: {
                        centerMode: false,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true
                      }
                    }
                    // You can unslick at a given breakpoint now by adding:
                    // settings: "unslick"
                    // instead of a settings object
                  ]
              });
        }
    }

    // Alternative image styling for IE, which doesn't support objectfit
    if (typeof document.documentElement.style.objectFit === 'undefined') {
        $('.heroCarousel-slide').each(() => {
            const $container = $(this);
            const imgUrl = $container.find('img').data('lazy');

            if (imgUrl) {
                $container.css('backgroundImage', `url(${imgUrl})`).addClass('compat-object-fit');
            }
        });
    }
}
