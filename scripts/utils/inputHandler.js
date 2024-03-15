let keys = {
	forward: false,
	backward: false,
	left: false,
	right: false,
	shoot: false,
};

function updateKey(keyCode, value) {
	switch (keyCode) {
		case 38: // up key
		case 87: // W key; fallthrough
			keys.forward = value;
			break;
		case 40: // down key
		case 83: // S key; fallthrough
			keys.backward = value;
			break;
		case 37: // left key
		case 65: // A key; fallthrough
			keys.left = value;
			break;
		case 39: // right key
		case 68: // D key; fallthrough
			keys.right = value;
			break;
		case 32: // space key
		case 90: // Z key; fallthrough
		case 88: // X key; fallthrough
			keys.shoot = value;
			break;
	}
}

window.onkeydown = function (e) {
	updateKey(e.keyCode, true);
	e.preventDefault();
};

window.onkeyup = function (e) {
	updateKey(e.keyCode, false);
};

let buttonL = document.getElementById("buttonL");
let buttonR = document.getElementById("buttonR");
let buttonF = document.getElementById("buttonF");
let buttonB = document.getElementById("buttonB");
let buttonS = document.getElementById("buttonS");
// check for touch device
if ("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
	document.getElementById("controls").style.display = "none";
	buttonL.ontouchstart = function () {
		keys.left = true;
		this.style.backgroundColor = "#555";
	};
	buttonL.ontouchend = function () {
		keys.left = false;
		this.style.backgroundColor = "";
	};

	buttonR.ontouchstart = function () {
		keys.right = true;
		this.style.backgroundColor = "#555";
	};
	buttonR.ontouchend = function () {
		keys.right = false;
		this.style.backgroundColor = "";
	};

	buttonF.ontouchstart = function () {
		keys.forward = true;
		this.style.backgroundColor = "#555";
	};
	buttonF.ontouchend = function () {
		keys.forward = false;
		this.style.backgroundColor = "";
	};

	buttonB.ontouchstart = function () {
		keys.backward = true;
		this.style.backgroundColor = "#555";
	};
	buttonB.ontouchend = function () {
		keys.backward = false;
		this.style.backgroundColor = "";
	};

	buttonS.ontouchstart = function () {
		keys.shoot = true;
		this.style.backgroundColor = "#555";
	};
	buttonS.ontouchend = function () {
		keys.shoot = false;
		this.style.backgroundColor = "";
	};
} else {
	document.getElementById("buttonContainer").style.display = "none";
}

// function sensorsHandler(potentioValue, imuValue) {
// 	// Move forward and backward based on potentioValue
// 	// angAcc = potentioValue / 100;

// 	// The potentiometer has a range of 0 to 40. Map it to a range of -1 to 1
// 	let potentioMapped = (potentioValue - 20) / 20;
// 	console.log(potentioMapped);
// 	if (potentioMapped > 0.1) {
// 		keys.forward = true;
// 		keys.backward = false;
// 	}
// 	else if (potentioMapped < -0.1) {
// 		keys.forward = false;
// 		keys.backward = true;
// 	}
// 	else if (potentioMapped > -0.1 && potentioMapped < 0.1) {
// 		keys.forward = false;
// 		keys.backward = false;
// 	}

// 	// Move left and right based on imuValue
// 	// angVel = imuValue / 100;
// }

const mapPotentiometer = (potentioValue, inputRangeMin, inputRangeMax, desiredRangeMin, desiredRangeMax) => {
	const inputRange = inputRangeMax - inputRangeMin;
	const desiredRange = desiredRangeMax - desiredRangeMin;
	const normalizedValue = (potentioValue - inputRangeMin) / inputRange;
	const mappedValue = desiredRange * normalizedValue + desiredRangeMin;
	return mappedValue;
};

const mapIMU = (imuValue) => {
	// The IMU has a range of -80 to 80
	const inputRangeMin = -80;
	const inputRangeMax = 80;
	// Desired range is to - 100 to 100
	const desiredRangeMin = -100;
	const desiredRangeMax = 100;
	
	// Cap the min to - 30 even if the IMU value is less than - 30 and the max to 30 even if the IMU value is greater than 30
	let mappedValue = imuValue;
	if (mappedValue < -30) {
		mappedValue = -30;
	} else if (mappedValue > 30) {
		mappedValue = 30;
	}

	mappedValue = mapPotentiometer(mappedValue, inputRangeMin, inputRangeMax, desiredRangeMin, desiredRangeMax);
	return mappedValue;
};
