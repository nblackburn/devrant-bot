# Contributing

## Requirements

- Node
- A Slack account

## Conventions

- Follow [JSDoc](http://usejsdoc.org).
- 4 spaces for indentation.
- 1 space between arguments, but not parentheses.
- 1 newline at the end of the file.

```javascript
const sayHello = (firstName, lastName) => {
    return `Hello, ${firstName, lastName}`;
};
```

## Getting started

Getting started is simple, but before you get stuck in, you will need
to create a Slack account (_if you don't have one already_) which is
needed to create the application needed for your bot.

```bash
$ git clone https://github.com/nblackburn/devrant-bot devrant-bot
$ npm install
```

### Creating a Slack application

Before we can run your bot, we need to create a Slack application, visit
[here](https://api.slack.com/apps/new) to create one. 

![Creating a Slack application](http://jmp.sh/qx377jh+)

Once you have created your application, you will your applications client
id and client secret which can be found under the `App Credentials` tab.

![Locating the credentials](http://jmp.sh/e6ql84m+)

### Configuring the bot

Next you will need make your bot aware of your `client id` and `client secret`
which were generated when you created your application. To do this create a
file named `.env` in the project root with pasting in the application
credentials like so...

```ini
SLACK_CLIENT_ID = xxxxxxxxxxx.xxxxxxxxxxx
SLACK_CLIENT_SECRET = xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Running the bot

Bots become bored with no commands so yours has likely fallen asleep. To wake your
bot, run the following command...

```bash
$ npm run start
```

### Testing your bot.

Several tests have been created to ensure the bot is working as intended. To be able
to run the test suite, you will need test key which bypasses the need to authorize the
application.

To generate a test key, visit [here](https://api.slack.com/docs/oauth-test-tokens), once
generated add it to your `.env` file like so....

```ini
SLACK_TOKEN = xxxx-xxxxxxxxxxx-xxxxxxxxxxx-xxxxxxxxxxx-xxxxxxxxxx
```
