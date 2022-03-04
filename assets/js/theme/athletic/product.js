import $ from 'jquery';

export default function loaded() {
    if ($('#tab-specifications').text().trim() !== '') {
        $('.tab-heading--specs').show();
    }
}
