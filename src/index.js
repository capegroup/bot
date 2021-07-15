/*
    capegroup - a cape service, without the controversy
    Copyright (C) 2021 capegroup

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import {Client, Intents} from "discord.js"
import fs from "fs"
import axios from "axios"
import logSymbols from "log-symbols"
import path from "path";
import Josh from "@joshdb/core";
import provider from "@joshdb/sqlite";


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

if(!fs.existsSync("config.json")) {
	console.log(logSymbols.error, "Config file not set! Copy example.config.json and set your own values.")
	process.exit(0)
}

const config = JSON.parse(fs.readFileSync("config.json").toString())

if(!fs.existsSync(path.resolve(config.server, "capes/"))) {
	console.log(logSymbols.error, "Could not find directory to store capes in! Fix your config.json")
	process.exit(0)
}

const db = new Josh({
	name: "gm_capegroup",
	provider,
	providerOptions: {
		dataDir: config.server + "/data/"
	}
})

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
					
					if(!checkPrefix(config.server, config.server + "/capes/" + args[0] + ".png")) {
						message.reply("Bruh.. Path traversal.. Really?")
						return
					}

					await download_image(attachment.url, config.server + "/capes/" + args[0] + ".png")
					
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
		} else if(command == "#cosmetic") {
			if(args.length === 2) {
				const cosmetics = fs.readdirSync(path.resolve(config.server + "/src/cosmetics/"));
				if(cosmetics.includes(args[0])) {
					const userCosmetics = await db.get(args[1]);
					
					if(userCosmetics) {
						if(userCosmetics.includes(args[0])) {
							message.reply("You already have " + args[0] + "!")
						} else {
							message.reply("Added cosmetic " + args[0] + " to " + args[1] + "! Restart your game to see it load (Only 1.15-1.16)")
							
							userCosmetics.push(args[0])

							await db.set(args[1], userCosmetics);
						}
					} else {
						await db.set(args[1], [args[0]])
					}
				} else {
					message.reply("Cosmetic " + args[0] + " does not exist! Available cosmetics: " + cosmetics.join(", "))

				}
			} else {
				message.reply("Missing argument or too many arguments.")
			}
		} else if(command == "#remove_cosmetic") {
			if(args.length === 2) {
				const cosmetics = await db.get(args[1])
				
				if(!cosmetics) {
					message.reply("You've never had cosmetics!");
					return;
				}

				if(cosmetics.includes(args[0])) {
					message.reply("Removed " + args[0] + " from " + args[1]+"!")
					let userCosmetics = await db.get(args[1]);
					userCosmetics = userCosmetics.filter(e => e !== args[0]);
					await db.set(args[1], userCosmetics)
				} else {
					message.reply("You don't have " + args[0] + "!")
				}
			} else {
				message.reply("Missing argument or too many arguments.")
			}
		} else if(command == "#cosmetics") {
			const cosmetics = fs.readdirSync(path.resolve(config.server + "/src/cosmetics/"));
			
			message.reply("Available cosmetics: " + cosmetics.join(", "))
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