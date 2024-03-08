let ctx2d = canvasElem2d.getContext("2d");
let ctx1d = canvasElem1d.getContext("2d");

// first enemy in tutorial
// enemies.push({ x: 8, y: 10, xVel: 0, yVel: 0, dir: 0, health: 100 });
// enemies.push({ x: 12, y: 20, xVel: 0, yVel: 0, dir: 0, health: 100 });
// enemies.push({ x: 5, y: 15, xVel: 0, yVel: 0, dir: 0, health: 100 });
// enemies.push({ x: 18, y: 8, xVel: 0, yVel: 0, dir: 0, health: 100 });
// enemies.push({ x: 3, y: 6, xVel: 0, yVel: 0, dir: 0, health: 100 });
// enemies.push({ x: 16, y: 12, xVel: 0, yVel: 0, dir: 0, health: 100 });
// enemies.push({ x: 9, y: 3, xVel: 0, yVel: 0, dir: 0, health: 100 });

function clearSelection() {
	document.activeElement.blur();
}

let anaglyph = false;
function toggleAnaglyph() {
	anaglyph = this.checked;
	clearSelection();
}
document.getElementById("anaglyph").onclick = toggleAnaglyph;
toggleAnaglyph.bind(document.getElementById("anaglyph"))();

let show2d = true;
function toggleDisplay2d() {
	show2d = this.checked;
	canvasElem2d.style.display = show2d ? "inline" : "none";
	clearSelection();
}
document.getElementById("show2d").onclick = toggleDisplay2d;
toggleDisplay2d.bind(document.getElementById("show2d"))();

// render quality/resolution
let maxRes = 450;
let renderQuality = 10;
function updateRenderQuality() {
	renderQuality = this.value;
	clearSelection();
}
document.getElementById("quality").onchange = updateRenderQuality;
updateRenderQuality.bind(document.getElementById("quality"))();

let bigPicture = true;
function updateCanvasSize() {
	canvasElem1d.width = bigPicture ? window.innerWidth : Math.min(window.innerWidth, 450);
	// canvasElem1d.height = canvasElem1d.width / 3;
	canvasElem2d.width = Math.min(window.innerWidth, 500);
}
window.onresize = updateCanvasSize;
function updateBigPicture() {
	bigPicture = this.checked;
	updateCanvasSize();
	clearSelection();
}
document.getElementById("bigPicture").onchange = updateBigPicture;
updateBigPicture.bind(document.getElementById("bigPicture"))();

let texIndex = 8;
function updateWorldTexture() {
	texIndex = parseInt(this.value);
	clearSelection();
}
document.getElementById("texture").onchange = updateWorldTexture;
updateWorldTexture.bind(document.getElementById("texture"))();

function render() {
	if (show2d) render2d();
	render1d();
}

let lastTime = Date.now();
let gameOverOpacity = 0;
let gameOverTime = 5000; // animation milliseconds

function runGame() {
	let currentTime = Date.now();
	let delta = currentTime - lastTime;
	lastTime = currentTime;

	if (player.health > 0) {
		render();

		update(Math.min(delta, 100));
	} else {
		if (gameOverOpacity < 1) {
			gameOverOpacity = Math.min(1, gameOverOpacity + delta / gameOverTime);
		}

		render();
		let resolution = maxRes / (10 / renderQuality);
		let pixelWidth = canvasElem1d.width / resolution;
		let texPixelWidth = (resolution / gameOverTexture.length) * pixelWidth;

		for (let i = 0; i < gameOverTexture.length; ++i) {
			let startPos = Math.round(i * texPixelWidth);
			let endPos = Math.round((i + 1) * texPixelWidth);
			ctx1d.beginPath();
			let color =
				"rgba(" +
				gameOverTexture[i].r +
				"," +
				gameOverTexture[i].g +
				"," +
				gameOverTexture[i].b +
				"," +
				gameOverOpacity +
				")";
			ctx1d.fillStyle = color;
			ctx1d.rect(startPos, 0, endPos - startPos, canvasElem1d.height); // TO DO: Update game over screen
			ctx1d.fill();
		}

		if (show2d) {
			ctx2d.font = "50px Arial";
			ctx2d.fillStyle = "black";
			ctx2d.fillText("Game Over", 22, 52);
			ctx2d.fillStyle = "white";
			ctx2d.fillText("Game Over", 20, 50);
		}
	}

	requestAnimationFrame(runGame);
}
runGame();
