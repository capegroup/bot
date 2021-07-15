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

export default {
	run: async (client, message, args) => {
		if(args.length === 2) {
			const cosmetics = await client.db.get(args[1])
			
			if(!cosmetics) {
				message.reply("You've never had cosmetics!");
				return;
			}

			if(cosmetics.includes(args[0])) {
				message.reply("Removed " + args[0] + " from " + args[1]+"!")
				
				let userCosmetics = await client.db.get(args[1]);
				userCosmetics = userCosmetics.filter(e => e !== args[0]);
				
				await client.db.set(args[1], userCosmetics)
			} else {
				message.reply("You don't have " + args[0] + "!")
			}
		} else {
			message.reply("Missing argument or too many arguments.")
		}
	}
}