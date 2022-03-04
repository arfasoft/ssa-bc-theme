import $ from 'jquery';

export default function () {
  const OPEN_CLASS = 'opened';
  const selectors = {
    ACCORDION: '[data-accordion]',
    ACCORDION_ITEM: '.accordion-new__item',
    ACCORDION_ITEM_CONTENT: '.accordion-new__item-content'
  };
  const $accordions = $(selectors.ACCORDION);
  const defaultConfig = {
    open: null
  };
  
  $accordions.each((i, el) => {
    const $accordion = $(el);
    const options = Object.assign({}, defaultConfig, $accordion.data('accordion'));
    const $items = $accordion.find(selectors.ACCORDION_ITEM);

    if (options.open !== null && !isNaN(options.open)) {
      const defaultOpenItem = $items.get(options.open);
      $(defaultOpenItem)
        .addClass(OPEN_CLASS)
        .find(selectors.ACCORDION_ITEM_CONTENT)
        .show(0);
    }

    $items.find('h4:first-of-type').on('click.triggerAccordion', (ev) => {
      const $trigger = $(ev.target);
      const $currentItem = $trigger.parent(selectors.ACCORDION_ITEM);
      const $content = $currentItem.find(selectors.ACCORDION_ITEM_CONTENT);
      const isContentOpen = $content.is(':visible');

      if (!isContentOpen) {
        $items
          .not($currentItem)
          .removeClass(OPEN_CLASS)
          .find(selectors.ACCORDION_ITEM_CONTENT)
          .slideUp(200);
      }

      $currentItem.toggleClass(OPEN_CLASS);
      $content.slideToggle(200);
    });
  });
};
