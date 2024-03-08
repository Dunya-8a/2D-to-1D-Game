let canvasElem1d = document.getElementById("canvas1d");
canvasElem1d.width = "150";
canvasElem1d.height = "100";

const resolution = canvasElem1d.width; // The number of rays to cast corresponds to the canvas width

function render1d() {
	let canvasWidth = canvasElem1d.width;
	let canvasHeight = canvasElem1d.height; // Now used to ensure square pixels

	// Clear the canvas or set up background if needed

	for (let i = 0; i < resolution; ++i) {
		// half the FOV to the left and right of the player's direction
		// iterate through the rays cast out from the player determined by chosen angle between rays (resolution)
		let rayAngle = player.direction - FOV / 2 + i * angleBetweenRays; // Adjust ray angle
		let color = castRay(player.x, player.y, rayAngle); // Cast ray and get color

		// Calculate the width and height of each "pixel" in the 1D strip
		let pixelWidth = canvasWidth / resolution;
		let pixelHeight = pixelWidth; // Square pixels

		// Draw the pixel with border
		ctx1d.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
		// ctx1d.lineWidth = 1;
		// ctx1d.strokeStyle = "black";
		ctx1d.fillRect(i * pixelWidth, 0, pixelWidth, pixelHeight);
	}
}
