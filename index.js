const Discord = require('discord.js')

const bot = new Discord.Client()

const token = 'Njg5MzU2MTA3Mzg2MTkxOTA0.XnhRmw.lOgY1iOb4geMPt3YQpM5CBrGRVU'

const prefix = '++'

var luckymember = ''

function changeActivity() {
    if (luckymember === '')
        bot.user.setActivity('Any droplet here :(', { type: 'WATCHING' })
    else
        bot.user.setActivity('droplet of ' + luckymember, { type: 'WATCHING' })
}

function changeNickname(msg, name, num, isReac = true) {
    return msg.member.setNickname(name + '「' + num + '」').then(async () => {
        if (isReac)
            msg.react('👌')
        return Promise.resolve(null)
    }).catch(() => {
        msg.react('❌')
        return Promise.reject(null)
    })
}

const charEmoji = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿']
async function reaction(msg, reac) {
    for (let i = 0; i < reac.length; i++) {
        try {
            await msg.react(charEmoji[reac.charCodeAt(i) - 97])
        } catch { }
    }
}

function getAccuratelyName(name) {
    if (name[name.length - 1] !== '」')
        return name
    return name.substring(0, name.lastIndexOf('「'))
}

function getNumber(name) {
    if (name[name.length - 1] !== '」')
        return -1
    let ret = parseInt(name.substring(name.lastIndexOf('「') + 1, name.length - 1))
    if (ret >= 0)
        return ret
    else
        return 0
}

const congratulations = ['Ăn hên thôi', 'NX cho viên an ủi', 'Hoa mắt à', 'Drop thêm viên nữa kìa lo mà loot đi']
function randomCongratulations() {
    return '' + congratulations[Math.floor(Math.random() * congratulations.length)]
}

const noobs = ['Chết này', 'Toang nhé', 'Byebye droplet', 'Nghỉ farm mà làm người']
function randomNoob() {
    return '' + noobs[Math.floor(Math.random() * noobs.length)]
}

var stopReply = 0
const reply = ['Bố mày đây', 'Sủa cl', 'Chú thích sao', '||Chịch|| nhau không', 'Solo daxua coi', '||Địt mẹ|| nín']
function randomReply() {
    return '' + reply[Math.floor(Math.random() * reply.length)]
}

bot.on('ready', () => {
    console.log('Bot online')
    channelAssign = bot.channels.cache.get("535412785690181632")
    channelBosssing = bot.channels.cache.get("535336048809476107")
    changeActivity()
    //channelAssign.send("Hello I'm there")
})

var assignUserID = '265128286412210176' // it me

bot.on('message', msg => {
    if (msg.author.id === bot.user.id) {
        clearMsg(30)
        msgLog.push(msg)
        return
    }
})

