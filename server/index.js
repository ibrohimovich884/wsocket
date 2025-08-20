import express from "express"
import cors from "cors"

const app = express()

app.use( cors() )

app.get( "/message", ( _, res ) => res.send( "Hi!" ) )

app.listen( 3000, () => console.info( 3000 ) )
