const test = require('ava');
const path = require('path');
const botkit = require('botkit');
const dotenv = require('dotenv');
const api = require('../source/api');

dotenv.config({
    silent: true,
    path: path.join(__dirname, '../', '.env')
});

const env = process.env;

if (!env.SLACK_TOKEN) {
    throw new Error('A slack test token must be available in the environment.');
}

test.cb('create a bot instance.', t => {

    const controller = botkit.slackbot({debug: false});

    controller.on('rtm_open', bot => {
        t.true(typeof bot === 'object');
    });

    controller.on('rtm_close', bot => {

        t.true(typeof bot === 'object');
        t.end();

        controller.shutdown();
    });

    controller.spawn({token: env.SLACK_TOKEN}).startRTM((error, bot) => {

        t.falsy(error);
        t.true(typeof bot === 'object');

        bot.closeRTM();
    });
});
