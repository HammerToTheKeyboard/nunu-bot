const { Listener } = require('discord-akairo')

const { createUser } = require('../functions/database')
const { addExperience, checkXp } = require('../functions/levelling')
const { 
    embedStandard,
    getAvatarUrl,
    embedError,
    embedConsoleError
} = require('../functions/helpers')

const { MessageEmbed } = require('discord.js')

module.exports = class MessageListener extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message'
        })
    }

    exec(message) {
        // Ensure messages are not from bot
        if(message.author.bot) return

        // Add user to database
        createUser(message.author.id)
        
        // Add experience for message sent
        addExperience(message.author.id)

        // Check user XP if to level up or not
        checkXp(message.author.id, message.guild, message.channel)

        if(message.channel.id === '471841188341743616') {
            if(message.content.startsWith('http://' || 'https://')) {
                message.delete()
                
                const embed = new MessageEmbed({
                    description: `${message.author} that message contained a link! Please post in the appropriate channel!`,
                    footer: {
                        iconURL: getAvatarUrl(client.user),
                        text: client.user.username
                    }
                }).setTimestamp()

                message.channel.send(embed)
            }
        }

        // Jess approves
        if(message.author.id === '165134266659766272' && message.content === 'https://tenor.com/view/tohru-kobayashisan-chi-no-maid-dragon-dragon-maid-thumbs-up-gif-12390446') {
            const embed = embedStandard(`✅ Jess approves!`)
            return message.channel.send(embed)
        }

        // Igni memes
        if(message.author.id === '513048504487378964' && message.content === 'guys im gonna only ask once' && message.channel.name !== 'memes') {
            const embed = embedStandard(`${message.author} has spoken! Keep memes out of ${message.channel}!`)
            return message.channel.send(embed)
        }
    }
}