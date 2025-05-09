const imageUpload = document.getElementById('imageUpload');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const generateBtn = document.getElementById('generate');
const downloadBtn = document.getElementById('download');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const textColorPicker = document.getElementById('textColor');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const openEmojiPickerBtn = document.getElementById('openEmojiPicker');
const emojiCard = document.getElementById('emojiCard');
const addTextBtn = document.getElementById('addTextBtn');
const editTextBox = document.getElementById('editTextBox');
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');

let uploadedImage = new Image();
let texts = []; // draggable text objects
let draggingText = null;
let selectedTextObject = null;
let offsetX = 0;
let offsetY = 0;

// Load Image
imageUpload.addEventListener('change', (e) => {
  const reader = new FileReader();
  reader.onload = () => {
    uploadedImage.src = reader.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

uploadedImage.onload = () => {
  canvas.width = uploadedImage.width;
  canvas.height = uploadedImage.height;

  setupTexts();
  drawMeme();
};

// Setup initial draggable texts
function setupTexts() {
  texts = [
    {
      text: topTextInput.value,
      x: canvas.width / 2,
      y: 60,
      fontSize: parseInt(fontSizeSlider.value),
      color: textColorPicker.value
    },
    {
      text: bottomTextInput.value,
      x: canvas.width / 2,
      y: canvas.height - 20,
      fontSize: parseInt(fontSizeSlider.value),
      color: textColorPicker.value
    }
  ];
}

// Redraw everything
function drawMeme() {
  if (!uploadedImage.src) return;

  canvas.width = uploadedImage.width;
  canvas.height = uploadedImage.height;
  ctx.drawImage(uploadedImage, 0, 0);

  texts.forEach(t => {
    ctx.font = `${t.fontSize}px ${fontFamilySelect.value}`;
    ctx.fillStyle = t.color;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    ctx.fillText(t.text, t.x, t.y);
    ctx.strokeText(t.text, t.x, t.y);
  });
}

// Update text objects live
topTextInput.addEventListener('input', () => {
  texts[0].text = topTextInput.value;
  drawMeme();
});
bottomTextInput.addEventListener('input', () => {
  texts[1].text = bottomTextInput.value;
  drawMeme();
});

// Handle Generate Button
generateBtn.addEventListener('click', () => {
  texts.forEach(t => {
    t.fontSize = parseInt(fontSizeSlider.value);
    t.color = textColorPicker.value;
  });
  drawMeme();
});

// Handle Download Button
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL();
  link.click();
});

// Dragging Events
canvas.addEventListener('mousedown', (e) => {
  const mousePos = getMousePos(canvas, e);
  draggingText = texts.find(t => isMouseOnText(t, mousePos));

  if (draggingText) {
    offsetX = mousePos.x - draggingText.x;
    offsetY = mousePos.y - draggingText.y;
    selectedTextObject = draggingText;
  } else {
    selectedTextObject = null;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (draggingText) {
    const mousePos = getMousePos(canvas, e);
    draggingText.x = mousePos.x - offsetX;
    draggingText.y = mousePos.y - offsetY;
    drawMeme();
  }
});

canvas.addEventListener('mouseup', () => {
  draggingText = null;
});

// Double-click to Edit
canvas.addEventListener('dblclick', (e) => {
  if (selectedTextObject) {
    const rect = canvas.getBoundingClientRect();
    editTextBox.style.left = `${e.clientX}px`;
    editTextBox.style.top = `${e.clientY}px`;
    editTextBox.style.display = 'block';
    editTextBox.value = selectedTextObject.text;
    editTextBox.focus();
  }
});

editTextBox.addEventListener('blur', () => {
  if (selectedTextObject) {
    selectedTextObject.text = editTextBox.value;
    drawMeme();
  }
  editTextBox.style.display = 'none';
});

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY
  };
}

function isMouseOnText(t, pos) {
  ctx.font = `${t.fontSize}px ${fontFamilySelect.value}`;
  const textWidth = ctx.measureText(t.text.toUpperCase()).width;
  const textHeight = t.fontSize;
  return (
    pos.x >= t.x - textWidth / 2 &&
    pos.x <= t.x + textWidth / 2 &&
    pos.y >= t.y - textHeight &&
    pos.y <= t.y
  );
}

// Emoji Picker Events
openEmojiPickerBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  emojiCard.style.display = (emojiCard.style.display === 'none') ? 'flex' : 'none';
});

document.querySelectorAll('.emoji').forEach(emojiEl => {
  emojiEl.addEventListener('click', (e) => {
    e.stopPropagation();
    const emoji = emojiEl.textContent;

    if (document.activeElement === topTextInput) {
      topTextInput.value += emoji;
      texts[0].text = topTextInput.value;
    } else if (document.activeElement === bottomTextInput) {
      bottomTextInput.value += emoji;
      texts[1].text = bottomTextInput.value;
    } else if (selectedTextObject) {
      selectedTextObject.text += emoji;
    }

    drawMeme();
  });
});

document.addEventListener('click', (e) => {
  if (!emojiCard.contains(e.target) && e.target !== openEmojiPickerBtn) {
    emojiCard.style.display = 'none';
  }
});

// Add new text box
addTextBtn.addEventListener('click', () => {
  texts.push({
    text: "New Text",
    x: canvas.width / 2,
    y: canvas.height / 2,
    fontSize: parseInt(fontSizeSlider.value),
    color: textColorPicker.value
  });
  drawMeme();
});