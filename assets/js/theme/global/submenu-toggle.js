function toggleSubmenu(e) {
  // stop click from executing
  e.preventDefault();
  // target the open/closed icon 
  const icon = this.querySelector('span');
  // toggle +/- icons
  if(icon.classList.contains('closed-list')) {
    icon.classList.remove('closed-list');
    icon.classList.add('open-list');
  } else {
    icon.classList.remove('open-list');
    icon.classList.add('closed-list');
  }

  const list = this.nextElementSibling;
  if(list.classList.contains('show')) {
    list.classList.remove('show');
  } else {
    list.classList.add('show');
  }
}

function toggleSubmenuAssignment() {
  var triggers = document.querySelectorAll('.list-toggle');

  for(let x=0; x < triggers.length; x++) {
    triggers[x].addEventListener("click", toggleSubmenu);
  }

}
export default toggleSubmenuAssignment;
