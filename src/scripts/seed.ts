import { authClient } from "@/auth-client";
import { faker } from "@faker-js/faker";
import {  readdirSync, readFileSync } from "fs";
import path from "path";
const baseUrl = "http://localhost:3000"
const catDir = path.resolve(__dirname, "cats")



function randomCatImage() {
    const catImages = readdirSync(catDir)

    const randomCatFile = catImages[Math.floor(Math.random() * catImages.length)]
	const fullPath = path.join(catDir, randomCatFile);
	const buffer = readFileSync(fullPath);
    
    return {buffer, name: randomCatFile}

}

async function seed(userNum: number = 1, postPerUser: number = 1) {

    let users: any[] = []

    for (let i = 0; i < userNum; i++) {
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const email = faker.internet.email({firstName})
        const password = "password"
        

        await authClient.signUp.email({
            email,
            password,
            name: `${firstName} ${lastName}`
        }).then((e) => {
            users.push(e)
        })
    }

    for (let user of users) {

        const formdata = new FormData

        const {buffer} = randomCatImage()

        const blob = new Blob([new Uint8Array(buffer)])

		formdata.append('image', blob);
		formdata.append('username', faker.internet.username());

        const response = await fetch(`${baseUrl}/api/profileInit`, {
            method: "POST",
            body: formdata,
            credentials: "include",
            headers: {
                
                'Cookie': `better-auth.session_token=${user.session_token}`
            }
        })

        const body = response.status

        console.log(response)
    }
}

seed(1)