const links = document.querySelectorAll('a');
const main = document.querySelector('main');
const loginButton = document.getElementById('login-button');

if (links) {
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      main.classList.add('fade');
      setTimeout(() => {
        main.classList.remove('fade');
      }, 700);
    });
  });
}

loginButton.addEventListener('click', () => {
  main.classList.add('fade');
  setTimeout(() => {
    main.classList.remove('fade');
  }, 1200);
});
