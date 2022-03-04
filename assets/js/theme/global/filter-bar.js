import $ from 'jquery';

export default function() {
  $('[data-filter-bar-for-id]').each((i, el) => {
    const $bar = $(el);

    $bar.find('input[type="checkbox"][data-for-id]').on('click.toggle', (ev) => {
      const $checkbox = $(ev.target);
      const isOn = ev.target.checked;
      const $relatedElement = $(`#${$checkbox.data('for-id')}`);

      if ($relatedElement) {
        $relatedElement.toggle(isOn);
      }

      console.log({ value: isOn, relatedElement: $relatedElement });
    });
  });
}