bot.on('message', msg => {
    if (msg.content.indexOf("everyone") >= 0 || msg.content.indexOf("here") >= 0)
        return

    if (msg.content.startsWith(prefix)) {
        if (blacklistID.includes(msg.author.id))
            if (!(msg.member.hasPermission("ADMINISTRATOR") || msg.author.id == assignUserID)) {
                msg.delete()
                return
            }
        msgLog.push(msg)
        let args = msg.content.substring(prefix.length).toLowerCase().split(" ")
        let num = getNumber(msg.member.displayName)
        let name = getAccuratelyName(msg.member.displayName)

        let check = parseInt(args[0])
        if (check > 0) {
            if (num < 0) {
                msg.channel.send("Mày có farm dell đâu mà đòi drop hả thằng ml").then(() => msg.channel.send("Bắt đầu farm bằng lệnh ++sf nhé"))
                return
            }
            if (stopReply >= 0)
                msg.channel.send(randomCongratulations() + ' ' + msg.author.toString())
            else
                msg.react('👌');
            changeNickname(msg, name, num + check, false).catch(() => {
                msg.channel.send('Cơ mà tao không đổi nick mày được, lớn rồi tự túc đi')
            })
            luckymember = name
            changeActivity()
            return
        }
        else {
            switch (args[0]) {
                case 'clear':
                    if (msg.mentions.members.size > 0) {
                        msg.mentions.members.forEach(e => { e.setNickname(getAccuratelyName(e.displayName)).then(() => { msg.react('👌') }) })
                    } else {
                        clearMsg()
                        msg.react('👌')
                    }
                    break
                case 'ping':
                    if (assignID.indexOf(msg.author.id) < 0) {
                        msg.react('👌')
                        assignID.push(msg.author.id)
                        write2file(path, (assignID.length == 1 ? '' : '\n') + msg.author.id)
                    }
                    else
                        msg.react('❌')
                    break
                case 'unping':
                    msg.react('👌')
                    assignID = assignID.filter(e => e !== msg.author.id)
                    write2file(path, assignID, false)
                    break
                case 'mute':
                case 'muted':
                    if (msg.member.hasPermission("ADMINISTRATOR") || msg.author.id == assignUserID) {
                        msg.react('☹')
                        stopReply = -10000
                    }
                    else {
                        msg.reply("Chú sao đủ tuổi mà đòi bắt bố im <:khinh:535335174427115521>")
                    }
                    break
                case 'ban':
                    if (msg.member.hasPermission("ADMINISTRATOR") || msg.author.id == assignUserID) {
                        msg.mentions.members.forEach(e => blacklistID.push(e.id))
                        write2file(blacklist, blacklistID, false)
                        msg.react('👌')
                    }
                    break
                case 'unban':
                    if (msg.member.hasPermission("ADMINISTRATOR") || msg.author.id == assignUserID) {
                        msg.mentions.members.forEach(mem => blacklistID = blacklistID.filter(ele => ele !== mem.id))
                        write2file(blacklist, blacklistID, false)
                        msg.react('👌')
                    } else msg.react('❌')
                    break
                case 'unmute':
                case 'unmuted':
                    if (msg.member.hasPermission("ADMINISTRATOR") || msg.author.id == assignUserID) {
                        msg.react('😊')
                        stopReply = 0
                    }
                    break
                case 'mvp':
                    msg.delete({ timeout: 30 })
                    args = msg.content.substring(6).split(' ')
                    if ((args.length === 2) && ((msg.content.length == 5 + 6) || (msg.content.length == 4 + 6))) {
                        if (!channelAssign)
                            return
                        channelAssign.send(`MVP channel ${args[0]} xx:${args[1]}`).then(() => {
                            name = ""
                            assignID.forEach(e => name += `<@${e}>`)
                            if (name.length > 0)
                                channelAssign.send(name)
                        })
                    }
                    break
                case 'reac':
                    msg.delete()
                    reaction(lastMsg, msg.content.substring(6))
                    break
                case 'hashagi':
                    msg.delete().then(() => msg.channel.send('https://j.gifs.com/XLR5GW.gif')).catch()
                    break
                case 'nick':
                    if (num < 0)
                        break
                    else
                        changeNickname(msg, msg.content.substring(7), num)
                    break
                case 'start':
                case 'startfarming':
                case 'startfarm':
                case 'sf':
                case 'farm':
                case 'farming':
                case 'set':
                case 'setting':
                    if (!args[1]) {
                        changeNickname(msg, name, 0)
                    } else {
                        num = parseInt(args[1])
                        if (num >= 0)
                            changeNickname(msg, name, num)
                        else
                            msg.channel.send("Set cái dell gì đấy thằng ml?")
                    }
                    break
                case 'drop':
                case 'droplet':
                case 'let':
                case '':
                    if (num < 0 && stopReply >= 0) {
                        msg.channel.send("Mày có farm dell đâu mà đòi drop hả thằng ml").then(() => msg.channel.send("Bắt đầu farm bằng lệnh ++sf nhé"))
                        break
                    }
                    if (stopReply >= 0)
                        msg.channel.send(randomCongratulations() + ' ' + msg.author.toString())
                    else
                        msg.react('👌');
                    changeNickname(msg, name, num + 1, false).catch(() => {
                        if (stopReply >= 0)
                            msg.channel.send('Cơ mà tao không đổi nick mày được, lớn rồi tự túc đi')
                    })
                    luckymember = name
                    changeActivity()
                    break
                case 'sym':
                case 'symbol':
                    if (stopReply >= 0)
                        msg.channel.send(randomNoob())
                    break
                case 'h':
                case 'help':
                case '?':
                    msg.channel.send(`prefix: ${prefix}\n👉 **__MVP function__**\n ++mvp <channel> <time>\n ++ping: get MVP ping\n ++unping: no more get ping\n👉 **__Farming function__**\n ++sf: start farming droplet\n ++set: set current droplet\n ++let: loot a droplet\n ++sym: drop symbol\n👉 **__funny stuff__**\n ++reac: give reaction (non-repeat allow and only English character)\n👉 **__Black zone__**:\n ++clear Delete bot chat log\c ++mute: shut the ||fuck|| me up\n ++unmute: close door and release ||fucking|| dog`)
                    break
                case 'ad':
                    msg.delete().then(() => msg.channel.send(msg.content.substring(prefix.length + 3))).catch(() => msg.react('❌'))
                    console.log(msg.content.substring(prefix.length + 3))
                    break
                case 'say':
                    msg.delete()
                    console.log(msg.content.substring(prefix.length + 4))
                    break
                default:
                    msg.channel.send('Chat cái dell gì đấy, chat **++h** ý đm')
                    break
            }
        }
    }

    if (!msg.author.bot)
        lastMsg = msg
})

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

