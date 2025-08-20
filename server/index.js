import { createServer } from "node:http"
import { Server } from "socket.io"

const httpServer = createServer( ( req, res ) => {

	if ( req.url === "/" ) {

		res.writeHead( 200, { "Content-Type": "text/plain'" } )
		res.end( "Socket.IO server is running" )
	}
} )

const io = new Server( httpServer, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ],
	}
} )

httpServer.listen( 3_000, "0.0.0.0", () => {

	console.log( `Server listening on port :3000` )
} )

const clients = []

io.on( "connection", ( client ) => {

	clients.push( client )

	client.on( "message", message => {

		if ( message.type === "SEND_MESSAGE" ) {

			for ( const c of clients ) {

				c.send( {
					type: "NEW_MESSAGE",
					value: message.value,
				} )
			}
		}
		else if ( message.type === "TYPING" ) {

			for ( const c of clients ) {

				c.send( {
					type: "TYPING",
				} )
			}
		}
		else if ( message.type === "TYPING_COMPLETED" ) {

			for ( const c of clients ) {

				c.send( {
					type: "TYPING_COMPLETED",
				} )
			}
		}
	} )
} )
