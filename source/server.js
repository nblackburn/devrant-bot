import path from 'path';
import dotenv from 'dotenv';
import botkit from 'botkit';
import * as api from './api';
import winston from 'winston';
import bugsnag from 'bugsnag';
import * as event from './events';
import * as helpers from './helpers';
import beepboop from 'beepboop-botkit';
import {version} from '../package.json';

//
// Configure environment
// Here we configure the applications environment.
//

const env = process.env;

dotenv.config({
    silent: true
});

if (env.NODE_ENV !== 'production') {

    if (!env.SLACK_CLIENT_ID || !env.SLACK_CLIENT_SECRET) {
        throw new Error('Both a client id and secret must be available in the environment.');
    }
}

//
// Configure bug tracker.
// Here we configure the bug tracker to best address any issues we might bump into.
//

if (env.BUGSNAG_API_KEY) {

    bugsnag.register(env.BUGSNAG_API_KEY, {
        appVersion: version,
        releaseStage: env.NODE_ENV,
        notifyReleaseStages: [
            'development',
            'production'
        ]
    });
}

//
// Set up logger
// Here we setup a logger instance to keep track of errors.
//

winston.add(winston.transports.File, {
    filename: `./logs/${env.NODE_ENV}.log`
});

//
// Create a bot controller.
// Here we create the bot controller.
//

let botkitController = botkit.slackbot({
    json_file_store: './store'
});

// 
// Intergrate Beep Boop
// Here we overide the default controller with beepboops.
// 

var beepboopController = beepboop.start(botkitController);

//
// Prevent duplicate connections.
// Here we ensure we don't connect to them RTM twice for the same team.
//

var _bots = {};

const trackBot = bot => {

    if (bot) {
        _bots[bot.config.token] = bot;
    }
};

//
// Setup web server
// Here we create a web server to handle authentication and web hooks.
//

beepboopController.setupWebserver(env.SERVER_PORT, (error, webserver) => {

    // Attach Bugsnag middleware.
    webserver.use(bugsnag.errorHandler);
    webserver.use(bugsnag.requestHandler);

    beepboopController.createWebhookEndpoints(webserver, (error) => {

        const message = (!error) ? 'success' : error;

        if (error) {
            bugsnag.notify(new Error(error));
        }

        response.send(message);
    });

    beepboopController.createOauthEndpoints(beepboopController.webserver, (error, request, response) => {

        const message = (!error) ? 'success' : error;

        if (error) {
            bugsnag.notify(new Error(error));
        }

        response.send(message);
    });

    webserver.get('/', (request, response) => {

        response.sendFile('index.html', {
            root: path.join(__dirname, '../', 'public')
        });
    });
});

//
// Commands
// Here we define any commands the bot will respond to.
//

beepboopController.hears('help', [event.DIRECT_MESSAGE, event.DIRECT_MENTION], (bot, message) => {

    bot.startPrivateConversation({user: message.user}, (error, conversation) => {

        if (!error) {

            conversation.say('`rant [id]` - Get a rant.');
            conversation.say('`latest` - Get the latest rant.');
            conversation.say('`search [term]` or `find [term]` - Get a rant matchimg the term.');
            conversation.say('`surprise` or `random` - Get a surprise (random) rant.');
            conversation.say('`weekly` - Get a weekly rant.');
        } else {
            bugsnag.notify(new Error(error));
        }
    });
});

beepboopController.hears(['latest', 'recent', 'newest'], [event.DIRECT_MESSAGE, event.DIRECT_MENTION], (bot, message) => {

    bot.startTyping(message);

    api.getRants('recent').then(rants => {

        const random = helpers.random(0, 10);
        const rant = rants[random];

        const response = {
            attachments: [
                helpers.formatRant(rant)
            ]
        };

        bot.reply(message, response);

    }).catch((error) => {

        bugsnag.notify(new Error(error));
        bot.reply(message, 'I was unable to get the latest rant for you, sorry :cry:.');
    });
});

