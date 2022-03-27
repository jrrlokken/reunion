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

      items[oldPrevious].className = itemClassName;
      items[oldNext].className = itemClassName;
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

// Commenting
const commentContainer = document.getElementById('allComments');
document.getElementById('addComment')?.addEventListener('click', function (ev) {
  addComment(ev);
});

function addComment(ev) {
  let commentText, wrapDiv;
  const textBox = document.createElement('div');
  const replyButton = document.createElement('button');
  replyButton.className = 'reply';
  replyButton.innerHTML = 'Reply';
  const likeButton = document.createElement('button');
  likeButton.innerHTML = 'Like';
  likeButton.className = 'likeComment';
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'Delete';
  deleteButton.className = 'deleteComment';
  if (hasClass(ev.target.parentElement, 'comment-container')) {
    const wrapDiv = document.createElement('div');
    wrapDiv.className = 'wrapper';
    wrapDiv.style.marginLeft = 0;
    commentText = document.getElementById('newComment').value;
    document.getElementById('newComment').value = '';
    textBox.innerHTML = commentText;
    textBox.className = 'comment-text';
    wrapDiv.append(textBox);
    // wrapDiv.append(textBox, replyButton, likeButton, deleteButton);
    commentContainer.appendChild(wrapDiv);
  } else {
    wrapDiv = ev.target.parentElement;
    commentText = ev.target.parentElement.firstElementChild.value;
    textBox.innerHTML = commentText;
    wrapDiv.innerHTML = '';
    wrapDiv.append(textBox, replyButton, likeButton, deleteButton);
  }
}

function hasClass(elem, className) {
  return elem.className.split(' ').indexOf(className) > -1;
}
document.getElementById('allComments')?.addEventListener('click', function (e) {
  if (hasClass(e.target, 'reply')) {
    const parentDiv = e.target.parentElement;
    const wrapDiv = document.createElement('div');
    wrapDiv.style.marginLeft =
      (Number.parseInt(parentDiv.style.marginLeft) + 15).toString() + 'px';
    wrapDiv.className = 'wrapper';
    const textArea = document.createElement('textarea');
    textArea.style.marginRight = '20px';
    const addButton = document.createElement('button');
    addButton.className = 'addReply';
    addButton.innerHTML = 'Add';
    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = 'Cancel';
    cancelButton.className = 'cancelReply';
    wrapDiv.append(textArea, addButton, cancelButton);
    parentDiv.appendChild(wrapDiv);
  } else if (hasClass(e.target, 'addReply')) {
    addComment(e);
  } else if (hasClass(e.target, 'likeComment')) {
    const likeBtnValue = e.target.innerHTML;
    e.target.innerHTML =
      likeBtnValue !== 'Like' ? Number.parseInt(likeBtnValue) + 1 : 1;
  } else if (hasClass(e.target, 'cancelReply')) {
    e.target.parentElement.innerHTML = '';
  } else if (hasClass(e.target, 'deleteComment')) {
    e.target.parentElement.remove();
  }
});

function setOnLocalStorage() {
  localStorage.setItem(
    'template',
    document.getElementById('allComments').innerHTML
  );
}
