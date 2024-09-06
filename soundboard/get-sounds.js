// Fetch the wallpapers.json file
fetch('sounds.json')
  .then(response => response.json())
  .then(data => {
    const grid = document.getElementById('soundGrid');
    
    data.forEach(sound => {
      // Create the card container
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');

      // Create the image element
      const img = document.createElement('img');
      img.src = sound.image;
      img.alt = 'Image';
      imageContainer.appendChild(img);
      imageContainer.onclick = () => playSound(sound.sound); 

      // Create the banner div
      const banner = document.createElement('div');
      banner.classList.add('banner');

      // Create the title (h2)
      const h2 = document.createElement('h2');
      h2.textContent = sound.name;
      banner.appendChild(h2);

      // Append the banner to the container
      imageContainer.appendChild(banner);

      // Append the image container to the grid
      grid.appendChild(imageContainer);
    });
  })
  .catch(error => console.error('Error loading sounds:', error));

  function playSound(soundPath) {
  var audio = new Audio(soundPath);
  audio.play();
}