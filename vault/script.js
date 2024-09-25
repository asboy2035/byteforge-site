let bookmarks = [];
let currentEditIndex = null; // Keep track of the bookmark being edited
let lastDeletedBookmark = null; // Keep track of the last deleted bookmark
let lastDeletedIndex = null; // Keep track of the index of the last deleted bookmark

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
addBookmarkBtn.addEventListener('click', () => {
  bookmarkModal.style.display = 'flex';
  currentEditIndex = null; // Reset edit index for adding new bookmark
});
settingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');

closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    bookmarkModal.style.display = 'none';
    settingsModal.style.display = 'none';
  });
});

// Handle form submission (add/edit bookmark)
bookmarkForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = bookmarkNameInput.value;
  const type = bookmarkTypeInput.value;
  let content;

  // Handle image type bookmarks
  if (type === 'image') {
    const file = bookmarkImageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        content = event.target.result; // Base64-encoded image
        if (currentEditIndex === null) {
          // Adding new bookmark
          bookmarks.push({ name, type, content });
        } else {
          // Editing existing bookmark (only title for images)
          bookmarks[currentEditIndex].name = name;
        }
        saveBookmarks();
        renderBookmarks();
        bookmarkForm.reset();
        bookmarkModal.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  } else {
    // For URL and Text types
    content = bookmarkContentInput.value;
    if (currentEditIndex === null) {
      // Adding new bookmark
      bookmarks.push({ name, type, content });
    } else {
      // Editing existing bookmark (title and content)
      bookmarks[currentEditIndex].name = name;
      bookmarks[currentEditIndex].content = content;
    }
    saveBookmarks();
    renderBookmarks();
    bookmarkForm.reset();
    bookmarkModal.style.display = 'none';
  }
});

// Save bookmarks to localStorage
function saveBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

// Render bookmarks in the grid and add Edit buttons
function renderBookmarks() {
  bookmarkGrid.innerHTML = ''; // Clear previous bookmarks
  bookmarks.forEach((bookmark, index) => {
    const bookmarkCard = document.createElement('div');
    bookmarkCard.classList.add('image-container');

    let contentHTML = '';
    if (bookmark.type === 'url') {
      contentHTML = `<a href="${bookmark.content}" target="_blank"><p class="url">${bookmark.content}</p></a>`;
    } else if (bookmark.type === 'image') {
      contentHTML = `
        <img src="${bookmark.content}" alt="${bookmark.name}" style="width: 100%;" class="accent">
        <img src="${bookmark.content}" alt="${bookmark.name}" style="width: 100%;">
      `;
    } else {
      contentHTML = `<p>${bookmark.content}</p>`;
    }

    bookmarkCard.innerHTML = `
      <div class="banner">${bookmark.name}</div>
      <div class="card-content">${contentHTML}</div>
      <button class="edit-btn" onclick="editBookmark(${index})">...</button>
      <button class="delete-btn" onclick="deleteBookmark(${index})">-</button>
    `;

    bookmarkGrid.appendChild(bookmarkCard);
  });
}

// Edit bookmark
function editBookmark(index) {
  currentEditIndex = index;
  const bookmark = bookmarks[index];
  bookmarkNameInput.value = bookmark.name;
  bookmarkTypeInput.value = bookmark.type;

  if (bookmark.type === 'image') {
    document.getElementById('bookmark-content').classList.add('hidden');
    document.getElementById('bookmark-image').classList.remove('hidden');
    document.getElementById('image-upload-label').classList.remove('hidden');
    bookmarkContentInput.value = ''; // Clear content for image bookmarks
  } else {
    document.getElementById('bookmark-content').classList.remove('hidden');
    document.getElementById('bookmark-image').classList.add('hidden');
    document.getElementById('image-upload-label').classList.add('hidden');
    bookmarkContentInput.value = bookmark.content; // Pre-fill content for text/url
  }

  bookmarkModal.style.display = 'flex';
}

// Delete bookmark
function deleteBookmark(index) {
  // Save the deleted bookmark and its index
  lastDeletedBookmark = bookmarks[index];
  lastDeletedIndex = index;

  // Remove the bookmark
  bookmarks.splice(index, 1);
  saveBookmarks();
  renderBookmarks();

  // Show undo message
  const undoDiv = document.createElement('div');
  undoDiv.classList.add('undo');
  undoDiv.innerHTML = `
    <p>Card removed</p>
    <button class="undo-btn">Undo</button>
  `;
  bookmarkGrid.appendChild(undoDiv);

  // Remove undo message after 2 seconds
  setTimeout(() => {
    undoDiv.remove();
  }, 5000);

  // Handle undo button click
  undoDiv.querySelector('.undo-btn').addEventListener('click', () => {
    if (lastDeletedBookmark && lastDeletedIndex !== null) {
      bookmarks.splice(lastDeletedIndex, 0, lastDeletedBookmark);
      saveBookmarks();
      renderBookmarks();
      undoDiv.remove();
    }
  });
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

// Listen for changes in the bookmark type dropdown
bookmarkTypeInput.addEventListener('change', () => {
  if (bookmarkTypeInput.value === 'image') {
    bookmarkContentInput.classList.add('hidden'); // Hide the URL/Text input
    bookmarkImageInput.classList.remove('hidden'); // Show the image upload input
    imageUploadLabel.classList.remove('hidden'); // Show the image upload label
  } else {
    bookmarkContentInput.classList.remove('hidden'); // Show the URL/Text input
    bookmarkImageInput.classList.add('hidden'); // Hide the image upload input
    imageUploadLabel.classList.add('hidden'); // Hide the image upload label
  }
});
