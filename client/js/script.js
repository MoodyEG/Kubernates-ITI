const socket = io.connect('http://localhost:5124');

const form = document.getElementById('postForm');
const postsList = document.getElementById('postsList');

// * Load from the db
socket.on('connect', () => {
  console.log('Connected to server');

  fetch('http://localhost:5124/post')
    .then((response) => response.json())
    .then((posts) => {
      postsList.innerHTML = '';
      posts.forEach((post) => {
        const postItem = document.createElement('li');
        postItem.classList.add('list-group-item', 'rounded-2', 'my-2');
        postItem.id = post._id;
        postItem.innerHTML = `
        <h5>${post.title}</h5>
        <p>${post.description}</p>
        <button class="btn btn-danger" onclick="deletePost('${post._id}')">Delete</button>
      `;
        postsList.appendChild(postItem);
      });
    })
    .catch((error) => console.error('Error fetching posts:', error));
});

// * Create post
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('postTitle').value;
  const description = document.getElementById('postDescription').value;
  if (!title.trim() || !description.trim()) return;
  // socket.emit('createPost', { title, description });
  // call the api
  fetch('http://localhost:5124/post/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  })
    .then((response) => response.json())
    .then((post) => socket.emit('createPost', post))
    .catch((error) => console.error('Error creating post:', error));

  form.reset();
});

socket.on('postCreated', (post) => {
  const postItem = document.createElement('li');
  postItem.classList.add('list-group-item', 'rounded-2', 'my-2');
  postItem.id = post._id;
  postItem.innerHTML = `
    <h5>${post.title}</h5>
    <p>${post.description}</p>
    <button class="btn btn-danger" onclick="deletePost('${post._id}')">Delete</button>
  `;
  postsList.appendChild(postItem);
});

// * Delete post
function deletePost(postId) {
  fetch(`http://localhost:5124/post/${postId}`, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((post) => socket.emit('deletePost', postId))
    .catch((error) => console.error('Error deleting post:', error));
}

socket.on('postDeleted', (postId) => {
  const postItem = document.getElementById(postId);
  if (postItem) {
    postsList.removeChild(postItem);
  }
});

// * Search
function searchPosts() {
  const input = document.getElementById('searchPosts').value.toLowerCase();
  const posts = document.getElementsByTagName('li');
  for (let i = 0; i < posts.length; i++) {
    const title = posts[i]
      .getElementsByTagName('h5')[0]
      .textContent.toLowerCase();
    posts[i].style.display = title.includes(input) ? '' : 'none';
  }
}
