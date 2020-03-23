const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'Njg5MzU2MTA3Mzg2MTkxOTA0.XnhN8g.AsRDUevIijw2ecCfIgN7HKJQW6s';

const prefix = '++';

var luckymember = '';

function changeActivity() {
    if (luckymember === '')
        bot.user.setActivity('Any droplet here :(', { type: 'WATCHING' });
    else
        bot.user.setActivity('droplet of ' + luckymember, { type: 'WATCHING' });
}

function changeNickname(msg, name, num, isReac = true) {
    //console.log(name + '「' + num + '」');
    return msg.member.setNickname(name + '「' + num + '」').then(async () => {
        if (isReac)
            msg.react('👌');
        return Promise.resolve(null);
    }).catch(() => {
        msg.react('❌');
        return Promise.reject(null);
    });
}

const charEmoji = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];
async function reaction(msg, reac) {
    for (let i = 0; i < reac.length; i++) {
        try {
            await msg.react(charEmoji[reac.charCodeAt(i) - 97]);
        } catch { }
    }
}

function getAccuratelyName(name) {
    if (name[name.length - 1] !== '」')
        return name;
    return name.substring(0, name.lastIndexOf('「'));
}

function getNumber(name) {
    if (name[name.length - 1] !== '」')
        return -1;
    let ret = parseInt(name.substring(name.lastIndexOf('「') + 1, name.length - 1));
    if (ret >= 0)
        return ret;
    else
        return 0;
}

const congratulations = ['Ăn hên thôi', 'NX cho viên an ủi', 'Hoa mắt à', 'Drop thêm viên nữa kìa lo mà loot đi'];
function randomCongratulations() {
    return '' + congratulations[Math.floor(Math.random() * congratulations.length)];
}

const noobs = ['Chết này', 'Toang nhé', 'Byebye droplet', 'Nghỉ farm mà làm người'];
function randomNoob() {
    return '' + noobs[Math.floor(Math.random() * noobs.length)];
}

var stopReply = 0;
const reply = ['Bố mày đây', 'Sủa cl', 'Chú thích sao', '||Chịch|| nhau không', 'Solo daxua coi', '||Địt mẹ|| nín'];
function randomReply() {
    return '' + reply[Math.floor(Math.random() * reply.length)];
}

bot.on('ready', () => {
    console.log('Bot online');
    changeActivity();
});

var lastMsg;

var assignUserID = '265128286412210176';

