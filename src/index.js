import {Client, Intents} from "discord.js"
import fs from "fs"
import axios from "axios"
import logSymbols from "log-symbols"
import path from "path";
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

if(!fs.existsSync("config.json")) {
	console.log(logSymbols.error, "Config file not set! Copy example.config.json and set your own values.")
	process.exit(0)
}

const config = JSON.parse(fs.readFileSync("config.json").toString())

if(!fs.existsSync(config.capedir)) {
	console.log(logSymbols.error, "Could not find directory to store capes in! Fix your config.json")
	process.exit(0)
}


client.on("ready", async () => {
	console.log(logSymbols.success, `Logged in as ${client.user.tag}!`)
})


client.on("messageCreate", async message => {
	const args = message.content.split(" ")
	const command = args.shift()

	if(command.startsWith("#")) {
		if(command === "#waffle") {
			message.reply("https://storcpdkenticomedia.blob.core.windows.net/media/recipemanagementsystem/media/recipe-media-files/recipes/retail/x17/2020_belgian-style-waffles_16700_760x580.jpg?ext=.jpg")
		} else if(command === "#upload") {
			if(args.length === 1) {
				if(message.attachments.size != 0) {
					const attachment = [...message.attachments.values()][0]
					
					if(!checkPrefix(config.capedir, config.capedir + args[0] + ".png")) {
						message.reply("Bruh.. Path traversal.. Really?")
						return
					}

					await download_image(attachment.url, config.capedir + args[0] + ".png")
					
					message.reply({
						embeds: [{
							"title": `Added cape to account ${args[0]}!`,
							"description": "Sucessfully added cape!",
							"color": 53380
						}],
					})

					console.log(logSymbols.info, "Added a cape to " + args[0] + "!")
				} else {
					message.reply("Add a image to your request.")
				}
			} else {
				message.reply("Missing argument or too much spaces.")
			}
		}
	}
})

const download_image = (url, image_path) =>
	axios({
		url,
		responseType: "stream",
	}).then(
		response =>
			new Promise((resolve, reject) => {
				response.data
					.pipe(fs.createWriteStream(image_path))
					.on("finish", () => resolve())
					.on("error", e => reject(e))
			}),
	)

function checkPrefix(prefix, candidate) {
	let absPrefix = path.resolve(prefix) + path.sep;
	let absCandidate = path.resolve(candidate) + path.sep;
	return absCandidate.substring(0, absPrefix.length) === absPrefix;
}

client.login(config.token)