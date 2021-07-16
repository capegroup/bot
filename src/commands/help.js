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

import fs from 'fs';

export default {
  run: (client, message) => {
    const onlyNames = fs.readdirSync('./src/commands').map((e) => e.split('.js')[0]);

    message.reply({
      embeds: [{
        title: `There are ${onlyNames.length} commands available!`,
        description: onlyNames.join(', '),
        color: 53380,
      }],
    });
  },
};
