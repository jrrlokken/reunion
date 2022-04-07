// Comments
const reunionId = document.getElementById('reunionId').value;
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('newComment');
const commentsContainer = document.getElementById('allComments');
let commentText = document.getElementById('newComment').value;
const csrfToken = document.getElementById('csrf').value;

// Enable pusher logging - don't include this in production
Pusher.logToConsole = false;

function buildComment(comment) {
  // const d = comment.createdAt.getDate();
  // const m = monthNames[comment.createdAt.getMonth()];
  // const y = comment.createdAt.getFullYear();
  // console.log(comment);
  const commentDiv = document.createElement('div');
  const commentP = document.createElement('p');
  commentP.classList.add('comment-header-text');
  const email = comment.userId.email;
  const hr = document.createElement('hr');
  // commentP.textContent = `On ${m}+ ' ' +${d}+ ', ' +${y}, ${email} wrote:`;
  commentP.textContent = `${email} wrote:`;
  commentDiv.append(commentP);
  commentDiv.append(comment.text);
  commentDiv.appendChild(hr);
  commentsContainer.prepend(commentDiv);
  return commentForm.reset();
}

const pusher = new Pusher('369474ee4c2e0ecdb50c', {
  cluster: 'us2',
});

const channel = pusher.subscribe(`${reunionId}`);
channel.bind('comment', (data) => {
  const newComment = data.message;
  buildComment(newComment);
});

commentForm.addEventListener('submit', handleCommentSubmit, false);
commentInput.addEventListener('change', (event) => {
  commentText = event.target.value;
});

async function handleCommentSubmit(event) {
  event.preventDefault();

  const url = `http://localhost:3006/reunions/${reunionId}`;

  fetch(url, {
    method: 'post',
    credentials: 'include',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: `commentText=${commentText}`,
  })
    .then((response) => {
      console.log(response.json);
    })
    .catch((error) => console.log(error));
}
