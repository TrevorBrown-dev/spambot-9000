import Discord from 'discord.js';

//Intent:
//You @ the bot and provide a command
//and then the bot will repeate that command untill you @ him and say stop.
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready for action!');
    client.user.setActivity('Unsolicited');
});

let channel;
let spam;

client.on('message', (message) => {
    channel = message.channel;
    let args = message.content.split(' ');
    const user = message.mentions.users.first();
    if(user === args[0]) console.log("wroks");

    if (user && user.id === client.user.id) {
        if (args[1]) {
            switch (args[1]) {
                case 'stop':
                    clearTimeout(spam);
                    break;
                default:
                    repeat(args[1]);
                    break;
            }
        }
    }
});

// const clearTimeouts = () => {
//     const noofTimeOuts = setTimeout('');
//  (var i = 0 ; i < noofTimeOuts ; i++) clearTimeout(i);
//}
const repeat = (msg) => {
    spam = setTimeout(() => {
        channel.send(msg);
        repeat(msg);
    }, 5000);
};
client.login(process.env.BOT_TOKEN);
