/**
 * Schema
 */
const User = require('../database/schema/user')

/**
 * Helpers
 */
const { embedConsoleError, embedError, embedStandard, embedSuccess, getAvatarUrl } = require('./helpers')

/**
 * Discord.js
 */
const { MessageEmbed } = require('discord.js')

/**
 * Fetch Invite Count
 * 
 * @description Fetch invite count based on Discord ID
 * 
 * @argument message @type Object
 * @argument discordId @type String
 * 
 * @version 1.0.0
 */
const fetchInviteCount = (message, discordId) => {
    return new Promise((resolve, reject) => {
        // Fetch guild
        const guild = message.guild

        // Fetch invites based on Discord ID
        const invites = guild.fetchInvites().then(invites => invites.find(invite => invite.inviter.id === discordId))

        // Calculate uses
        const uses = invites.uses

        // If use count
        if(uses) {
            // Return use count
            return resolve(uses)
        } else {
            // If no uses, return 0
            return resolve(0)
        }
    })
}

/**
 * Profile
 * 
 * @description Fetches a user profile
 * 
 * @version 1.0.0
 */
const profile = async (message, discordId) => {
    try {
        const user = await User.findOne({ discordId })
        const discordUser = message.guild.members.cache.get(discordId)

        if(user) {
            const embed = new MessageEmbed({
                color: '#ffa801',
                description: `${discordUser}'s Server Profile\n[CG] stands for Custom Games`,
                fields: [
                    {
                        name: 'Gold',
                        value: user.gold,
                        inline: true
                    },
                    {
                        name: 'Blue Essence',
                        value: user.blueEssence,
                        inline: true
                    },
                    {
                        name: 'Orange Essence',
                        value: user.orangeEssence,
                        inline: true
                    },
                    {
                        name: '[CG] Wins',
                        value: user.wins,
                        inline: true
                    },
                    {
                        name: '[CG] Losses',
                        value: user.losses,
                        inline: true
                    },
                    {
                        name: '[CG] Winrate',
                        value: Math.round((user.wins / user.gamesPlayed * 100) / 1) + '%',
                        inline: true
                    },
                ],
                footer: {
                    iconURL: getAvatarUrl(client.user),
                    text: client.user.username
                }
            }).setTimestamp()

            return message.channel.send(embed)
        } else {
            const embed = embedError('No user found in the database with that ID.')
            return message.channel.send(embed)
        }
    } catch(error) {
        const embed = embedConsoleError(error)
        return message.channel.send(embed)
    }
}

/**
 * Exports
 */
module.exports = {
    fetchInviteCount,
    profile
}