beepboopController.hears('rant ([0-9]{4,})', [event.DIRECT_MESSAGE, event.DIRECT_MENTION], (bot, message) => {

    if (message.match.indexOf(1) !== -1) {
        return false;
    }

    const id = message.match[1];

    bot.startTyping(message);

    api.getRant(id).then(rant => {

        const response = {
            attachments: [
                helpers.formatRant(rant)
            ]
        };

        bot.reply(message, response);

    }).catch((error) => {

        bugsnag.notify(new Error(error));
        bot.reply(message, 'I was unable to get that rant for you, sorry :cry:.');
    });
});

beepboopController.hears(['search (.*)', 'find (.*)', 'get (.*)'], [event.DIRECT_MESSAGE, event.DIRECT_MENTION], (bot, message) => {

    if (message.match.indexOf(1) !== -1) {
        return false;
    }

    const term = message.match[1];

    bot.startTyping(message);

    api.search(term).then(results => {

        const random = helpers.random(0, 10);
        const rant = results[random];

        const response = {
            attachments: [
                helpers.formatRant(rant)
            ]
        };

        bot.reply(message, response);

    }).catch((error) => {

        bugsnag.notify(new Error(error));
        bot.reply(message, 'I had trouble finding anything, sorry :cry:.');
    });
});

beepboopController.hears(['surprise', 'random'], [event.DIRECT_MESSAGE, event.DIRECT_MENTION], (bot, message) => {

    bot.startTyping(message);

    api.getSurpriseRant().then(rant => {

        const response = {
            attachments: [
                helpers.formatRant(rant)
            ]
        };

        bot.reply(message, response);

    }).catch((error) => {

        bugsnag.notify(new Error(error));
        bot.reply(message, 'I was unable to get a surprise rant for you, sorry :cry:.');
    });
});

beepboopController.hears('weekly', [event.DIRECT_MESSAGE, event.DIRECT_MENTION], (bot, message) => {

    bot.startTyping(message);

    api.getWeeklyRants().then(results => {

        const random = helpers.random(0, 10);
        const rant = results[random];

        const response = {
            attachments: [
                helpers.formatRant(rant)
            ]
        };

        bot.reply(message, response);

    }).catch((error) => {

        bugsnag.notify(new Error(error));
        bot.reply(message, 'I had trouble getting the weekly rants, sorry :cry:.');
    });
});

//
// Events
// Here we define any events the bot responds to.
//

beepboopController.on('rtm_open', () => {
    winston.log('info', 'Connected to RTM.');
});

beepboopController.on('rtm_close', () => {
    winston.log('info', 'Disconnected to RTM.');
});

beepboopController.on('create_bot', (bot, config) => {

    if (!_bots[bot.config.token]) {

        bot.startRTM((error) => {

            if (!error) {

                trackBot(bot);

                bot.startPrivateConversation({user: config.createdBy}, (error, conversation) => {

                    if (error) {
                        bugsnag.notify(new Error(error));
                    }

                    conversation.say('Hello, i am devRant bot, thanks for allowing me to be apart of your slack channel.');
                    conversation.say('To get started, `/invite` me to a channel.');
                    conversation.say('If you are unsure of anything, type `help` for a list of commands.');
                });

            } else {
                bugsnag.notify(new Error(error));
            }
        });
    }
});

//
// Storage
// Here we will handle the storage of users, teams and channels.
//

beepboopController.storage.teams.all((error, teams) => {

    if (!error) {

        for (var team in teams) {

            if (teams.hasOwnProperty(team)) {

                beepboopController.spawn(teams[team]).startRTM((error, bot) => {

                    if (!error) {
                        trackBot(bot);
                    } else {
                        bugsnag.notify(new Error(error));
                    }
                });
            }
        }
    } else {
        bugsnag.notify(new Error(error));
    }
});
