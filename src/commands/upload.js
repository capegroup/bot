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

import fs from "fs";
import path from "path";
import axios from "axios";
import logSymbols from "log-symbols"

import config from "../../config.js"

export default {
	run: async (client, message, args) => {
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
	}
}

function checkPrefix(prefix, candidate) {
	let absPrefix = path.resolve(prefix) + path.sep;
	let absCandidate = path.resolve(candidate) + path.sep;
	return absCandidate.substring(0, absPrefix.length) === absPrefix;
}

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