bot.on('message', msg => {
    if (msg.author.id === bot.user.id)
        return;

    if (msg.content.startsWith(prefix)) {
        let args = msg.content.substring(prefix.length).toLowerCase().split(" ");
        let num = getNumber(msg.member.displayName);
        let name = getAccuratelyName(msg.member.displayName);

        let check = parseInt(args[0]);
        if (check > 0) {
            if (num < 0) {
                msg.channel.send("Mày có farm dell đâu mà đòi drop hả thằng ml").then(() => msg.channel.send("Bắt đầu farm bằng lệnh ++sf nhé"));
                return;
            }
            msg.channel.send(randomCongratulations() + ' ' + msg.author.toString());
            changeNickname(msg, name, num + check, false).catch(() => {
                msg.channel.send('Cơ mà tao không đổi nick mày được, lớn rồi tự túc đi');
            });
            luckymember = name;
            changeActivity();
            return;
        }
        else {
            switch (args[0]) {
                case 'reac':
                    msg.delete();
                    reaction(lastMsg, msg.content.substring(6));
                    break;
                case 'hashagi':
                    msg.delete().then(() => msg.channel.send('https://j.gifs.com/XLR5GW.gif')).catch();
                    break;
                case 'nick':
                    if (num < 0) {
                        break;
                    } else {
                        changeNickname(msg, msg.content.substring(7), num);
                    }
                    break;
                case 'start':
                case 'startfarming':
                case 'startfarm':
                case 'sf':
                case 'farm':
                case 'farming':
                case 'set':
                case 'setting':
                    if (!args[1]) {
                        changeNickname(msg, name, 0);
                    } else {
                        num = parseInt(args[1]);
                        if (num >= 0)
                            changeNickname(msg, name, num);
                        else
                            msg.channel.send("Set cái dell gì đấy thằng ml?");
                    }
                    break;
                case 'drop':
                case 'droplet':
                case 'let':
                case '':
                    if (num < 0) {
                        msg.channel.send("Mày có farm dell đâu mà đòi drop hả thằng ml").then(() => msg.channel.send("Bắt đầu farm bằng lệnh ++sf nhé"));
                        break;
                    }
                    msg.channel.send(randomCongratulations() + ' ' + msg.author.toString());
                    changeNickname(msg, name, num + 1, false).catch(() => {
                        msg.channel.send('Cơ mà tao không đổi nick mày được, lớn rồi tự túc đi');
                    });
                    luckymember = name;
                    changeActivity();
                    break;
                case 'sym':
                case 'symbol':
                    msg.channel.send(randomNoob());
                    break;
                case 'h':
                case 'help':
                case '?':
                    msg.channel.send('prefix: ' + prefix + '\n ++sf: start farming droplet\n ++set: set current droplet\n ++let: loot a droplet\n ++sym: drop symbol\n ++reac: give reaction (non-repeat allow and only English character)');
                    break;
                case 'ad':
                    msg.delete().then(() => msg.channel.send(msg.content.substring(prefix.length + 3))).catch(() => msg.react('❌'));
                    console.log(msg.content.substring(prefix.length + 3));
                    break;
                case 'say':
                    msg.delete();
                    console.log(msg.content.substring(prefix.length + 4));
                    break;
                default:
                    msg.channel.send('Chat cái dell gì đấy, chat **++h** ý đm');
                    break;
            }
        }
    }

    if (msg.mentions.has(bot.user)) {
        if (msg.author.bot) {
            stopReply += 1;
            console.log(stopReply);
            if (stopReply >= 3) {
                msg.channel.send('Chán chả buồn nói, dẹp nghỉ');
                stopReply = -3;
            }
            msg.channel.send(randomReply() + ` <@${msg.author.id}>`);
        } else {
            if ((msg.content.startsWith('d!say')) || (msg.content.indexOf("everyone") >= 0) || (msg.content.indexOf('here') >= 0))
                return;
            if (msg.member.hasPermission("ADMINISTRATOR")) {
                msg.channel.send(`Dạ, có chuyện gì không ạ <@${msg.author.id}> <:yeu:681419601539497997>`);
            }
            else {
                msg.channel.send(randomReply() + ` <@${msg.author.id}>`);
            }
            if (stopReply < 0) {
                stopReply += 1;
            }
        }
    }

    if ((msg.content.indexOf("everyone") < 0) && (msg.content.indexOf('here') < 0)) {
        if (msg.mentions.members.find((value) => value.id === assignUserID)) {
            if (afk !== '') {
                msg.channel.send(`Aoi nó ${afk} rồi nha <@${msg.author.id}> <:smoke:649802028993871932> ${voice}`);
                console.log(`>>> ${msg.content}`);
            }
        }
    }

    if (msg.content.toLowerCase().indexOf('aoi') >= 0)
        if (afk !== '') {
            console.log(`>>> ${msg.content}`);
            msg.channel.send(`Nói gì về thằng chủ ||mặt lồn|| ta thế, nó ${afk} rồi <:khinh:535335174427115521> ${voice}`);
        }

    lastMsg = msg;
});

bot.login(token);


const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

var afk = '';
var voice = '';

readline.on("line", (input) => {
    if (input.startsWith('!')) {
        switch (input.toLowerCase().substring(1, input.length)) {
            case 'h':
            case 'help':
                console.log('!in -> Voice-in');
                console.log('!out -> Voice-out');
                console.log('!farm -> farming');
                console.log('!afk -> Afk');
                console.log('!active -> Active');
                break;
            case 'voice':
            case 'in':
                voice = '\nCó gì vào voice nói chuyện'
                console.log('Voice-in');
                break;
            case 'out':
                voice = '';
                console.log('Voice-out');
                break;
            case 'afk':
                afk = 'afk';
                console.log('AFK-ing...');
                break;
            case 'sleep':
                afk = 'đang ngủ';
                console.log("Sleeping")
                break;
            case 'meso':
            case 'farm':
            case 'farming':
            case 'let':
            case 'droplet':
                afk = 'farm droplet';
                console.log('Farm-ing...');
                break;
            case 'osu':
                afk = 'đang chơi osu';
                console.log('OSU-ing...');
                break;
            case 'ori':
                afk = 'đang chơi ori';
                console.log('ORI-ing...');
                break;
            case 'code':
            case 'coding':
                afk = 'đang làm đồ con mẹ nó án'
                console.log('Code-ing...');
                break;
            case 'active':
                afk = '';
                voice = '';
                console.log('No more afk');
                break;
            default:
                console.log('Unknow cmd');
                break;
        }
    }
    else {
        if (!lastMsg)
            return;
        let args = input.split(' ');
        if ((args.length === 2) && ((input.length == 5) || (input.length == 4)))
            lastMsg.channel.send(`MVP chanel ${args[0]} xx:${args[1]}`);
        else
            lastMsg.channel.send(input);
    }
})