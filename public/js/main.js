let links = document.querySelectorAll('a');
if (links) {
  links.forEach((link) => {
    link.onclick = (e) => {
      let body = document.querySelector('body');
      e.preventDefault();
      setTimeout(function () {
        if (body.classList.contains('fade')) {
          console.log('Navigating...');
          if (!e.srcElement.parentElement.href) {
            window.location = e.srcElement.href;
          } else {
            window.location = e.srcElement.parentElement.href;
          }
        } else {
          console.log('whoops', e.srcElement.parentElement.href);
        }
      }, 700);
      body.classList.add('fade');
    };
  });
}
