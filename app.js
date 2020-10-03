import Discord from 'discord.js';
import { commands, tokens } from './commands.js';
//Intent:
//You @ the bot and provide a command
//and then the bot will repeate that command untill you @ him and say stop.

//To do:
//World corruption: 1/2 Done!
const client = new Discord.Client(); //identifies the user

client.once('ready', () => {
    //when bot is ready it states so and sets activity
    console.log('Ready for action!');
    client.user.setActivity('Unsolicited');
});

const buildArguments = (input) => {
    //Allows for full sentences to be entered for the message with quotes
    let args;
    if (input.match(/\".*\"/g)) {
        let test = input.split(/ +/);
        let extractedIndex = test.findIndex((string) => string.includes('"'));

        let extracted = input.match(/\".*\"/g)[0];
        extracted = extracted.substring(1, extracted.length - 1);

        input = input.replace(/\".*\"/g, '');
        input = input.replace(/ +/g, ' ');
        let args = input.split(/ +/);
        args.splice(extractedIndex, 0, extracted);
        return args;
    } else {
        args = input.split(/ +/);
        return args;
    }
};

client.on('message', (message) => {
    //reads in messages of the server
    let args = buildArguments(message.content);
    const command = args.shift();
    if (message.author != client.user) {
        switch (command) {
            //Spam command
            case `${tokens.PREFIX + tokens.spam}`:
                client.user.setActivity('Spamming');
                message.delete(); //Optional clears channel of any wrong doing and culpability
                commands.spam(args, message, () => client.user.setActivity('Unsolicited'));
                break;

            //DM Spam command
            case `${tokens.PREFIX + tokens.spamDM}`:
                client.user.setActivity('Spamming');
                message.delete(); //Optional clears channel of any wrong doing and culpability
                commands.spamDM(args, message, () => client.user.setActivity('Unsolicited'));
                break;

            case `${tokens.PREFIX + tokens.spambot}`:
                commands.spambot(args, message, () => {});
                break;
        }
    }
});
client.login(process.env.BOT_TOKEN);
