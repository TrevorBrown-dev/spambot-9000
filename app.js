import Discord from 'discord.js';

//Intent:
//You @ the bot and provide a command
//and then the bot will repeate that command untill you @ him and say stop.

//To do:
//Allow for time argument to be taken: Done!
//Add change in activity based on action: Done!
const client = new Discord.Client(); //identifies the user

client.once('ready', () => {
    //when bot is ready it states so
    console.log('Ready for action!');
    client.user.setActivity('Unsolicited');
});

let channel;
let spam;

client.on('message', (message) => {
    //reads in messages of the server

    channel = message.channel; //channel the read in message was sent in
    let args = message.content.split(' ');
    const user = message.mentions.users.first(); //whomever was @ mentioned is the user

    if (args[0].includes(client.user.id)) {
        client.user.setActivity('Spamming');
        //checks to make sure @spambot-9000 is the first arg
        if (user && user.id === client.user.id) { //is this obsolete now?
            //confirms spambot-9000 is the mentioned user
            if (args[1]) {
                switch (
                    args[1] //constantly cycles through the given msg until 'stop' is read in
                ){
                    case 'stop':
                        clearTimeout(spam);
                        client.user.setActivity('Unsolicited');
                        break;
                    default:
                        //Added a ternary expression that checks for a third argument,
                        //if one is passed in, it parses that argument to an integer
                        //and sends it to the repeat function
                        repeat(
                            args[1],
                            args[2] && !isNaN(args[2])
                                ? Math.max(2000, parseInt(args[2]))
                                : 3000
                        );
                        break;
                }
            }
        }
    }
});

const repeat = (msg, interval) => {
    //recursive function to send out given msg
    spam = setTimeout(() => {
        channel.send(msg);
        repeat(msg, interval);
    }, interval); //timing in ms
};
client.login(process.env.BOT_TOKEN);
