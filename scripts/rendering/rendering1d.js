let canvasElem1d = document.getElementById("canvas1d");
canvasElem1d.width = "150";
canvasElem1d.height = "100";

const resolution = canvasElem1d.width; // The number of rays to cast corresponds to the canvas width

function render1d() {
	let canvasWidth = canvasElem1d.width;
	let canvasHeight = canvasElem1d.height; // Now used to ensure square pixels
	// Calculate the width and height of each "pixel" in the 1D strip
	let pixelWidth = canvasWidth / resolution;
	let pixelHeight = pixelWidth; // Square pixels

	// Clear the canvas or set up background if needed
	ctx1d.clearRect(0, 0, canvasWidth, canvasHeight); // turn off to get rid of lines between pixels

	for (let i = 0; i < resolution - player.points; ++i) {
		// half the FOV to the left and right of the player's direction
		// iterate through the rays cast out from the player determined by chosen angle between rays (resolution)
		let rayAngle = player.direction - FOV / 2 + i * angleBetweenRays; // Adjust ray angle
		let color = castRay(player.x, player.y, rayAngle); // Cast ray and get color

		// Draw the pixel with border
		ctx1d.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
		// ctx1d.lineWidth = 1;
		// ctx1d.strokeStyle = "black";
		ctx1d.fillRect(i * pixelWidth, 0, pixelWidth, pixelHeight);
	}

	// Draw the player's points
	// Make sure this calculation uses the updated pixelWidth
	const startX = canvasWidth - player.points * pixelWidth;

	for (let i = 0; i < player.points; i++) {
		// Convert portalColor to a CSS color string
		let colorString = `rgb(${portalColor.r},${portalColor.g},${portalColor.b})`;
		ctx1d.fillStyle = colorString;
		ctx1d.fillRect(startX + i * pixelWidth, 0, pixelWidth, pixelHeight);
	}
}
