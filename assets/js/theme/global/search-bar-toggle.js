function toggleSearch(e) {
  const searchbar = document.querySelector('.search--desktop');
  if (searchbar.style.display === "none") {
    searchbar.style.display = "block";
    document.querySelector('.desktop-search-input').focus();
  } else {
    document.querySelector('#search-form--desktop').reset();
    searchbar.style.display = "none";
  }
  e.preventDefault();
}

function toggleSearchAssignment() {
  var triggers = document.querySelectorAll('.toggleSearch');

  for(let x=0; x < triggers.length; x++) {
    triggers[x].addEventListener("click", toggleSearch);
  }

  // hide the searchbar when page loads
  const searchbar = document.querySelector('.search--desktop');
  searchbar.style.display = "none";

}
export default toggleSearchAssignment;
