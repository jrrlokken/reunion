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

  const url = `http://127.0.0.1:3006/reunions/${reunionId}`;

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
      const reunion = response.json();
      return reunion;
    })
    .then((reunion) => {
      const comment = reunion.comments[reunion.comments.length - 1];
      console.log(comment.createdAt);
      // const d = comment.createdAt.getDate();
      // const m = monthNames[comment.createdAt.getMonth()];
      // const y = comment.createdAt.getFullYear();
      const commentDiv = document.createElement('div');
      // commentDiv.classList.add('comment-container');
      const commentP = document.createElement('p');
      commentP.classList.add('comment-header-text');
      const email = comment.userId.email;
      const hr = document.createElement('hr');
      // commentP.textContent = `On ${m}+ ' ' +${d}+ ', ' +${y}, ${email} wrote:`;
      commentP.textContent = `${email} wrote:`;
      commentDiv.append(commentP);
      commentDiv.append(commentText);
      commentDiv.appendChild(hr);
      commentsContainer.prepend(commentDiv);
      commentForm.reset();
    })
    .catch((error) => console.log(error));
}
