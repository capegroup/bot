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
import logSymbols from "log-symbols"
import fs from "fs";
import Josh from "@joshdb/core";
import provider from "@joshdb/sqlite";

import config from "../config.js"

const client = new Client({ 
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})

client.db = new Josh({
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

	if(command.startsWith(config.prefix)) {
		const onlyNames = fs.readdirSync("./src/commands").map(e => e.split(".js")[0]);

		if(onlyNames.includes(command.substring(1))) {
			const nodeCommand = await import(`./commands/${command.substring(1)}.js`);
			nodeCommand.default.run(client, message, args);
		}
	}
})

client.login(config.token)