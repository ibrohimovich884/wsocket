import { io } from "socket.io-client"

const p = document.querySelector( "p" )
const ul = document.querySelector( "ul" )
const input = document.querySelector( "input" )

main()

function main() {

	const server = io( "http://localhost:3000" )

	server.on( "message", message => {

		if ( message.type === "NEW_MESSAGE" ) {

			const li = document.createElement( "li" )
			li.textContent = message.value

			ul.appendChild( li )
		}
		else if ( message.type === "TYPING" ) {

			p.textContent = "Typing..."
		}

		else if ( message.type === "TYPING_COMPLETED" ) {

			p.textContent = ""
		}
	} )

	//

	input.onkeyup = event => {

		if ( event.code === "Enter" ) {

			server.send( {
				type: "SEND_MESSAGE",
				value: input.value,
			} )

			input.value = ""
		}

		server.send( {
			type: "TYPING_COMPLETED",
		} )
	}

	input.onkeydown = event => {

		server.send( {
			type: "TYPING",
		} )
	}
}

// const username = prompt( "Type username:" )

// server.send( {
// 	type: "NEW_USER",
// 	username,
// } )

// server.on( "message", message => {

// 	if ( message.type === "NEW_USER" ) {

// 		console.log( `${ message.username } is online!` )
// 	}
// } )
