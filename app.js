let font = new FontFace("Noto Sans KR", "url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;700&display=swap')");
font.load();
font = new FontFace("Dongle", "url('https://fonts.googleapis.com/css2?family=Dongle:wght@300;400;700&display=swap')");
font.load();
font = new FontFace("Gaegu", "url('https://fonts.googleapis.com/css2?family=Gaegu:wght@300;400;700&display=swap')");
font.load();

const canvas = document.querySelector("canvas");
const lineWidth = document.querySelector(".line-width");
const color = document.querySelector(".color");
const colorLabel = document.querySelector(".color-label");
const colorPicker = document.querySelector(".color-picker");
const colorOptions = document.querySelectorAll(".color-option");
// const colorOptions = Array.from(document.getElementsByClassName("color-option")); 와 같다
const modeBtn = document.querySelector(".mode-btn");
const drawBtn = document.querySelector(".draw-btn");
const destroyBtn = document.querySelector(".destroy-btn");
const eraserBtn = document.querySelector(".eraser-btn");
const fileBtn = document.querySelector(".file-btn");
const textInput = document.querySelector(".text-input");
const saveBtn = document.querySelector(".save-btn");
const fontFamily = document.querySelector(".font-family");
const fontStyle = document.querySelector(".font-style");
const fontSize = document.querySelector(".font-size");
const fontMode = document.querySelector(".font-mode");

const ctx = canvas.getContext("2d");  // ctx = context = 브러쉬 (그리는 것)
canvas.width = 800;
canvas.height = 800;
ctx.lineCap = "round";
let isPainting = false;
ctx.lineWidth = lineWidth.value;
ctx.strokeStyle = colorPicker.value;
ctx.fillStyle = colorPicker.value;
color.style.background = colorPicker.value;
colorOptions.forEach(color => {
  const colorValue = color.dataset.color;
  color.style.background = colorValue;
});
let isFill = false;
let isDrawFill = false;
let isEraser = false;
ctx.font = `${fontStyle.value} ${fontSize.value}px ${fontFamily.value}`;
let isFontFill = true;


// ctx.fillRect(50, 50, 100, 100);

// ctx.rect(150, 150, 100, 100);
// ctx.fillStyle = "orange";
// ctx.fill();
// ctx.moveTo(250, 250);
// ctx.lineTo(350,250);
// ctx.lineTo(350,350);
// ctx.lineTo(250,350);
// ctx.lineTo(250,250);
// ctx.lineWidth = 2;
// ctx.strokeStyle = "red";
// ctx.stroke();

// ctx.beginPath();
// ctx.arc(400, 100, 8, 0, 2 * Math.PI);
// ctx.arc(400 + 50, 100, 8, Math.PI, 2 * Math.PI);
// ctx.fillStyle = "green";
// ctx.fill();


// painting
function startPainting (event) {
  if (isFill) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    isPainting = true;
    ctx.moveTo(event.offsetX, event.offsetY);
  }
}
function onMove (event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
  }
}
function endPainting () {
  if (isDrawFill && !isEraser) {
    ctx.fill();
  }
  isPainting = false;
  ctx.beginPath();
}
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mouseup", endPainting);
canvas.addEventListener("mouseleave", endPainting);

// line width change
function onLineWidthChange (event) {
  ctx.lineWidth = event.target.value;
}
lineWidth.addEventListener("change", onLineWidthChange);

// color change
function onColorChange (event) {
  const colorValue = event.target.value;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.style.background = colorValue;
  colorPicker.value = colorValue;
}
function onColorClick (event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.style.background = colorValue;
  colorPicker.value = colorValue;
}
colorPicker.addEventListener("change", onColorChange);
colorOptions.forEach(color => {
  color.addEventListener("click", onColorClick);
});

// mode change
function onModeChange () {
  if (isFill) {
    isFill = false;
    modeBtn.innerText = "Draw Mode";
  } else {
    isFill = true;
    modeBtn.innerText = "Fill Mode";
  }
}
modeBtn.addEventListener("click", onModeChange);

// draw change
function onDrawChange () {
  if (isDrawFill) {
    isDrawFill = false;
    drawBtn.innerText = "Draw Stroke";
  } else {
    isDrawFill = true;
    drawBtn.innerText = "Draw Fill";
  }
}
drawBtn.addEventListener("click", onDrawChange);

// destroy
function onDestoryClick () {
  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}
destroyBtn.addEventListener("click", onDestoryClick);

// eraser
function onEraserClick () {
  if (isEraser) {
    isEraser = false;
    eraserBtn.innerText = "Eraser Off";
    ctx.strokeStyle = colorPicker.value;
  } else {
    isFill = false;
    modeBtn.innerText = "Draw Mode";
    isEraser = true;
    ctx.strokeStyle = "white";
    eraserBtn.innerText = "Eraser On";    
  }
}
eraserBtn.addEventListener("click", onEraserClick);

// add file
function onFileClick (event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  // const image = document.createElement("img"); 와 같다
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    fileBtn.value = null;
  };
}
fileBtn.addEventListener("change", onFileClick);

// add text
function onDoubleClick (event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save();
    ctx.lineWidth = 1;
    if (isFontFill) {
      ctx.fillText(text, event.offsetX, event.offsetY);
    } else {
      ctx.strokeText(text, event.offsetX, event.offsetY);
    }
    ctx.restore();
  }
}
canvas.addEventListener("dblclick", onDoubleClick);

// save image
function onSaveClick () {
  const url = canvas.toDataURL();
  const a = document.createElement("a");;
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}
saveBtn.addEventListener("click", onSaveClick);

// font change
function onFontFamilyChange (event) {
  ctx.font = `${fontStyle.value} ${fontSize.value}px ${event.target.value}`;
}
function onFontStyleChange (event) {
  ctx.font = `${event.target.value} ${fontSize.value}px ${fontFamily.value}`;
}
function onFontSizeChange (event) {
  ctx.font = `${fontStyle.value} ${event.target.value}px ${fontFamily.value}`;
}
function onFontModeClick () {
  if (isFontFill) {
    isFontFill = false;
    fontMode.innerText = "Font Stroke";
  } else {
    isFontFill = true;
    fontMode.innerText = "Font Fill";
  }
}
fontFamily.addEventListener("change", onFontFamilyChange);
fontStyle.addEventListener("change", onFontStyleChange);
fontSize.addEventListener("change", onFontSizeChange);
fontMode.addEventListener("click", onFontModeClick);
