const h1 = document.querySelector( "h1" )
const button = document.querySelector( "button" )

button.onclick = main

async function main() {

	const response = await fetch( "http://localhost:3000/message" )
	const message = await response.text()

	h1.textContent = message
}
