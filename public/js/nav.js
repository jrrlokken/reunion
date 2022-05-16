const openButton = document.querySelector('.open-btn');
const closeButton = document.querySelector('.close-btn');
const nav = document.querySelectorAll('.nav');

openButton.addEventListener('click', () => {
  nav.forEach((nav_el) => nav_el.classList.add('visible'));
});

closeButton.addEventListener('click', () => {
  nav.forEach((nav_el) => nav_el.classList.remove('visible'));
});
