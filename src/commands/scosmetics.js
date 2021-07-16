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
    if (args.length === 1) {
      const cosmetics = await client.db.get(args[0]);

      if (!cosmetics) {
        message.reply("You've never had cosmetics!");
        return;
      }

      message.reply({
        embeds: [{
          title: `You currently have ${cosmetics.length} cosmetic${cosmetics.length === 1 ? '' : 's'}!`,
          description: cosmetics.join(', '),
          color: 53380,
        }],
      });
    } else {
      message.reply('Missing argument or too many arguments.');
    }
  },
};
