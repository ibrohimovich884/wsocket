import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"]
	}
});

// har bir game uchun alohida board
let games = {};

function checkWinner(b) {
	const winPatterns = [
		[0, 1, 2], [3, 4, 5], [6, 7, 8],
		[0, 3, 6], [1, 4, 7], [2, 5, 8],
		[0, 4, 8], [2, 4, 6]
	];
	for (let [a, b1, c] of winPatterns) {
		if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
	}
	if (b.every(cell => cell !== null)) return "draw";
	return null;
}

io.on("connection", (socket) => {
	console.log("Connected:", socket.id);

	socket.on("joinGame", ({ username, gameId }) => {
		if (!games[gameId]) {
			games[gameId] = {
				board: Array(9).fill(null),
				currentTurn: "X",
				players: {},
				usernames: {}
			};
		}

		const game = games[gameId];

		if (!game.players.X) {
			game.players.X = socket.id;
			game.usernames.X = username;
			socket.emit("playerRole", { role: "X" });
		} else if (!game.players.O) {
			game.players.O = socket.id;
			game.usernames.O = username; 
			socket.emit("playerRole", { role: "O" });
		} else {
			socket.emit("playerRole", { role: "spectator" });
		}
	});

	socket.on("makeMove", ({ index, gameId }) => {
		const game = games[gameId];
		if (!game) return;

		if (game.board[index] === null && game.players[game.currentTurn] === socket.id) {
			game.board[index] = game.currentTurn;
			const winner = checkWinner(game.board);

			if (winner) {
				io.emit("gameOver", { winner, board: game.board });
				game.board = Array(9).fill(null);
				game.currentTurn = "X";
			} else {
				game.currentTurn = game.currentTurn === "X" ? "O" : "X";
				io.emit("updateBoard", { board: game.board, currentTurn: game.currentTurn });
			}
		}
	});

	socket.on("disconnect", () => {
		console.log("Disconnected:", socket.id);
	});
});

httpServer.listen(3000, () => {
	console.log("Server running on http://localhost:3000");
});
