import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// HTML elementlar
const rooms = document.querySelectorAll(".rooms");
const form = document.getElementById("register-form");
const usernameInput = document.getElementById("username");
const gameIdInput = document.getElementById("gameId");

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

// Har bir katakka click
rooms.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (role && role !== "spectator") {
      socket.emit("makeMove", { index, gameId });
    }
  });
});

// Board yangilanishi
socket.on("updateBoard", ({ board }) => {
  rooms.forEach((cell, i) => {
    cell.textContent = board[i] || "";
  });
});

// O‘yin tugasa
socket.on("gameOver", ({ winner }) => {
  if (winner === "draw") {
    alert("Draw 🤝");
  } else {
    alert(`Winner: ${winner} 🏆`);
  }
});

// const p = document.querySelector("p")
// const ul = document.querySelector("ul")
// const input = document.querySelector("input")

// main()

// function main() {

// 	const server = io("http://localhost:3000")

// 	server.on("message", message => {
// 		if (message.type === "NEW_MESSAGE") {
// 			const li = document.createElement("li")
// 			li.textContent = message.value

// 			// agar xabar bizniki bo‘lsa
// 			if (message.isMe) {
// 				li.classList.add("my-message")
// 			} else {
// 				li.classList.add("other-message")
// 			}

// 			ul.appendChild(li)
// 		}
// 		else if (message.type === "TYPING") {
// 			p.textContent = "Typing..."
// 		}
// 		else if (message.type === "TYPING_COMPLETED") {
// 			p.textContent = ""
// 		}
// 	})


// 	//
// 	let typingTimeout;

// 	input.onkeydown = event => {
// 		// Har safar yozishda typing yuboriladi
// 		server.send({
// 			type: "TYPING",
// 		});

// 		// Oldingi timeoutni tozalaymiz (agar bor bo‘lsa)
// 		clearTimeout(typingTimeout);

// 		// 1 soniyadan keyin avtomatik completed yuboriladi
// 		typingTimeout = setTimeout(() => {
// 			server.send({
// 				type: "TYPING_COMPLETED",
// 			});
// 		}, 1000);
// 	};

// 	input.onkeyup = event => {
// 		if (event.code === "Enter") {
// 			server.send({
// 				type: "SEND_MESSAGE",
// 				value: input.value,
// 			});

// 			input.value = "";

// 			// Enter bosilganda ham typing tugagan bo‘lsin
// 			clearTimeout(typingTimeout);
// 			server.send({
// 				type: "TYPING_COMPLETED",
// 			});
// 		}
// 	};

// }

// // const username = prompt( "Type username:" )

// // server.send( {
// // 	type: "NEW_USER",
// // 	username,
// // } )

// // server.on( "message", message => {

// // 	if ( message.type === "NEW_USER" ) {

// // 		console.log( `${ message.username } is online!` )
// // 	}
// // } )
