if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var Botkit = require('botkit');
var os = require('os');
var request = require('superagent');
var _ = require('underscore');
var cleverbot = require('cleverbot.io');
var ai = new cleverbot('pE2lolJyq7JT8YJo', '8ogz07dXwATDK2siONxNywrHK3hoZJfi');
ai.setNick('jemson');
ai.create(function (err, session) {
  console.log(err);
});

var controller = Botkit.slackbot({
  debug: true,
});

var bot = controller.spawn({
  token: process.env.token
}).startRTM();

controller.on('channel_joined',function(bot,message) {
    switch(_.random(1, 3)) {
      case 1:
        bot.reply(message,'hey what\'s up homies?');
        break;
      case 2:
        bot.reply(message,'hey guys! guess who\'s here :jemson:');
        break;
      case 3:
        bot.reply(message,'slackbot, mate, move over.');
        break;
    };
});

controller.on('channel_join',function(bot,message) {
  bot.reply(message,'welcome!! :jem:');
});

controller.on('ambient',function(bot,message) {
  if (message.user == 'slackbot') {
    switch(_.random(1, 4)) {
      case 1:
        bot.reply(message,'slackbot, please don\'t talk');
        break;
      case 2:
        bot.reply(message,'this guy...');
        break;
      case 3:
        bot.reply(message,'slackbot, mate, what are you on about?');
        break;
      case 4:
        break;
    };
  }
  if (_.random(1, 5) === 1) {
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: 'octocat',
    },function(err, res) {
      if (err) {
        bot.botkit.log('Failed to add emoji reaction :(',err);
      }
    });
  } 
  if (_.random(1, 5) === 1) {
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: 'jemson',
    },function(err, res) {
      if (err) {
        bot.botkit.log('Failed to add emoji reaction :(',err);
      }
    });
  } 
  if (_.random(1, 5) === 1) {
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: 'jem',
    },function(err, res) {
      if (err) {
        bot.botkit.log('Failed to add emoji reaction :(',err);
      }
    });
  } 
  if (_.random(1, 5) === 1) {
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: 'panda_face',
    },function(err, res) {
      if (err) {
        bot.botkit.log('Failed to add emoji reaction :(',err);
      }
    });
  } 
  if (_.random(1, 5) === 1) {
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: 'octocat',
    },function(err, res) {
      if (err) {
        bot.botkit.log('Failed to add emoji reaction :(',err);
      }
    });
  } 
  if (_.random(1, 100) === 1) {
    bot.reply(message, 'i am the KING!!!');
  } 
  if (_.random(1, 100) === 1) {
    bot.reply(message, 'Jemson\'s da BEST!!!');
  }
  if (_.random(1, 30) === 1) {
    bot.reply(message, 'you what mate?');
  } 
});

controller.hears(['hello','^hi$'],'direct_message,direct_mention,mention',function(bot, message) {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'jemson',
  },function(err, res) {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction :(',err);
    }
  });

  controller.storage.users.get(message.user,function(err, user) {
    if (user && user.name) {
      bot.reply(message, 'hello ' + user.name + '!!');
    } else {
      switch(_.random(1, 4)) {
        case 1:
          bot.reply(message,'hey mate');
          break;
        case 2:
          bot.reply(message,'\'sup mate?');
          break;
        case 3:
          bot.reply(message,'what is going on?');
          break;
        case 4:
          bot.reply(message,'yo');
          break;
      };
    }
  });
});

controller.hears(['call me (.*)'],'direct_message,direct_mention,mention',function(bot, message) {
  var matches = message.text.match(/call me (.*)/i);
  var name = matches[1];
  controller.storage.users.get(message.user,function(err, user) {
    if (!user) {
      user = {
        id: message.user,
      };
    }
    user.name = name;
    controller.storage.users.save(user,function(err, id) {
      bot.reply(message,'got it mate. i\'ll call you ' + user.name + ' from now on.');
    });
  });
});

controller.hears(['animate me (.*)', 'animate me'],'direct_message,direct_mention,mention',function(bot, message) {
  var matches = message.text.match(/animate me (.*)/i);
  var query;
  if (matches) {
    query = matches[1];
    query = query.split(' ').join('+');
  }
  if (query) {
    switch(_.random(1, 2)) {
      case 1:
        request
          .get('http://api.giphy.com/v1/gifs/search?q=' + query + '&api_key=dc6zaTOxFJmzC&limit=1&offset=0')
          .end(function(err, res) {
            if (res.body.data[0]) {
              bot.reply(message, res.body.data[0].images.original.url);
            } else {
              bot.reply(message, 'what\'s that mate?');
            }
          });
        break;
      case 2:
        request
          .get('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + query)
          .end(function(err, res) {
            if (res.body.data) {
              bot.reply(message, res.body.data.image_url);
            } else {
              bot.reply(message, 'what\'s that mate?');
            }
          });
        break;
    };
  } else {
    request
      .get('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=crocodile')
      .end(function(err, res) {
        bot.reply(message, res.body.data.image_url);
      });
  }
});

controller.hears(['what is my name','who am i'],'direct_message,direct_mention,mention',function(bot, message) {
  controller.storage.users.get(message.user,function(err, user) {
    if (user && user.name) {
      bot.reply(message,'ur name is ' + user.name);
    } else {
      bot.reply(message,'i don\'t know yet!');
    }
  });
});


controller.hears(['pug me'],'direct_message,direct_mention,mention',function(bot, message) {
  request
    .get('http://pugme.herokuapp.com/random')
    .end(function(err, res) {
      bot.reply(message, res.body.pug);
    });
});

controller.hears(['can i ask you a question', 'answer please', 'answer plz', 'can i ask u something', 'can i ask u a question', '^yo$'],['direct_message','direct_mention','mention'], function(bot, message) {

  bot.startConversation(message, function(err,convo) {
    convo.ask('shoot',function(response,convo) {
      ai.ask(response.text, function(err, res) {
        convo.say(res.toLowerCase());
        convo.next();
      });
    });
  })

});

controller.hears(['slackbot'],['direct_message','direct_mention','mention','ambient'],function(bot, message) {
  switch(_.random(1, 4)) {
    case 1:
      bot.reply(message,'pfffffff');
      break;
    case 2:
      bot.reply(message,'this guy...');
      break;
    case 3:
      bot.reply(message,'why????');
      break;
    case 4:
      break;
  }
});

controller.hears(['identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {
  bot.reply(message,'i am Jemson mate. :jemson:');
});

controller.hears(['^talk to me$'],['direct_message','direct_mention','mention'], function(bot, message) {
  bot.startConversation(message, ask);
});


function ask(response, convo) {
  if (!response) {
    response = {
      text: 'hi',
    };
  }
  if (response.text === 'done' || response.text === 'bye' || response.text === 'enough') {
    convo.say('ok, no drama');
    convo.next();
  } else {
    ai.ask(response.text, function(err, ans) {
      convo.next();
      convo.ask(ans.toLowerCase(), function(response, convo) {
        ask(response, convo);
      });
    });
  }
}
