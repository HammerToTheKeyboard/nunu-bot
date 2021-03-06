// Akairo
const { Command } = require('discord-akairo')

// Mongoose
const User = require('../../database/schema/user')

// Functions
const {
    embedConsoleError,
    embedStandard,
    getAvatarUrl
} = require('../../functions/helpers')

// Moment
const moment = require('moment')

module.exports = class InfoCommand extends Command {
    constructor() {
        super('info', {
            aliases: ['info'],
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: message => message.member
                }
            ]
        })
    }

    async exec(message, { member }) {
        try {
            const user = await User.findOne({ discordId: member.id })
            const embed = embedStandard(`🔎 Information on ${member}`)
                .addField(`Joined this server`, `${moment(member.joinedTimestamp).fromNow()} (${moment(member.joinedTimestamp).format('DD/MM/YY HH:mm')})`, true)
                .addField(`Highest Role`, member.roles.highest, true)
                .addField('Level', user.level, true)
                .addField('Joined Discord', `${moment(member.user.createdTimestamp).fromNow()}`, true)
                .addField('Tag', `${member.user.tag}`, true)
                .setThumbnail(getAvatarUrl(member.user))
            return message.channel.send(embed)
        } catch(error) {
            const embed = embedConsoleError(error)
            return message.channel.send(embed)
        }
    }
}