import path from 'path';
import dotenv from 'dotenv';
import botkit from 'botkit';
import * as api from './api';
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

//
// Create a bot controller.
// Here we create the bot controller.
//

let botkitController = botkit.slackbot({debug: true});

// 
// Intergrate Beep Boop
// Here we overide the default controller with beepboops.
// 

if (env.SLACK_TOKEN) {
    
    botkitController.spawn({token: env.SLACK_TOKEN}).startRTM(function (error, bot, payload) {
        
        if (error) {
            throw new Error(error)
        }
    });

} else {

    beepboop.start(botkitController, {debug: true});
}

//
// Commands
// Here we define any commands the bot will respond to.
//

botkitController.hears('help', [event.DIRECT_MESSAGE, event.DIRECT_MENTION], (bot, message) => {

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

botkitController.hears(['latest', 'recent', 'newest'], [event.DIRECT_MESSAGE, event.DIRECT_MENTION], (bot, message) => {

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

botkitController.hears('rant ([0-9]{4,})', [event.DIRECT_MESSAGE, event.DIRECT_MENTION], (bot, message) => {

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

botkitController.hears(['search (.*)', 'find (.*)', 'get (.*)'], [event.DIRECT_MESSAGE, event.DIRECT_MENTION], (bot, message) => {

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

botkitController.hears(['surprise', 'random'], [event.DIRECT_MESSAGE, event.DIRECT_MENTION], (bot, message) => {

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

botkitController.hears('weekly', [event.DIRECT_MESSAGE, event.DIRECT_MENTION], (bot, message) => {

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

botkitController.on('create_bot', (bot, config) => {

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