var afk = ''
var voice = ''
/**
 * @type {Discord.TextChannel}
 */
var channelAssign
/**
 * @type {Discord.TextChannel}
 */
var channelBosssing
/**
 * @type {Discord.Message[]}
 */
var msgLog = []

async function clearMsg(length = 0) {
    return new Promise((resolve) => {
        while (msgLog.length > length)
            msgLog.shift().delete().catch(e => { })
        resolve()
    })
}

readline.on("line", (input) => {
    if (input.startsWith('!')) {
        switch (input.toLowerCase().substring(1, input.length)) {
            case 'h':
            case 'help':
                console.log('!in -> Voice-in')
                console.log('!out -> Voice-out')
                console.log('!farm -> farming')
                console.log('!afk -> Afk')
                console.log('!active -> Active')
                console.log('!cls -> Delete last message')
                console.log('!bye -> Go off')
                break
            case 'voice':
            case 'in':
                voice = '\nCó gì vào voice nói chuyện'
                console.log('Voice-in')
                break
            case 'out':
                voice = ''
                console.log('Voice-out')
                break
            case 'afk':
                afk = 'afk'
                console.log('AFK-ing...')
                break
            case 'sleep':
                afk = 'đang ngủ'
                console.log("Sleeping")
                break
            case 'meso':
            case 'farm':
            case 'farming':
            case 'let':
            case 'droplet':
                afk = 'farm droplet'
                console.log('Farm-ing...')
                break
            case 'osu':
                afk = 'đang chơi osu'
                console.log('OSU-ing...')
                break
            case 'ori':
                afk = 'đang chơi ori'
                console.log('ORI-ing...')
                break
            case 'code':
            case 'coding':
                afk = 'đang làm đồ con mẹ nó án'
                console.log('Code-ing...')
                break
            case 'active':
                afk = ''
                voice = ''
                console.log('No more afk')
                break
            case 'mute':
                stopReply = -10000
                break
            case 'delete':
            case 'del':
                if (msgLog.length > 0)
                    msgLog.pop().delete().then(() => console.log("Deleted last message"))
                break
            case 'clear':
                clearMsg().then(() => console.log("Done!"))
                break
            case 'bye':
                clearMsg().then(() => {
                    channelAssign.send(`sleep time, see ya`)
                    console.log("Done!")
                })
                break
            default:
                console.log('Unknow cmd')
                break
        }
    }
    else {
        if (!channelAssign)
            return
        let args = input.split(' ')
        if ((args.length === 2) && ((input.length == 5) || (input.length == 4)))
            channelAssign.send(`MVP channel ${args[0]} xx:${args[1]}`).then(() => {
                name = ""
                assignID.forEach(e => name += `<@${e}>`)
                if (name.length > 0)
                    channelAssign.send(name)
            })
        else
            channelAssign.send(input)
    }
})

/**
 * @type {string[]}
 */
var assignID = []
var allowID = []
var blacklistID = []
var fs = require('fs')
const path = 'user.id'
const blacklist = "black.list"

function getArrayString(a) {
    if (a.length == 0)
        return '';
    ret = a[0];
    for (let i = 1; i < a.length; i++)
        ret += `\n${a[i]}`;
    return ret
}

/**
 * @param {string} path  
 */
function write2file(path, a, isAppend = true) {
    let raw
    if (a instanceof Array)
        raw = getArrayString(a)
    else if (a instanceof String || typeof a === 'string')
        raw = a;
    else raw = JSON.stringify(a)

    if (isAppend)
        fs.appendFile(path, raw, e => {
            if (e)
                throw err
        })
    else
        fs.writeFile(path, raw, e => {
            if (e)
                throw e
        })
}

async function readfile(path, lineByLine = true) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, function (err, data) {
            if (err)
                reject(err)
            else {
                if (lineByLine)
                    resolve(data.toString().split('\n'))
                else
                    resolve(data.toString())
            }
        });
    })
}

readfile(path).then(v => {
    assignID = v.filter(e => e !== "")
    console.log(`Loaded user assign`)
}).catch(e => console.log(`${path} not found`))

readfile("allow.id").then(v => {
    allowID = v.filter(e => e !== "")
    console.log(`Loaded user ping boss`)
}).catch(e => console.log(`allow.id not found`))

readfile(blacklist).then(v => {
    blacklistID = v.filter(e => e !== "")
    console.log(`Loaded ban user`)
}).catch(e => console.log(`${blacklist} not found`))

bot.login(token)