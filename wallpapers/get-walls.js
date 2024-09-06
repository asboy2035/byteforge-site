// Fetch the wallpapers.json file
fetch('wallpapers.json')
  .then(response => response.json())
  .then(data => {
    const grid = document.querySelector('.grid');
    
    data.forEach(wallpaper => {
      // Create the card container
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');

      // Create the image element
      const img = document.createElement('img');
      img.src = wallpaper.image;
      img.alt = 'Image';
      imageContainer.appendChild(img);

      // Create the banner div
      const banner = document.createElement('div');
      banner.classList.add('banner');

      // Create the title (h2)
      const h2 = document.createElement('h2');
      if (wallpaper.link) {
        const link = document.createElement('a');
        link.href = wallpaper.link;
        link.textContent = wallpaper.name;
        h2.appendChild(link);
      } else {
        h2.textContent = wallpaper.name;
      }
      banner.appendChild(h2);
      
      const priceDiv = document.createElement('div');
      priceDiv.classList.add('price');
      priceDiv.textContent = wallpaper.price;
    
      // Create the author and compatibility paragraph
      const p = document.createElement('p');
      p.classList.add('author');
      p.textContent = wallpaper.author + (wallpaper.compatibility ? ' • ' + wallpaper.compatibility : '');
      banner.appendChild(p);

      // Append the price div to the image container
      imageContainer.appendChild(priceDiv);

      // Append the banner to the container
      imageContainer.appendChild(banner);

      // Append the image container to the grid
      grid.appendChild(imageContainer);
    });
  })
  .catch(error => console.error('Error loading wallpapers:', error));