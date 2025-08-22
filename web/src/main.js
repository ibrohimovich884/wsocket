import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// HTML elementlar
const rooms = document.querySelectorAll(".rooms");
const form = document.getElementById("register-form");
const usernameInput = document.getElementById("username");
const gameIdInput = document.getElementById("gameId");
const xPlayerBox = document.querySelector(".x-player");
const oPlayerBox = document.querySelector(".o-player");
const timerBox = document.querySelector(".timer");
const register = document.getElementById("register");
const ticContent = document.querySelector(".tic-content");
const joinBtn = document.querySelector(".join-btn");

joinBtn.addEventListener("click", () => {
  if (register.style.display === "block" || register.style.display === "") {
    register.style.display = "none";   
    ticContent.style.display = "block";
  }
});



let role = null;
let gameId = null;

// Royxatdan otish
form.addEventListener("submit", (e) => {
	e.preventDefault();
	const username = usernameInput.value.trim();
	gameId = gameIdInput.value.trim();

	if (!username || !gameId) return;

	socket.emit("joinGame", { username, gameId });
});

// Player rolini olish
socket.on("playerRole", (data) => {
	role = data.role;
	alert(`You are ${role}`);
	console.log(role);

});

socket.on("updateBoard", ({ board, currentTurn, players }) => {
	// board yangilash
	rooms.forEach((cell, i) => {
		cell.textContent = board[i] || "";
	});

	//  yangi: player nomlarini chiqarish
	xPlayerBox.textContent = players.X || "Waiting...";
	oPlayerBox.textContent = players.O || "Waiting...";

	//  yangi: navbat + timer
	startTimer(currentTurn);
});

// O‘yin tugasa
socket.on("gameOver", ({ winner, board }) => {
	rooms.forEach((cell, i) => {
		cell.textContent = board[i] || "";
	});

	clearInterval(timerInterval);

	if (winner === "draw") {
		timerBox.textContent = "Draw 🤝";
	} else {
		timerBox.textContent = `Winner: ${winner} 🏆`;
	}
});

rooms.forEach((cell, i) => {
	cell.addEventListener("click", () => {
		if (role && gameId) {
			socket.emit("makeMove", { gameId, index: i, role });
		}
	});
});

let timerInterval;

function startTimer(currentTurn) {
	clearInterval(timerInterval);
	let timeLeft = 10;

	timerBox.textContent = `${currentTurn}'s turn (${timeLeft}s)`;

	timerInterval = setInterval(() => {
		timeLeft--;
		if (timeLeft >= 0) {
			timerBox.textContent = `${currentTurn}'s turn (${timeLeft}s)`;
		} else {
			clearInterval(timerInterval);
			timerBox.textContent = "Time out!";
		}
	}, 3000);
}