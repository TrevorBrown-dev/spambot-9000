let spamStack = [];
let spamDMStack = [];

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
        if (args[0]) {
            switch (args[0]) {
                case 'stop':
                    removeInterval(spamStack);
                    break;

                case 'stopall':
                    clearIntervals(spamStack);

                    break;
                default:
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
        if (args[0]) {
            switch (args[0]) {
                case 'stop':
                    removeInterval(spamDMStack);
                    break;

                case 'stopall':
                    clearIntervals(spamDMStack);
                    break;

                default:
                    const interval = args[2] && !isNaN(args[2]) ? Math.max(400, parseInt(args[2])) : 3000;
                    const user = message.mentions.users.first();
                    if (user && args[0].includes(user.id)) {
                        repeat(spamDMStack, interval, () => {
                            //args[0] has the user id
                            user.send(args[1]);
                        });
                    }
                    break;
            }
        }
        callback();
    },

    test(args, message, callback) {
        console.log(message);
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
    if (stack.length > 0) {
        clearInterval(stack.pop());
    }
};

const clearIntervals = (stack) => {
    while (stack.length > 0) removeInterval(stack);
};
