import $ from 'jquery';

export default function() {
  $('.youtube').each(function(_, el) {
    const youtubeSlot$ = $(this);
    const source = `https://i.ytimg.com/vi/${el.dataset.youtubeEmbed}/hqdefault.jpg`;
    const image = new Image();

    image.src = source;

    $(image).on('load.youtubeThumbnail', function() {
      youtubeSlot$.append(this);
    });

    youtubeSlot$.on('click.youtubePlay', function() {
      const iframe = document.createElement('iframe');

      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('src', `https://www.youtube.com/embed/${el.dataset.youtubeEmbed}?rel=0&showinfo=0&autoplay=1`);

      $(this).html('');
      $(this).append(iframe);
    });
  });
}
