// Get HTML elements
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scaleInput = document.getElementById('scale');
const rotationInput = document.getElementById('rotation');
const bgColorInput = document.getElementById('bgColor');
const roundRadiusInput = document.getElementById('roundRadius'); // Rounded radius
const filenameInput = document.getElementById('filename');
const saveBtn = document.getElementById('saveBtn');
const selectImageBtn = document.getElementById('selectImageBtn');
const imageModal = document.getElementById('imageModal');
const imageGrid = document.getElementById('imageGrid');

let img = new Image();  // To store the selected image
let scale = 1;
let rotation = 0;
let bgColor = '#ffffff';
let roundRadius = 0;  // Default rounded radius

// Function to draw a rounded rectangle
function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Function to draw the canvas
function drawCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background with rounded corners
    ctx.save();  // Save canvas state
    drawRoundedRect(0, 0, canvas.width, canvas.height, roundRadius);
    ctx.fillStyle = bgColor;  // Set background color
    ctx.fill();
    ctx.restore();  // Restore canvas state

    if (img.src) {
        // Save canvas state
        ctx.save();

        // Center the image
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Rotate the canvas
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation * Math.PI / 180);

        // Draw the image with the set scale and rotation
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;
        ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

        // Restore canvas state
        ctx.restore();
    }
}

// Event listener for rounded radius
roundRadiusInput.addEventListener('input', (event) => {
    roundRadius = event.target.value;
    drawCanvas();
});

// Show modal when "Select Image" button is clicked
selectImageBtn.addEventListener('click', () => {
    imageModal.style.display = 'block';
    fetch('load_images.php')  // Load images from img/ folder
        .then(response => response.text())
        .then(data => {
            imageGrid.innerHTML = data;  // Display images in modal
        });
});

// Function to close the modal
imageModal.addEventListener('click', (event) => {
    if (event.target === imageModal) {
        imageModal.style.display = 'none';
    }
});

// Function to select an image
function selectImage(src) {
    img.src = src;
    img.onload = drawCanvas;  // Redraw canvas when image is selected
    imageModal.style.display = 'none';  // Close modal
}

// When scale is changed
scaleInput.addEventListener('input', (event) => {
    scale = event.target.value;
    drawCanvas();
});

// When rotation is changed
rotationInput.addEventListener('input', (event) => {
    rotation = event.target.value;
    drawCanvas();
});

// When background color is changed
bgColorInput.addEventListener('input', (event) => {
    bgColor = event.target.value;
    drawCanvas();
});

function setTransparent() {
    bgColor = 'transparent';
    drawCanvas();
}


// Save canvas as PNG with file name from input
saveBtn.addEventListener('click', () => {
  // Get file name from input, add default value if empty
  let filename = filenameInput.value.trim() || 'logo.png';

  // Ensure the file name ends with '.png'
  if (!filename.endsWith('.png')) {
    filename += '.png';
  }

  // Create <a> element to download image
  const link = document.createElement('a');
  link.download = filename; // Set file name
  link.href = canvas.toDataURL('image/png'); // Set data URL from canvas
  link.click(); // Trigger download
});
