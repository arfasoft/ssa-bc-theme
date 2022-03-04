import $ from 'jquery';

export default function loaded() {
    function windowWidth() {
        let winWidth = window.innerWidth;
        if (Number.isNaN(winWidth)) winWidth = document.body.clientWidth;

        return winWidth;
    }

    let resizeTimer;

    // navigation functionality
    $('.expandLink').on('click', function toggleActive() {
        $(this).parent().toggleClass('active');
    });

    function touchExpand() {
        $('.navPages-action').unbind('click');
        $('.navPages-action-moreIcon').unbind('click');

        if (windowWidth() > 800) {
            $('#menu .link-expanded').removeClass('link-expanded');
            $('#menu .is-open').removeClass('is-open');
        }

        if (windowWidth() <= 800) {
            $('.navPages-action-moreIcon').on('click', function mobileExpand(event) {
                event.preventDefault();
                $(this).parents('li:first').toggleClass('link-expanded');
            });
        }
    }

    function mobileNavPadding() {
        if (windowWidth() <= 800) {
            const logoHeight = $('.header-logo img').height();
            const headerHeight = $('.header-logo').outerHeight(true);
            $('.navPages-container').css('padding-top', `${headerHeight}px`);
            $('.mobileMenu-toggle').css('height', `${logoHeight}px`);
        } else {
            $('.navPages-container').css('padding-top', 'inherit');
        }
    }

    function getHeaderHeight() {
        return $('.header').outerHeight(true);
    }

    function bodyPadding() {
        if (windowWidth() <= 800) {
            const headerHeight = getHeaderHeight();
            $('body').css('padding-top', `${headerHeight}px`);
        } else {
            $('body').css('padding-top', 'inherit');
        }
    }

    function bindAnchorLinks() {
        const scrollDestinationBuffer = 20;
        const headerHeight = getHeaderHeight();
        const scrollTopOffset = headerHeight + scrollDestinationBuffer;

        $('a[href^="#"]:not([href="#"])').on('click.anchor', (ev) => {
            ev.preventDefault();

            const $destination = $($(ev.target).attr('href'));

            if ($destination) {
                window.scrollTo({
                    behavior: 'smooth',
                    top: $destination.offset().top - scrollTopOffset,
                });
            }
        });
    }

    touchExpand();
    mobileNavPadding();
    bodyPadding();
    bindAnchorLinks();

    $(window).on('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            touchExpand();
            mobileNavPadding();
            bodyPadding();
        }, 500);
    });

    window.addEventListener('orientationchange', () => {
        touchExpand();
    }, false);

    // hide quick search results when clicked outside of quick search
    $(window).on('click', () => {
        $('.quickSearchWrap .quickSearchResults').hide();
    });

    $('.quickSearchWrap').on('click', '.modal-close', () => {
        $('.quickSearchWrap .quickSearchResults').hide();
    });

    $('.quickSearchWrap').on('click', (event) => {
        event.stopPropagation();
    });

    // show quick search results when focused in search input
    $('.quickSearchWrap input').on('focusin', () => {
        $('.quickSearchWrap .quickSearchResults').show();
    });

    // compare functionality
    $('.compare-input').on('change', function checkCompare() {
        const isSelected = $(this).is(':checked');
        const compareLabel = $(this).parent();

        if (isSelected) {
            compareLabel.find('span').show();
            compareLabel.next().css('visibility', 'visible');
        } else {
            compareLabel.find('span').hide();
            compareLabel.next().css('visibility', 'hidden');
        }

        if ($('.compare-input:checked').length > 0) {
            $('.compare-button-wrap').show();
        } else {
            $('.compare-button-wrap').hide();
        }
    });
}
