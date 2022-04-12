// Comments
const commentForm = document.getElementById('comment-form');
const commentsContainer = document.getElementById('allComments');
const commentInput = document.getElementById('newComment');
let commentText = commentInput.value;

const reunionId = document.getElementById('reunionId').value;
const csrfToken = document.getElementById('csrf').value;

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function buildComment(comment) {
  const date = new Date(comment.createdAt);
  const d = date.getDate();
  const m = monthNames[date.getMonth()];
  const y = date.getFullYear();

  const commentDiv = document.createElement('div');
  commentDiv.classList.add('comment-wrapper');

  const commentP = document.createElement('p');
  commentP.classList.add('comment-header-text');

  const email = comment.userId.email;
  commentP.textContent = `On ${m} ${d}, ${y}, ${email} wrote:`;

  const hr = document.createElement('hr');

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
      // console.log(response.json);
    })
    .catch((error) => console.log(error));
}
