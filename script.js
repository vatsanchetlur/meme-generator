const imageUpload = document.getElementById('imageUpload');
const topText = document.getElementById('topText');
const bottomText = document.getElementById('bottomText');
const generateBtn = document.getElementById('generate');
const downloadBtn = document.getElementById('download');
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

// 🎯 New controls
const fontSizeSlider = document.getElementById('fontSizeSlider');
const textColorPicker = document.getElementById('textColor');

let uploadedImage = new Image();

imageUpload.addEventListener('change', (e) => {
  const reader = new FileReader();
  reader.onload = () => {
    uploadedImage.src = reader.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

uploadedImage.onload = () => {
  drawMeme();
};

generateBtn.addEventListener('click', () => {
  drawMeme();
});

function drawMeme() {
  if (!uploadedImage.src) return;

  // Set canvas size to match image
  canvas.width = uploadedImage.width;
  canvas.height = uploadedImage.height;

  // Draw the uploaded image
  ctx.drawImage(uploadedImage, 0, 0);

  // 🎨 Text styles
  const fontSize = fontSizeSlider.value;
  ctx.font = `${fontSize}px Impact`;
  ctx.fillStyle = textColorPicker.value;
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  ctx.textAlign = 'center';

  // Draw Top Text
  ctx.fillText(topText.value.toUpperCase(), canvas.width / 2, 60);
  ctx.strokeText(topText.value.toUpperCase(), canvas.width / 2, 60);

  // Draw Bottom Text
  ctx.fillText(bottomText.value.toUpperCase(), canvas.width / 2, canvas.height - 20);
  ctx.strokeText(bottomText.value.toUpperCase(), canvas.width / 2, canvas.height - 20);
}

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL();
  link.click();
});