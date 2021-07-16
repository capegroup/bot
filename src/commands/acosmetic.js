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
import logSymbols from "log-symbols"

import config from "../../config.js"

export default {
	run: async (client, message, args) => {
		if(args.length === 2) {
			const cosmetics = fs.readdirSync(path.resolve(config.server + "/src/cosmetics/"));

			if(cosmetics.includes(args[0])) {
				const userCosmetics = await client.db.get(args[1]);
				
				if(userCosmetics) {
					if(userCosmetics.includes(args[0])) {
						message.reply("You already have " + args[0] + "!")
					} else {
						message.reply("Added cosmetic " + args[0] + " to " + args[1] + "! Restart your game to see it load (Only 1.15-1.16)")
						console.log(logSymbols.info, "Added " + args[0] + " to " + args[1] + "!")

						userCosmetics.push(args[0])

						await client.db.set(args[1], userCosmetics);
					}
				} else {
					await client.db.set(args[1], [args[0]])
				}
			} else {
				message.reply("Cosmetic " + args[0] + " does not exist! Available cosmetics: " + cosmetics.join(", "))

			}
		} else {
			message.reply("Missing argument or too many arguments.")
		}
	}
}