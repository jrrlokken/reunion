const openButton = document.querySelector('.open-btn');
const closeButton = document.querySelector('.close-btn');
const nav = document.querySelector('nav');
const navs = document.querySelectorAll('.nav');

openButton.addEventListener('click', () => {
  navs.forEach((nav_el) => nav_el.classList.add('visible'));
});

closeButton.addEventListener('click', () => {
  navs.forEach((nav_el) => nav_el.classList.remove('visible'));
});

// document.addEventListener('click', (event) => {
//   if (
//     (!event.target.classList.contains('nav') &&
//       !event.target.classList.contains('fa-bars')) ||
//     event.target.classList.contains('close-btn')
//   ) {
//     navs.forEach((nav_el) => nav_el.classList.remove('visible'));
//   }
// });
