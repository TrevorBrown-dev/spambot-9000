let spamStack = [];
let spamDMStack = [];
//

export const tokens = {
    //Aliases for commands and the prefix
    PREFIX: '!',
    spam: 'spam',
    spamDM: 'spamdm',
    spambot: 'spambot',
};

export const commands = {
    spambot(args, message, callback) {
        //Supplies format for different commands
        message.channel.send(`
        To stop spamming run: **<command>** stop
${tokens.PREFIX + tokens.spambot} => List all commands
${tokens.PREFIX + tokens.spam} **"<message>"** *(interval)* => Spams server channel that requested it.
${tokens.PREFIX + tokens.spamDM} **<@mention>** **"<message>"** *(interval)* => Opens and spams DM channel for @mention.
        `);
    },
    spam(args, message, callback) {
        //Spams the server channel that the request was in.
        if (args[0]) {
            switch (args[0]) {
                case 'stop':
                    //Stops one spam in the stack
                    removeInterval(spamStack);
                    break;

                case 'stopall':
                    //Stops all spam in the entire stack
                    clearIntervals(spamStack);
                    break;

                default:
                    //If no variation of the stop command then the bot continues
                    const interval = args[1] && !isNaN(args[1]) ? Math.max(400, parseInt(args[1])) : 3000;
                    repeat(spamStack, interval, () => {
                        message.channel.send(args[0]);
                    });
                    break;
            }
        }
        callback();
    },

    spamDM(args, message, callback) {
        //Opens and spams the DM channel for the @mention.
        if (args[0]) {
            switch (args[0]) {
                case 'stop':
                    //Stops spamdm in the stack
                    removeInterval(spamDMStack);
                    break;

                case 'stopall':
                    //Stops all spamdm in the entire stack
                    clearIntervals(spamDMStack);
                    break;

                default:
                    //If no variation of the stop command then the bot continues
                    const interval = args[2] && !isNaN(args[2]) ? Math.max(400, parseInt(args[2])) : 3000;
                    //limits the ms interval
                    const user = message.mentions.users.first();
                    if (user && args[0].includes(user.id)) {
                        repeat(spamDMStack, interval, () => {
                            //Grabs the mention and then checks for if it is a valid person to send to
                            user.send(args[1]);
                        });
                    }
                    break;
            }
        }
        callback();
    },
};

const repeat = (stack, interval, callback) => {
    //recursive function to send out given msg
    stack.push(
        setInterval(() => {
            callback();
        }, interval)
    );
};

const removeInterval = (stack) => {
    //Removes the top item on the stack
    if (stack.length > 0) {
        clearInterval(stack.pop());
    }
};

const clearIntervals = (stack) => {
    //Removes all items on the stack
    while (stack.length > 0) removeInterval(stack);
};
