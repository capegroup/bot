import fs from "fs";

export default {
	run: (client, message, args) => {
		const onlyNames = fs.readdirSync("./src/commands").map(e => e.split(".js")[0]);

		message.reply({
			embeds: [{
				"title": `There are ${onlyNames.length} commands available!`,
				"description": onlyNames.join(", "),
				"color": 53380
			}],
		})
	}
}