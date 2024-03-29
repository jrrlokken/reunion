// Carousel

!(function (d) {
  const itemClassName = 'carousel__photo';
  const items = d.getElementsByClassName(itemClassName);
  const totalItems = items.length;
  let slide = 0;
  let moving = true;

  function setInitialClasses() {
    items[totalItems - 1]?.classList.add('prev');
    items[0]?.classList.add('active');
    items[1]?.classList.add('next');
  }

  function setEventListeners() {
    let next = d.getElementsByClassName('carousel__button--next')[0];
    let prev = d.getElementsByClassName('carousel__button--prev')[0];

    next?.addEventListener('click', moveNext);
    prev?.addEventListener('click', movePrev);
  }

  // 'Next' navigation handler
  function moveNext() {
    if (!moving) {
      if (slide === totalItems - 1) {
        slide = 0;
      } else {
        slide++;
      }

      moveCarouselTo(slide);
    }
  }

  // 'Prev' navigation handler
  function movePrev() {
    if (!moving) {
      if (slide === 0) {
        slide = totalItems - 1;
      } else {
        slide--;
      }

      moveCarouselTo(slide);
    }
  }

  function disableInteraction() {
    moving = true;
    setTimeout(function () {
      moving = false;
    }, 500);
  }

  function moveCarouselTo(slide) {
    if (!moving) {
      disableInteraction();

      let newPrevious = slide - 1;
      let newNext = slide + 1;
      let oldPrevious = slide - 2;
      let oldNext = slide + 2;

      if (totalItems - 1 > 3) {
        if (newPrevious <= 0) {
          oldPrevious = totalItems - 1;
        } else if (newNext >= totalItems - 1) {
          oldNext = 0;
        }
      }

      if (slide === 0) {
        newPrevious = totalItems - 1;
        oldPrevious = totalItems - 2;
        oldNext = slide + 1;
      } else if (slide === totalItems - 1) {
        newPrevious = slide - 1;
        newNext = 0;
        oldNext = 1;
      }
      if (items[oldPrevious]) {
        items[oldPrevious].className = itemClassName;
      }
      if (items[oldNext]) {
        items[oldNext].className = itemClassName;
      }

      // Add new classes
      items[newPrevious].className = itemClassName + ' prev';
      items[slide].className = itemClassName + ' active';
      items[newNext].className = itemClassName + ' next';
    }
  }

  function initCarousel() {
    setInitialClasses();
    setEventListeners();
    moving = false;
  }

  initCarousel();
})(document);
