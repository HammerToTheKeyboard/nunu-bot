// Akairo
const { Command } = require('discord-akairo')

// Mongoose
const User = require('../../database/schema/user')

// Functions
const { 
    checkPermissions,
    embedConsoleError,
    embedError,
    embedStandard,
    embedSuccess,
} = require('../../functions/helpers')

module.exports = class WarnCommand extends Command {
    constructor() {
        super('warn', {
            aliases: ['warn'],
            args: [
                {
                    id: 'member',
                    type: 'member',
                },
                {
                    id: 'warnreason',
                    type: 'string',
                }
            ]
        })
    }

    async exec(message, { member, warnreason }) {
        try {
            const permission = await checkPermissions(message, 'KICK_MEMBERS')

            if(permission) {
                if(!member && !reason) {
                    const embed = embedStandard(`❗ The warn command adds infractions to the user's profile and allows staff to keep track of a user's bad behaviour.`).addField('Command Usage', `${prefix}warn [@user] [reason]`)
                    return message.channel.send(embed)
                }
                
                const db = await User.findOne({ discordId: member.id })
                if(warnreason) {
                    const reason = message.content.split(' ').slice(2).join(' ')
                } else {
                    const reason = 'No reason provided'
                }

                const warning = {
                    guildId: message.guild.id,
                    staffId: message.author.id,
                    reason: reason,
                    date: Date.now()
                }

                await User.findOneAndUpdate({ discordId: member.id }, { $push: { infractions: warning } }, { new: true })

                const embed = embedStandard(`❗ ${member}, you have been warned!`).addFields({ name: 'Reason', value: reason, inline: true }, { name: 'Staff Member', value: message.author, inline: true })
                return message.channel.send(embed)
            }
        } catch(error) {
            const embed = embedConsoleError(error)
            return message.channel.send(embed)
        }
    }
}