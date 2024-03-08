let canvasElem2d = document.getElementById("canvas2d");
canvasElem2d.width = "400";
canvasElem2d.height = "400";

function drawStage2d() {
	let cX = canvasElem2d.width / 2;
	let cY = canvasElem2d.height / 2;
	// ctx2d.strokeStyle = "yellow";
	const colorIndex = textures1D[texIndex][0];
	const lineColor = `rgb(${colorIndex.r},${colorIndex.g},${colorIndex.b})`;
	ctx2d.strokeStyle = lineColor;
	// portal color
	ctx2d.fillStyle = "rgb(" + portalColor.r + "," + portalColor.g + "," + portalColor.b + ")";

	for (let y = 0; y < world.length; ++y) {
		for (let x = 0; x < world[y].length; ++x) {
			if (world[y][x] > 0) {
				//ctx2d.strokeStyle = world[y][x] > 0 ? "yellow" : "red"
				ctx2d.strokeStyle = lineColor;
				ctx2d.beginPath();
				ctx2d.rect((x - player.x) * 32 + cX, (y - player.y) * 32 + cY, 32, 32);
				if (world[y][x] == 2) {
					ctx2d.fill();
				}
				ctx2d.stroke();
			}
		}
	}
}

function render2d() {
	ctx2d.beginPath();
	ctx2d.fillStyle = "black";
	ctx2d.strokeStyle = "white";
	ctx2d.rect(0, 0, canvasElem2d.width, canvasElem2d.height);
	ctx2d.fill();
	ctx2d.stroke();
	drawStage2d();
	drawBullets();
	drawPlayer();
	drawEnemies();
}
