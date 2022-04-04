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

// Comments

const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('newComment');
const commentsContainer = document.getElementById('allComments');
let commentText = document.getElementById('newComment').value;
const reunionId = document.getElementById('reunionId').value;
const csrfToken = document.getElementById('csrf').value;

commentForm.addEventListener('submit', handleCommentSubmit, false);
commentInput.addEventListener('change', (event) => {
  commentText = event.target.value;
});

async function handleCommentSubmit(event) {
  event.preventDefault();
  console.log('Someone clicked the comment submit button...');
  console.log(csrfToken);
  console.log(reunionId);
  console.log(commentText);

  const url = `http://localhost:3006/reunions/${reunionId}`;

  fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRF-Token': csrfToken,
    },
    body: { reunionId },
  })
    .then((response) => {
      const d = response.comment.createdAt.getDate();
      const m = monthNames[response.comment.createdAt.getMonth()];
      const y = response.comment.createdAt.getFullYear();

      const commentDiv = document.createElement('div');
      commentDiv.classList.add('comments-container');
      const commentP = doucment.createElement('p');
      commentP.classList.add('comment-header-text');
      const email = response.comment.userId.email;
      const hr = document.createElement('hr');

      commentP.textContent = `On ${m}+ ' ' +${d}+ ', ' +${y}, ${email} wrote:`;
      commentDiv.appendChild(commentP);
      commentDiv.appendChild(commentText);
      commentDiv.appendChild(hr);

      commentsContainer.appendChild(commentDiv);
    })
    .catch((error) => console.log(error));
}
