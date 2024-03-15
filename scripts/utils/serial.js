// // Connect to the Socket.IO server
// const socket = io("http://127.0.0.1:3000");

// let values, potentioValue, imuValue;
// let imuDirection = "static";
// let imuDifferenceAbs = 0; // The difference between the current and previous imuValue
// let prevImuValue = null;

// // Listen for data event
// socket.on("data", function (data) {
// 	// console.log(data);
// 	values = data.split(",");
// 	potentioValue = parseFloat(values[0]); // Converts string to a floating-point number
// 	potentioValue = mapPotentiometer(potentioValue, -2.09, 1.96, -100, 100);

// 	imuValue = parseFloat(values[4]);
// 	imuValue = mapIMU(imuValue);
// 	console.log(imuValue);

// 	// console.log(prevImuValue, imuValue, imuDirection);
// 	imuDirection != "static" ? console.log(imuDirection) : null;

// 	if (prevImuValue !== null) {
// 		// Ensure prevImuValue has been set
// 		imuDifferenceAbs = Math.abs(imuValue - prevImuValue);

// 		// if IMU value is between -0.1 and 0.1, then the IMU is static
// 		if (imuDifferenceAbs < 0.05) {
// 			imuDirection = "static";
// 		} else {
// 			imuDirection = imuValue > 0 ? "left" : "right";
// 			prevImuValue = imuValue; // Update prevImuValue only when the difference is greater than 0.2
// 		}

// 		// else
// 		// {
// 		// 	imuDirection = "static";
// 		// }
// 	} else {
// 		prevImuValue = imuValue; // Initialize prevImuValue on the first run
// 	}

// // imuValue = mapIMU(imuValue);
// let stepImuValue;

// let imuDifferenceAbs = imuValue - stepImuValue;

// switch (imuDifferenceAbs) {
// 	case imuDifferenceAbs > 0.2:
// 		imuDirection = "right";
// 		break;
// 	case imuDifferenceAbs < -0.2:
// 		imuDirection = "left";
// 		break;
// 	case imuDifferenceAbs > -0.2 && imuDifferenceAbs < 0.2:
// 		imuDirection = "static";
// 		break;
// }

// let imuStep = 0.2;

// // // Update imuValue only if the new value is different
// if (stepImuValue - imuValue > imuStep || stepImuValue - imuValue < -imuStep) {
// 	stepImuValue = imuValue;
// 	// console.log(`imuValue: ${imuValue}`);
// }

// if (newImuValue > imuValue + imuStep) {

// } else if (newImuValue < imuValue - imuStep) {

// } else if (newImuValue > imuValue - imuStep && newImuValue < imuValue + imuStep) {
// }

// Update potentioValue only if the new value is different
// if (newPotentioValue != potentioValue) {
// 	potentioValue = newPotentioValue;
// 	// console.log(`potentioValue: ${potentioValue}`);
// }
// });

///////////////////////////////////////////////////////////

// Connect to the Socket.IO server
const socket = io("http://127.0.0.1:3000");

let values, potentioValue, imuValue;
let imuDirection = "static";
let prevImuValue = null;
let imuValuesQueue = []; // Queue to store the last N imuValues for moving average
let imuDifferenceAbs = 0;
const queueMaxLength = 5; // Length of the moving average queue
let lastUpdateTime = 0; // Track the last update time for throttling
const updateInterval = 100; // Minimum time between updates in milliseconds

// Listen for data event
socket.on("data", function (data) {
	console.log(data);
	const currentTime = new Date().getTime();
	if (currentTime - lastUpdateTime < updateInterval) return; // Throttle updates
	lastUpdateTime = currentTime;

	// console.log(data);
	values = data.split(",");
	potentioValue = parseFloat(values[0]); // Converts string to a floating-point number
	potentioValue = mapPotentiometer(potentioValue, -2.09, 1.96, -100, 100);

	imuValue = parseFloat(values[4]);
	imuValue = mapIMU(imuValue);
	// console.log(imuValue);

	// Update moving average queue
	if (imuValuesQueue.length >= queueMaxLength) {
		imuValuesQueue.shift(); // Remove the oldest value
	}
	imuValuesQueue.push(imuValue);

	// Calculate moving average
	const sum = imuValuesQueue.reduce((a, b) => a + b, 0);
	const avgImuValue = sum / imuValuesQueue.length;

	// Determine the direction based on the average value
	if (prevImuValue !== null) {
		// Ensure prevImuValue has been set
		imuDifferenceAbs = Math.abs(imuValue - prevImuValue);
		if (imuDifferenceAbs < 0.02) {
			imuDirection = "static";
		} else {
			imuDirection = imuValue > 0 ? "left" : "right";
			prevImuValue = imuValue; // Update prevImuValue only when the difference is greater than 0.2
		}
	} else {
		prevImuValue = imuValue; // Initialize prevImuValue on the first run
	}

	imuDirection != "static" ? console.log(imuDirection) : null;
});
