import { io } from "socket.io-client"

const username = prompt( "Type username:" )

const server = io( "http://localhost:3000" )

server.send( {
	type: "NEW_USER",
	username,
} )

server.on( "message", message => {

	if ( message.type === "NEW_USER" ) {

		console.log( `${ message.username } is online!` )
	}
} )
