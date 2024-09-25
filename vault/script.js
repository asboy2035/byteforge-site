let bookmarks = [];
let currentEditIndex = null; // Keep track of the bookmark being edited
let lastDeletedBookmark = null; // Keep track of the last deleted bookmark
let lastDeletedIndex = null; // Keep track of the index of the last deleted bookmark
let vaults = [];
let currentVaultIndex = 0; // Keep track of the current vault index
let currentVaultName = 'Default Vault'; // Default vault name


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
// DOM elements: Vaults
const vaultBtn = document.getElementById('vault-btn');
const vaultModal = document.getElementById('vault-modal');
const vaultNameInput = document.getElementById('vault-name');
const vaultSelect = document.getElementById('vault-select');
const createVaultBtn = document.getElementById('create-vault-btn');
const deleteVaultBtn = document.getElementById('delete-vault-btn');
const renameVaultBtn = document.getElementById('rename-vault-btn');

window.onload = () => {
  const savedVaults = localStorage.getItem('vaults');
  if (savedVaults) {
    vaults = JSON.parse(savedVaults);
  }
  renderVaults();
  loadCurrentVault();

  const savedBookmarks = localStorage.getItem('bookmarks');
  if (savedBookmarks) {
    bookmarks = JSON.parse(savedBookmarks);
    renderBookmarks();
  }
};

// Vaults

// Show/Hide Modal for Vaults
vaultBtn.addEventListener('click', () => {
  vaultModal.style.display = 'flex';
  renderVaults(); // Refresh the vault select options
});

// Close modal
closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    vaultModal.style.display = 'none';
  });
});

// Create new vault
createVaultBtn.addEventListener('click', () => {
  const newVaultName = vaultNameInput.value || `Vault ${vaults.length + 1}`;
  vaults.push({ name: newVaultName, bookmarks: [] });
  saveVaults();
  renderVaults();
  vaultNameInput.value = ''; // Clear the input
});

// Delete current vault
deleteVaultBtn.addEventListener('click', () => {
  if (vaults.length > 1) {
    vaults.splice(currentVaultIndex, 1); // Remove the current vault
    currentVaultIndex = 0; // Reset to the first vault
    saveVaults();
    loadCurrentVault();
    renderVaults();
  } else {
    alert("You cannot delete the last vault.");
  }
});

// Rename current vault
renameVaultBtn.addEventListener('click', () => {
  if (vaults[currentVaultIndex]) {
    vaults[currentVaultIndex].name = vaultNameInput.value;
    saveVaults();
    loadCurrentVault();
    renderVaults();
  }
});

// Load current vault bookmarks
function loadCurrentVault() {
  const currentVault = vaults[currentVaultIndex];
  bookmarks = currentVault ? currentVault.bookmarks : [];
  renderBookmarks();

  // Display the current vault name
  const vaultNameElement = document.getElementById('current-vault-name');
  vaultNameElement.textContent = currentVault ? currentVault.name : 'Default Vault';
}

// Save vaults to localStorage
function saveVaults() {
  localStorage.setItem('vaults', JSON.stringify(vaults));
}

// Render vaults in the select dropdown
function renderVaults() {
  vaultSelect.innerHTML = ''; // Clear existing options
  vaults.forEach((vault, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = vault.name;
    vaultSelect.appendChild(option);
  });

  // Update the current vault name
  vaultSelect.value = currentVaultIndex;
  vaultNameInput.value = vaults[currentVaultIndex]?.name || '';
}

// Change current vault on selection
vaultSelect.addEventListener('change', (e) => {
  currentVaultIndex = e.target.value;
  loadCurrentVault(); // Load bookmarks from the selected vault
});

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
        saveVaults();
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
    saveVaults();
    renderBookmarks();
    bookmarkForm.reset();
    bookmarkModal.style.display = 'none';
  }
});

// Render bookmarks in the grid and add Edit buttons
function renderBookmarks() {
  bookmarkGrid.innerHTML = ''; // Clear previous bookmarks
  const currentVault = vaults[currentVaultIndex];
  const bookmarks = currentVault ? currentVault.bookmarks : [];

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
  saveVaults();
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
      saveVaults();
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

// Upload JSON to add bookmarks to the current vault
document.getElementById('upload-json').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const uploadedBookmarks = JSON.parse(event.target.result);
      
      // Assuming uploadedBookmarks is an array, merge it with the existing bookmarks
      vaults[currentVaultIndex].bookmarks = vaults[currentVaultIndex].bookmarks.concat(uploadedBookmarks);
      saveVaults();
      loadCurrentVault();      
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

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
