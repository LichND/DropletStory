const Discord = require('discord.js')
const bot = new Discord.Client()

var config = {
    prefix: '++',
    timeout: 15000,
    blacklistID: []
}

var help = new Discord.MessageEmbed()
    .setTitle('DropletStory helper')
    .setDescription('**Available command:**')
    .setThumbnail('https://i.imgur.com/JhzuH9w.png')
    .addField(config.prefix + 'h', 'Show this message')
    .addFields(
        { name: config.prefix, value: 'Increase 1 droplet', inline: true },
        { name: config.prefix + '5', value: 'Increase 5 droplet', inline: true },
        { name: config.prefix + 'set 50', value: 'Set to 50 droplet', inline: true }
    )
    .addFields(
        { name: config.prefix + 'nick abcxyz', value: 'Change nick to abcxyz', inline: true },
        { name: config.prefix + 'time 10', value: 'Set timeout auto delete chat to 10s', inline: true },
    )

/**
 * @param {string} name 
 */
function getAccuratelyName(name) {
    if (name[name.length - 1] !== '」')
        return name
    return name.substring(0, name.lastIndexOf('「'))
}

/**
 * @param {String} name 
 */
function getNumber(name) {
    if (name[name.length - 1] !== '」')
        return -1
    let ret = parseInt(name.substring(name.lastIndexOf('「') + 1, name.length - 1))
    if (ret >= 0)
        return ret
    else
        return 0
}

function changeNickname(msg, name, num) {
    if (num < 0)
        msg.member.setNickname(name).then(() => msg.react('👌')).catch(() => msg.react('❌'))
    else
        msg.member.setNickname(name + '「' + num + '」').then(() => msg.react('👌')).catch(() => msg.react('❌'))
}

bot.on('ready', () => {
    console.log('DropletStory online')
    bot.user.setActivity('Prefix: ' + config.prefix)
})

bot.on('message', msg => {
    if (msg.author.id === bot.user.id) {
        msg.delete({ timeout: config.timeout })
        return
    }
})

bot.on('message', msg => {
    if (msg.content.startsWith(config.prefix)) {
        if (config.blacklistID.includes(msg.author.id)) {
            msg.delete()
            return
        }

        let args = msg.content.substring(config.prefix.length).toLowerCase().split(" ")
        let num = getNumber(msg.member.displayName)
        let name = getAccuratelyName(msg.member.displayName)

        let check = parseInt(args[0])
        if (check > 0) {
            if (num < 0)
                num = 0
            changeNickname(msg, name, num + check)
        }
        else {
            switch (args[0]) {
                case 'ban':
                    if (msg.member.hasPermission("ADMINISTRATOR")) {
                        msg.mentions.members.forEach(e => {
                            if (config.blacklistID.includes(e.id)) {
                                config.blacklistID.push(e.id)
                            }
                        })
                        msg.react('👌')
                    }
                    break
                case 'unban':
                    if (msg.member.hasPermission("ADMINISTRATOR")) {
                        msg.mentions.members.forEach(mem => config.blacklistID = config.blacklistID.filter(ele => ele !== mem.id))
                        msg.react('👌')
                    } else
                        msg.react('❌')
                    break
                case 'clear':
                    if (msg.member.hasPermission("ADMINISTRATOR")) {
                        msg.mentions.members.forEach(e => { e.setNickname(getAccuratelyName(e.displayName)) })
                        msg.react('👌')
                    } else
                        msg.react('❌')
                    break
                case 'nick':
                    changeNickname(msg, msg.content.substring(7), num)
                case 'set':
                    if (!args[1])
                        break
                    else {
                        num = parseInt(args[1])
                        if (num >= 0)
                            changeNickname(msg, name, num)
                    }
                    break
                case 'drop':
                case 'droplet':
                case 'let':
                case '':
                    changeNickname(msg, name, num + 1)
                    break
                case 'time':
                    if (msg.member.hasPermission("ADMINISTRATOR")) {
                        msg.react('👌')
                        if (!args[1]) {
                            config.timeout = 60000
                        } else {
                            config.timeout = Number.parseInt(cases[1]) * 1000
                            if (config.timeout < 0) {
                                config.timeout = 60000
                            }
                        }
                    } else
                        msg.react('❌')
                    break
                case 'h':
                case 'help':
                case '?':
                    msg.channel.send(help)
                    break
                default:
                    msg.delete()
                    return
            }
        }
        msg.delete({ timeout: config.timeout })
    }
})

bot.login(process.env.token)