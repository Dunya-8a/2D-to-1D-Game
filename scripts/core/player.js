// Define the FOV and calculate the angle between rays
const FOV = Math.PI / 2; // 90 degrees in radians, representing a typical FOV for a first-person perspective
const angleBetweenRays = FOV / resolution; // -> resolution is a global variable

// TO DO: resolution should be passed or be a global variable

let playerType = 1;
let player = {
	x: 1.5,
	y: 1.5,
	xVel: 0.0,
	yVel: 0.0,
	angVel: 0.0, // angular velocity
	type: playerType,
	direction: 0.0, // direction in radians
	cooldown: 0.0, // remaining cooldown time
	health: 100,
	points: 2,
};

function drawPlayer() {
	let cX = canvasElem2d.width / 2;
	let cY = canvasElem2d.height / 2;
	ctx2d.beginPath();
	ctx2d.strokeStyle = "black";
	ctx2d.fillStyle = "dodgerblue"; // player color
	ctx2d.arc(cX, cY, 16 / 2, 0, 2 * Math.PI, false);
	ctx2d.fill();
	ctx2d.stroke();
	// left eye
	ctx2d.fillStyle = "white";
	ctx2d.beginPath();
	let leftEyeAng = player.direction - Math.PI / 5;
	let leftEyeX = cX + Math.cos(leftEyeAng) * 6;
	let leftEyeY = cY + Math.sin(leftEyeAng) * 6;
	ctx2d.arc(leftEyeX, leftEyeY, 3, 0, 2 * Math.PI, false);
	ctx2d.fill();
	ctx2d.stroke();

	// left pupil
	ctx2d.fillStyle = "black";
	ctx2d.beginPath();
	let leftPupilAng = player.direction - Math.PI / 6;
	let leftPupilX = cX + Math.cos(leftPupilAng) * 7.5;
	let leftPupilY = cY + Math.sin(leftPupilAng) * 7.5;
	ctx2d.arc(leftPupilX, leftPupilY, 1.5, 0, 2 * Math.PI, false);
	ctx2d.fill();
	ctx2d.stroke();

	// right eye
	ctx2d.fillStyle = "white";
	ctx2d.beginPath();
	let rightEyeAng = player.direction + Math.PI / 5;
	let rightEyeX = cX + Math.cos(rightEyeAng) * 6;
	let rightEyeY = cY + Math.sin(rightEyeAng) * 6;
	ctx2d.arc(rightEyeX, rightEyeY, 3, 0, 2 * Math.PI, false);
	ctx2d.fill();
	ctx2d.stroke();

	// right pupil
	ctx2d.fillStyle = "black";
	ctx2d.beginPath();
	let rightPupilAng = player.direction + Math.PI / 6;
	let rightPupilX = cX + Math.cos(rightPupilAng) * 7.5;
	let rightPupilY = cY + Math.sin(rightPupilAng) * 7.5;
	ctx2d.arc(rightPupilX, rightPupilY, 1.5, 0, 2 * Math.PI, false);
	ctx2d.fill();
	ctx2d.stroke();
}
