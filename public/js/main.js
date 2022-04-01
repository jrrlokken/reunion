// Carousel

// !(function (d) {
//   const itemClassName = 'carousel__photo';
//   const items = d.getElementsByClassName(itemClassName);
//   const totalItems = items.length;
//   let slide = 0;
//   let moving = true;

//   function setInitialClasses() {
//     items[totalItems - 1]?.classList.add('prev');
//     items[0]?.classList.add('active');
//     items[1]?.classList.add('next');
//   }

//   function setEventListeners() {
//     let next = d.getElementsByClassName('carousel__button--next')[0];
//     let prev = d.getElementsByClassName('carousel__button--prev')[0];

//     next?.addEventListener('click', moveNext);
//     prev?.addEventListener('click', movePrev);
//   }

//   // 'Next' navigation handler
//   function moveNext() {
//     if (!moving) {
//       if (slide === totalItems - 1) {
//         slide = 0;
//       } else {
//         slide++;
//       }

//       moveCarouselTo(slide);
//     }
//   }

//   // 'Prev' navigation handler
//   function movePrev() {
//     if (!moving) {
//       if (slide === 0) {
//         slide = totalItems - 1;
//       } else {
//         slide--;
//       }

//       moveCarouselTo(slide);
//     }
//   }

//   function disableInteraction() {
//     moving = true;
//     setTimeout(function () {
//       moving = false;
//     }, 500);
//   }

//   function moveCarouselTo(slide) {
//     if (!moving) {
//       disableInteraction();

//       let newPrevious = slide - 1;
//       let newNext = slide + 1;
//       let oldPrevious = slide - 2;
//       let oldNext = slide + 2;

//       if (totalItems - 1 > 3) {
//         if (newPrevious <= 0) {
//           oldPrevious = totalItems - 1;
//         } else if (newNext >= totalItems - 1) {
//           oldNext = 0;
//         }
//       }

//       if (slide === 0) {
//         newPrevious = totalItems - 1;
//         oldPrevious = totalItems - 2;
//         oldNext = slide + 1;
//       } else if (slide === totalItems - 1) {
//         newPrevious = slide - 1;
//         newNext = 0;
//         oldNext = 1;
//       }
//       if (items[oldPrevious]) {
//         items[oldPrevious].className = itemClassName;
//       }
//       if (items[oldNext]) {
//         items[oldNext].className = itemClassName;
//       }

//       // Add new classes
//       items[newPrevious].className = itemClassName + ' prev';
//       items[slide].className = itemClassName + ' active';
//       items[newNext].className = itemClassName + ' next';
//     }
//   }

//   function initCarousel() {
//     setInitialClasses();
//     setEventListeners();
//     moving = false;
//   }

//   initCarousel();
// })(document);

// *************************** //
//           Pusher            //
// *************************** //

(function () {
  Pusher.logToConsole = true;
  var serverUrl = 'http://localhost:3006/';
  var comments = [];
  var pusher = new Pusher('369474ee4c2e0ecdb50c', {
    cluster: 'us2',
  });
  var commentForm = document.getElementById('comment-form');

  commentForm.addEventListener('submit', addNewComment);

  // Subscribe client to this channel
  channel = pusher.subscribe('reunion-comments');
})();

function addNewComment(event) {
  event.preventDefault();
  serverUrl = 'http://localhost:3006/';
  var commentForm = document.getElementById('comment-form');
  var newComment = {
    comment: document.getElementById('newComment').value,
  };

  var xhr = new XMLHttpRequest();
  xhr.open('POST', serverUrl + 'reunions/comment', true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;

    // On Success of creating a new Comment
    console.log('Success: ' + xhr.responseText);
    commentForm.reset();
  };
  xhr.send(JSON.stringify(newComment));
}

var commentsList = document.getElementById('comments-list'),
  commentTemplate = document.getElementById('comment-template');

// Binding to Pusher Event on our 'flash-comments' Channel
channel.bind('new_comment', newCommentReceived);

// New Comment Received Event Handler
// We will take the Comment Template, replace placeholders & append to commentsList
function newCommentReceived(data) {
  var newCommentHtml = commentTemplate.innerHTML.replace('{{name}}', data.name);
  newCommentHtml = newCommentHtml.replace('{{email}}', data.email);
  newCommentHtml = newCommentHtml.replace('{{comment}}', data.comment);
  var newCommentNode = document.createElement('div');
  newCommentNode.classList.add('comment');
  newCommentNode.innerHTML = newCommentHtml;
  commentsList.appendChild(newCommentNode);
}
