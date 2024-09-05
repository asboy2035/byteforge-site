let bookmarks = [];

// DOM Elements
const bookmarkGrid = document.getElementById('bookmark-grid');
const addBookmarkBtn = document.getElementById('add-bookmark-btn');
const settingsBtn = document.getElementById('settings-btn');
const bookmarkModal = document.getElementById('bookmark-modal');
const settingsModal = document.getElementById('settings-modal');
const closeButtons = document.querySelectorAll('.close-btn');
const bookmarkForm = document.getElementById('bookmark-form');
const bookmarkNameInput = document.getElementById('bookmark-name');
const bookmarkTypeInput = document.getElementById('bookmark-type');
const bookmarkContentInput = document.getElementById('bookmark-content');
const bookmarkImageInput = document.getElementById('bookmark-image');
const contentLabel = document.getElementById('content-label');
const imageUploadLabel = document.getElementById('image-upload-label');

// Load bookmarks from localStorage on page load
window.onload = () => {
  const savedBookmarks = localStorage.getItem('bookmarks');
  if (savedBookmarks) {
    bookmarks = JSON.parse(savedBookmarks);
    renderBookmarks();
  }
};

// Show/Hide Modal Functions
addBookmarkBtn.addEventListener('click', () => bookmarkModal.style.display = 'flex');
settingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');

closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    bookmarkModal.style.display = 'none';
    settingsModal.style.display = 'none';
  });
});

// Handle form submission
bookmarkForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = bookmarkNameInput.value;
  const type = bookmarkTypeInput.value;
  let content = bookmarkContentInput.value;

  // Handle image type bookmarks
  if (type === 'image') {
    const file = bookmarkImageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const imageData = event.target.result; // Base64-encoded image
        const newBookmark = { name, type, content: imageData };
        bookmarks.push(newBookmark);
        saveBookmarks();
        renderBookmarks();
        bookmarkForm.reset();
        bookmarkModal.style.display = 'none';
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  } else {
    // For URL and Text types
    const newBookmark = { name, type, content };
    bookmarks.push(newBookmark);
    saveBookmarks();
    renderBookmarks();
    bookmarkForm.reset();
    bookmarkModal.style.display = 'none';
  }
});

// Handle showing/hiding inputs based on type
bookmarkTypeInput.addEventListener('change', () => {
  const selectedType = bookmarkTypeInput.value;
  if (selectedType === 'image') {
    bookmarkContentInput.style.display = 'none';
    contentLabel.style.display = 'none';
    bookmarkImageInput.style.display = 'block';
    imageUploadLabel.style.display = 'block';
  } else {
    bookmarkContentInput.style.display = 'block';
    contentLabel.style.display = 'block';
    bookmarkImageInput.style.display = 'none';
    imageUploadLabel.style.display = 'none';
  }
});

// Save bookmarks to localStorage
function saveBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

// Render bookmarks in the masonry grid
function renderBookmarks() {
  bookmarkGrid.innerHTML = ''; // Clear previous bookmarks
  bookmarks.forEach((bookmark, index) => {
    const bookmarkCard = document.createElement('div');
    bookmarkCard.classList.add('bookmark-card');

    let contentHTML = '';
    if (bookmark.type === 'url') {
      contentHTML = `<a href="${bookmark.content}" target="_blank">${bookmark.content}</a>`;
    } else if (bookmark.type === 'image') {
      contentHTML = `<img src="${bookmark.content}" alt="${bookmark.name}" style="width: 100%;">`;
    } else {
      contentHTML = `<p>${bookmark.content}</p>`;
    }

    bookmarkCard.innerHTML = `
      <div class="card-content">${contentHTML}</div>
      <div class="card-footer">${bookmark.name}</div>
      <button class="delete-btn" onclick="deleteBookmark(${index})">
        -
      </button>
    `;

    bookmarkGrid.appendChild(bookmarkCard);
  });
}

// Delete bookmark
function deleteBookmark(index) {
  bookmarks.splice(index, 1);
  saveBookmarks();
  renderBookmarks();
}

// Download JSON of bookmarks
document.getElementById('download-json').addEventListener('click', () => {
  const jsonString = JSON.stringify(bookmarks, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'bookmarks.json';
  link.click();
});

// Upload JSON to load bookmarks
document.getElementById('upload-json').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      bookmarks = JSON.parse(event.target.result);
      saveBookmarks();
      renderBookmarks();
    };
    reader.readAsText(file);
  }
});
