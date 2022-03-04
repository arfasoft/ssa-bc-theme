function submitDesktopSearch() {
  const searchInput = document.querySelector('.desktop-search-input').value;

  if (searchInput.length > 0) {
    const form = document.querySelector('#search-form--desktop');
    form.submit();
  }
}

function submitMobileSearch() {
  const searchInput = document.querySelector('.mobile-search-input').value;

  if (searchInput.length > 0) {
    const form = document.querySelector('#search-form--mobile');
    form.submit();
  }
}

function handleSearchSubmit() {
  const desktopTrigger = document.querySelector('.search-icon--desktop');
  desktopTrigger.addEventListener("click", submitDesktopSearch);

  const mobileTrigger = document.querySelector('.search-icon--mobile');
  mobileTrigger.addEventListener("click", submitMobileSearch);
}
export default handleSearchSubmit;
