/**
 *  sparkle.js
 *  Author: sharedferret
 *  
 *  A Turntable.fm bot for the Indie/Classic Alternative 1 + Done room.
 *  Based on bot implementations by anamorphism and heatvision
 *  Uses node.js with node modules ttapi, mysql, request
 * 
 *  Run: 'node sparkle.js'
 *  
 *  Make sure parameters in config.js are set before running.
 *  Make sure a mysql server instance is running before starting the bot (if useDatabase
 *  is enabled in the config file)
 *
*/
var args = process.argv;
global.version = '[Sparkle] Version 1.0.6';

global.fs = require('fs');
global.url = require('url'); 

global.Bot;
global.bot;
global.config;
global.mysql;
global.client;
global.request;
global.parser;
global.singalong;
global.uptime = new Date();
global.commands = new Array();              //Array of command handlers
global.httpcommands = new Array();          //Array of HTTP handlers
global.events = require('./events.js');     //Event handlers

initializeModules();

//Room information
global.usersList = { };                     //A list of users in the room
global.djs = new Array();                   //A list of current DJs
global.partialdjs = new Array();            //A list of DJs who have stepped down before their
                                            //allotted # of songs

//Room enforcement variables
global.usertostep = null;                     //The userid of the DJ to step down
global.userstepped = false;            //A flag denoting if that user has stepped down
global.enforcementtimeout = new Date();//The time that the user stepped down
global.ffa = false;                    //A flag denoting if free-for-all mode is active
global.legalstepdown = true;           //A flag denoting if a user stepped up legally
global.pastdjs = new Array();          //An array of the past 4 DJs
global.waitlist = new Array();
global.moderators = new Array();

//Used for bonus awesoming
global.bonuspoints = new Array();      //An array of DJs wanting the bot to bonus
global.bonusvote = false;              //A flag denoting if the bot has bonus'd a song
global.bonusvotepoints = 0;            //The number of awesomes needed for the bot to awesome

//Current song info
global.currentsong = {
    artist: null,
    song: null,
    djname: null,
    djid: null,
    up: 0,
    down: 0,
    listeners: 0,
    snags: 0,
    id: null };
    
// Event listeners

bot.on('ready', events.readyEventHandler);

bot.on('roomChanged', events.roomChangedEventHandler);

bot.on('update_votes', events.updateVoteEventHandler);

bot.on('registered', events.registeredEventHandler);

bot.on('deregistered', events.deregisteredEventHandler);

bot.on('speak', events.speakEventHandler);

bot.on('nosong', events.noSongEventHandler);

bot.on('endsong', events.endSongEventHandler);

bot.on('newsong', events.newSongEventHandler);

bot.on('rem_dj', events.remDjEventHandler);

bot.on('add_dj', events.addDjEventHandler);

bot.on('snagged', events.snagEventHandler);

bot.on('booted_user', events.bootedUserEventHandler);

bot.on('pmmed', events.pmEventHandler); 

bot.on('update_user', events.updateUserEventHandler);

bot.on('new_moderator', events.newModeratorEventHandler);

bot.on('rem_moderator', events.removeModeratorEventHandler);

bot.on('httpRequest', events.httpRequestEventHandler);

bot.on('speak', function (data) {
   if (data.text.match(/^\/spin$/)) {
      bot.addDj();
   }
});
// This will make the bot skip the song it is playing (with a feedback)

bot.on('speak', function (data) {
   if (data.text.match(/^\/skip$/)) {
      bot.speak('But, I wanted to play that!'), bot.skip();
   }
});


// This will make the bot stop dj'ing

bot.on('speak', function (data) {
   if (data.text.match(/^\/dive$/)) {
      bot.remDj();
   }
});


// This will make the bot add every song played to it's queue

bot.on('newsong', function (data) {
	var newSong = data.room.metadata.current_song._id;
	var newSongName = songName = data.room.metadata.current_song.metadata.song;
	bot.snag(), bot.playlistAdd(newSong, -1);	
});

process.on('message', function(data) {
    if (data.deliverCommand != null) {
        bot.speak(data.deliverCommand);
    }
});

// Functions

function initializeModules () {
    //Creates the bot listener
    try {
        Bot = require('ttapi');
    } catch(e) {
        console.log(e);
        console.log('It is likely that you do not have the ttapi node module installed.'
            + '\nUse the command \'npm install ttapi\' to install.');
        process.exit(33);
    }

    //Creates the config object
    try {
        if (args[2] == '-c' && args[3] != null) {
            config = JSON.parse(fs.readFileSync(args[3], 'ascii'));
        } else {
            config = JSON.parse(fs.readFileSync('config.json', 'ascii'));
        }
    } catch(e) {
        //todo: update error handling
        console.log(e);
        console.log('Error loading config.json. Check that your config file exists and is valid JSON.');
        process.exit(33);
    }
    
    bot = new Bot(config.botinfo.auth, config.botinfo.userid, config.roomid);

    //Loads bot singalongs
    if (config.responses.sing) {
        try {
            singalong = require('./singalong.js');
        } catch (e) {
            console.log(e);
            console.log('Ensure that singalong.js is present in this directory,'
                + ' or disable the botSing flag in config.js');
            console.log('Starting bot without singalong functionality.');
            config.responses.sing = false;
        }
    }

    //Creates mysql db object
    if (config.database.usedb) {
        try {
            mysql = require('mysql');
        } catch(e) {
            console.log(e);
            console.log('It is likely that you do not have the mysql node module installed.'
                + '\nUse the command \'npm install mysql\' to install.');
            console.log('Starting bot without database functionality.');
            config.database.usedb = false;
        }

        //Connects to mysql server
        try {
            var dbhost = 'localhost';
            if (config.database.login.host != null && config.database.login.host != '') {
                dbhost = config.database.login.host;
            }
            client = mysql.createClient({user: config.database.login.user, password: config.database.login.password, database: config.database.dbname, host: dbhost});
        } catch(e) {
            console.log(e);
            console.log('Make sure that a mysql server instance is running and that the '
                + 'username and password information in config.js are correct.');
            console.log('Starting bot without database functionality.');
            config.database.usedb = false;
        }
    }

    //Initializes request module
    try {
        request = require('request');
    } catch(e) {
        console.log(e);
        console.log('It is likely that you do not have the request node module installed.'
            + '\nUse the command \'npm install request\' to install.');
        process.exit(33);
    }
    
    try {
        xml2js = require('xml2js');
        parser = new xml2js.Parser();
    } catch(e) {
        console.log(e);
        console.log('It is likely that you do not have the xml2js node module installed.'
            + '\nUse the command \'npm install xml2js\' to install.');
        process.exit(33);
    }

    //Create HTTP listeners
    if (config.http.usehttp) {
        bot.listen(config.http.port, config.http.host);
    }
    
    //Load commands
    try {
        var filenames = fs.readdirSync('./commands');
        for (i in filenames) {
            var command = require('./commands/' + filenames[i]);
            commands.push({name: command.name, handler: command.handler, hidden: command.hidden,
                enabled: command.enabled, matchStart: command.matchStart});
        }
    } catch (e) {
        //
    }
    
    //Load http commands
    try {
        var filenames = fs.readdirSync('./api');
        for (i in filenames) {
            var command = require('./api/' + filenames[i]);
            httpcommands.push({name: command.name, handler: command.handler, hidden: command.hidden,
                enabled: command.enabled});
        }
    } catch (e) {
        //
    }
}

//Sets up the database
global.setUpDatabase = function() {
    //song table
    client.query('CREATE TABLE ' + config.database.tablenames.song
        + '(id INT(11) AUTO_INCREMENT PRIMARY KEY,'
        + ' artist VARCHAR(255),'
        + ' song VARCHAR(255),'
        + ' djid VARCHAR(255),'
        + ' up INT(3),' + ' down INT(3),'
        + ' listeners INT(3),'
        + ' started DATETIME,'
        + ' snags INT(3),'
        + ' bonus INT(3))',
            
        function (error) {
            //Handle an error if it's not a table already exists error
            if(error && error.number != 1050) {
                throw (error);
            }
    });

    //chat table
    client.query('CREATE TABLE ' + config.database.tablenames.chat
        + '(id INT(11) AUTO_INCREMENT PRIMARY KEY,'
        + ' userid VARCHAR(255),'
        + ' chat VARCHAR(255),'
        + ' time DATETIME)',
        function (error) {
            //Handle an error if it's not a table already exists error
            if(error && error.number != 1050) {
                throw (error);
            }
    });
        
    //user table
    client.query('CREATE TABLE ' + config.database.tablenames.user
        + '(userid VARCHAR(255), '
        + 'username VARCHAR(255), '
        + 'lastseen DATETIME, '
        + 'PRIMARY KEY (userid, username))',
        function (error) {
            //Handle an error if it's not a table already exists error
            if(error && error.number != 1050) {
                throw (error);
            }
    });
    
    client.query('CREATE TABLE BANNED_USERS ('
        + 'id INT(11) AUTO_INCREMENT PRIMARY KEY, '
        + 'userid VARCHAR(255), '
        + 'banned_by VARCHAR(255), '
        + 'timestamp DATETIME)',
        function (error) {
            if (error && error.number != 1050) {
                throw error;
            }
    });
}

global.populateSongData = function(data) {
    currentsong.artist = data.room.metadata.current_song.metadata.artist;
    currentsong.song = data.room.metadata.current_song.metadata.song;
    currentsong.djname = data.room.metadata.current_song.djname;
    currentsong.djid = data.room.metadata.current_song.djid;
    currentsong.up = data.room.metadata.upvotes;
    currentsong.down = data.room.metadata.downvotes;
    currentsong.listeners = data.room.metadata.listeners;
    currentsong.started = data.room.metadata.current_song.starttime;
    currentsong.snags = 0;
    currentsong.id = data.room.metadata.current_song._id;
}

//Format: output({text: [required], destination: [required],
//                userid: [required for PM], format: [optional]});
global.output = function (data) {
    if (data.destination == 'speak') {
        bot.speak(data.text);
    } else if (data.destination == 'pm') {
        bot.pm(data.text, data.userid);
    } else if (data.destination == 'http') {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        if (data.format == 'json') {
            response.end(JSON.stringify(data.text));
        } else {
            response.end(data.text);
        }
    }
}

//Checks if the user id is present in the admin list. Authentication
//for admin-only privileges.
global.admincheck = function (userid) {
    return (userid === config.admin ||
        moderators.some(function(moderatorid) {
            return moderatorid === userid;
        }));
}

//TODO: Implement
global.checkAuth = function (givenKey) {
    return false;
}

global.checkAFK = function() {
    //
}

global.reptarCall = function (source) {
    var rand = Math.random();
    var response = '';
    if (rand < 0.02) {
        response = ('This is better than sex.');
    } else if (rand < 0.04) {
        response = ('What you talking about Willis?');
    } else if (rand < 0.06) {
        response = ('Snookie is the Einstein of New Jersey.');
    } else if (rand < 0.08) {
        response = ('Day-man, fighter of the night man, champion of the sun.');
    } else if (rand < 0.10) {
        response = ('Guess how many pool balls I can fit in my mouth.');
    } else if (rand < 0.12) {
        response = ('Snorting those pixie sticks burns, but damn what a rush!');
    } else if (rand < 0.14) {
        response = ('I ain\'t no hollaback girl.');
    } else if (rand < 0.16) {
        response = ('Three hour tour my ass.');
    } else if (rand < 0.18) {
        response = ('I picked a hell of a day to stop sniffing glue.');
    } else if (rand < 0.20) {
        response = ('Paps Blue Ribbon!');
    } else if (rand < 0.22) {
        response = ('It rubs the lotion on it\'s skin or else it gets the  hose again!');
    } else if (rand < 0.24) {
        response = ('Crap. My ex caught me violating the restraining order.');
    } else if (rand < 0.26) {
        response = ('The plot of Fast and Furious was too hard for me to follow.');
    } else if (rand < 0.28) {
        response = ('OMG. Front row seats. Bel Biv Devoe! Best night ever!');
    } else if (rand < 0.30) {
        response = ('I have a very sexy learning disability - sexlexia.');
    } else if (rand < 0.32) {
        response = ('Grape Ape!');
    } else if (rand < 0.34) {
        response = ('Where\'s the beef?');
    } else if (rand < 0.36) {
        response = ('HULK SMASH!');
    } else if (rand < 0.38) {
        response = ('I\'ve got the need ... the need for speed!');
    } else if (rand < 0.40) {
        response = ('Oprah says I should avoid people like you.');
    } else if (rand < 0.42) {
        response = ('This is almost as good as Dokken!');
    } else if (rand < 0.44) {
        response = ('I\'m missing Gilmore Girls for this?');
    } else if (rand < 0.46) {
        response = ('Watch it, pal. I was what got Paula Abdul killed.');
    } else if (rand < 0.48) {
        response = ('Don\'t make me go Bea Arthur on you.');
    } else if (rand < 0.50) {
        response = ('I was never able to understand The Far Side.');
    } else if (rand < 0.52) {
        response = ('Facebook is a fad. I\m sticking with MySpace.');
    } else if (rand < 0.54) {
        response = ('Best. Hot Pocket. Ever.');
    } else if (rand < 0.56) {
        response = ('... and the preacher says, \"those aren\'t buoys\'!');
    } else if (rand < 0.58) {
        response = ('I\'m betting on the Washington Generals this time. The Globetrotters are due for a loss.');
    } else if (rand < 0.60) {
        response = ('I\'m why Chuck Norris still works out. He knows one day I\'ll come back to finish him.');
    } else if (rand < 0.62) {
        response = ('Best episode of Cop Rocks ever!');
    } else if (rand < 0.64) {
        response = ('I\'d like to buy one \'art\' please.');
    } else if (rand < 0.66) {
        response = ('I spent all night rocking hard to some Journey.');
    } else if (rand < 0.68) {
        response = ('Zumangi!');
    } else if (rand < 0.70) {
        response = ('No way. Go-Bots were way better.');
    } else if (rand < 0.72) {
        response = ('VHS Tapes will make a comeback once they make better VCRs.');
    } else if (rand < 0.74) {
        response = ('Nobody expects the Spanish Inquisition!');
    } else if (rand < 0.76) {
        response = ('I think round is funny.');
    } else if (rand < 0.78) {
        response = ('That is not very Raven.');
    } else if (rand < 0.80) {
        response = ('That is so Raven.');
    } else if (rand < 0.82) {
        response = ('Call me Nighthawk.');
    } else if (rand < 0.84) {
        response = ('Michael Bay - best director ever.');
    } else if (rand < 0.86) {
        response = ('rawr!');
    } else if (rand < 0.88) {
        response = ('RAWR!');
    } else if (rand < 0.90) {
        response = ('Dokken!');
    } else if (rand < 0.92) {
        response = ('Im going footloose!');
	} else if (rand < 0.94) {
        response = ('I got a fever, and the only prescription is more cowbell!');
	} else if (rand < 0.96) {
        response = ('By the power of Grayskull!');
	} else if (rand < 0.98) {
        response = ('B-A-N-A-N-A-S!');
    } else {
        response = ('.reptar');
    }
    return response;
}

//Adds the song data to the songdata table.
//This runs on the endsong event.
global.addToDb = function (data) {
    client.query(
        'INSERT INTO ' + config.database.dbname + '.' + config.database.tablenames.song +' '
        + 'SET artist = ?,song = ?, djid = ?, up = ?, down = ?,'
        + 'listeners = ?, started = NOW(), snags = ?, bonus = ?',
        [currentsong.artist, 
        currentsong.song,  
        currentsong.djid, 
        currentsong.up, 
        currentsong.down, 
        currentsong.listeners,
        currentsong.snags,
        bonuspoints.length]);
}

global.welcomeUser = function (name, id) {    //Ignore ttdashboard bots
    if (!name.match(/^ttdashboard/)) {
        if (id == '4f5628b9a3f7515810008122') {
            bot.speak(':cat: <3 :wolf:');
        }
       else  if (id == '4ed6fdfb4fe7d01c80000392') {
            bot.speak('Ooohh, look, king of the world, as if we are impressed.');
        }
        else if (id == '4ed9d9ad4fe7d029560005d5') {
            bot.speak('Best. Pimp. Ever. It\'s ' + name);
        }
        else if (id == '4f990cceaaa5cd2af40000bc') {
            bot.speak('Holy flip-flops, its ' + name);
        }
		else if (id == '4f60bf90a3f751580501c692') {
            bot.speak('I can make so many puns with your name it\'s too easy ' + name);
        }
        else if (id == '4f7d0faeaaa5cd188300019e') {
            bot.speak('Great sienna, its ' + name);
        }
	    else if (id == '4e459c15a3f751045204a82b') {
        	bot.speak('I\'m not a lesbain, but she\'s so hot she makes me think about it ... It\'s ' + name);
        }	    
		else if (id == '4fc9bc49eb35c12b48000078') {
        	bot.speak('She\'s dead, wrapped in plastic. Help us ' + name);
        }
		else if (id == '4ed9c2074fe7d0295a000676') {
        	bot.speak('She\'s here to keep us rockin with Dokken, it\'s ' + name);
        }
		else if (id == '4faefa7c4fb0bb0ecf136032') {
        	bot.speak('The only dastardly about you is your obsession with boy bands, ' + name);
        }
		else if (id == '4e417732a3f7517bbb03b758') {
        	bot.speak('Nothing good ever came from someone named ' + name);
        }
		else if (id == '4f2b8fe9590ca265c5007944') {
        	bot.speak('If you want to know anything about Justin Beiber, ask ' + name);
        }
		else if (id == '4f4c0d2c590ca26a4400081f') {
        	bot.speak('Her name doesn\'t come from her dog, and that is all I will say about ' + name);
        }
		else if (id == '4e52760e4fe7d02a4125048e') {
        	bot.speak('Oh look another Texan, and this one isn\'t a steer, it\'s ' + name);
        }
		else if (id == '4facaa28aaa5cd57d8000114') {
        	bot.speak('The best lesbian kiss I ever had was with ' + name);
        }
		else if (id == '4f95210aaaa5cd58170004c8') {
        	bot.speak('You may hate zommbies, but you love Kenny G, ' + name);
        }
		else if (id == '4f6e8368a3f75169e6001ba9') {
        	bot.speak('The only guy left who think Milli Vanilli rocks, it\'s  ' + name);
        }
	  }
}

//Reminds a user that has just played a song to step down, and pulls them
//off stage if they do not step down.
global.enforceRoom = function () {
    setTimeout( function() {
        if(!userstepped) {
            bot.speak('@' + usersList[usertostep].name + ', please step down');
            setTimeout( function() {
                if(!userstepped) {
                    bot.remDj(usertostep);
                }
            }, 15000);
        }
    }, 15000);
}

global.reducePastDJCounts = function (djid) {
    //First, decrement last DJ count by 1. Set to remove if they need to step down
    for (i in djs) {
        if (djs[i].id == djid) {
            djs[i].remaining--;
            if (djs[i].remaining <= 0) {
                userstepped = false;
                usertostep = djid;
            }
        }
    }
    
    //Reduces past DJ counts and removes from past dj list if necessary
    if (config.enforcement.stepuprules.waittostepup) {
    
        //Decrease count in pastdjs list by 1
        if (config.enforcement.stepuprules.waittype == 'SONGS') {
            for (i in pastdjs) {
                pastdjs[i].wait--;
            }
            
            //Remove if they're done waiting
            for (i in pastdjs) {
                if (pastdjs[i].wait < 1) {
                    pastdjs.splice(i, 1);
                }
            }
        }
        else if (config.enforcement.stepuprules.waittype == 'MINUTES') {
            //tbh nothing should be here
        }
    }
}

//Adds the user to the past DJ list
global.addToPastDJList = function (userid) {
    if (config.enforcement.stepuprules.waittype == 'SONGS') {
        pastdjs.push({id: userid, wait: config.enforcement.stepuprules.length});
    }
    else if (config.enforcement.stepuprules.waittype == 'MINUTES') {
        var pushdate = new Date();
        pastdjs.push({id: userid, wait: pushdate});
        
        //I don't think this works yet, but it's how i should remove people
        var fnc = function(y) {
        setTimeout(function() {
            for (i in pastdjs) {
                if ((new Date().getTime() - pastdjs[i].wait.getTime()) > 
                    (config.enforcement.stepuprules.length * 60000)
                    && (pushdate == pastdjs[i].wait)) {
                    pastdjs.splice(i, 1);
                }
            }
        }, config.enforcement.stepuprules.length * 60000);
        }(pushdate);
    }
}

global.addToWaitlist = function (userid, name, source) {
    //Case 1: User is DJing already
    for (i in djs) {
        if (djs[i].id == userid) {
            output({text: 'You\'re currently DJing!', destination: source, userid: userid});
            return false;
        }
    }
    
    //Case 2: User is already in the waitlist
    for (i in waitlist) {
        if (waitlist[i].id == userid) {
            output({text: 'You\'re already on the list, ' + name + '.', destination: source, 
                userid: userid});
            return false;
        }
    }
    
    //Otherwise, add to waitlist
    waitlist.push({name: name, id: userid});
    output({text: 'You\'ve been added to the queue. Your position is ' + waitlist.length + '.',
        destination: source, userid: userid});
    if (waitlist.length == 1 && djs.length < 5) {
        announceNextPersonOnWaitlist();
    }
    return true;
}

global.checkStepup = function (userid, name) {
    //Get time elapsed between previous dj stepping down and this dj stepping up
    var waittime = new Date().getTime() - enforcementtimeout.getTime();
    for (i in pastdjs) {
        if (pastdjs[i].id == userid) {
            //if the user waited longer than the FFA timeout or it's a free-for-all,
            //remove from list. Else, remove dj and warn
            
            if (config.enforcement.ffarules.multiplespotffa && ffa) {
                legalstepdown = true;
            }
            else if (config.enforcement.ffarules.timerffa) {
                legalstepdown = (waittime > (config.enforcement.ffarules.timeout * 1000));
            }
            else {
                legalstepdown = false;
            }
            
            if (legalstepdown) {
                for (i in pastdjs) {
                    if (pastdjs[i].id == userid) {
                        pastdjs.splice(i, 1);
                    }
                }
            }
            else {
                bot.remDj(userid);
                
                if (config.enforcement.stepuprules.waittype == 'SONGS') {
                    bot.speak(name + ', please wait ' + pastdjs[i].wait
                        + ' more songs or '
                        + (config.enforcement.ffarules.timeout - Math.floor(waittime/1000))
                        + ' more seconds before DJing again.');
                }
                else if (config.enforcement.stepuprules.waittype == 'MINUTES') {
                    var timeremaining = (config.enforcement.stepuprules.length * 60000)
                        - (new Date().getTime() - pastdjs[i].wait.getTime());
                    
                    bot.speak(name + ', please wait ' + Math.floor(timeremaining / 60000)
                        + ' minutes and ' + Math.floor((timeremaining % 60000) / 1000)
                        + ' seconds before DJing again.');
                }
            }       
        }
    }
}

global.checkWaitlist = function (userid, name) {
    if (waitlist.length > 0) {
        //If they're not first, remove/warn
        if (waitlist[0].id == userid) {
            waitlist.shift();
            if (djs.length < 5) {
                announceNextPersonOnWaitlist();
            }
            return true;
        }
        bot.remDj(userid);
        bot.speak(name + ', you\'re not next on the waitlist. Please let '
            + waitlist[0].name + ' up.');
        legalstepdown = false;
        return false;
    }
    return true;
}

global.announceNextPersonOnWaitlist = function () {
    if (waitlist.length > 0 && djs.length < 5) {
        bot.speak('The next spot is for @' + waitlist[0].name + '! You\'ve got 30 seconds to step up!');
        output({text: 'Hey! This spot is yours, so go ahead and step up!', destination: 'pm',
            userid: waitlist[0].id});
            
        
        var waitingfor = waitlist[0].id;
        setTimeout(function() {
            //See if user has stepped up, if not, call "next" function
            if (waitlist.length > 0 && waitlist[0].id == waitingfor) {
                waitlist.shift();
                announceNextPersonOnWaitlist();
            }
        }, 30000);
    }
}

//Calculates the target number of bonus votes needed for bot to awesome
global.getTarget = function() {
    if (currentsong.listeners < 11) {
        return 3;
    } else if (currentsong.listeners < 21) {
        return 4;
    }
    return 5 + Math.floor((currentsong.listeners - 20) / 20);
}

//Calculates the target number of awesomes needed for the bot to awesome
global.getVoteTarget = function() {
    if (currentsong.listeners <= 3) {
        return 2;
    }
    //Trendline on the average number of awesomes in the 1+Done room
    return Math.ceil(Math.pow(1.1383*(currentsong.listeners - 3), 0.6176));
}

//Checks if the user can step up
//TODO: Change this to support waitlists (when I implement them)
global.canUserStep = function (name, userid) {
    //Case 1: DJ is already on the decks
    for (i in djs) {
        if (djs[i].id == userid) {
            found = true;
            return 'You\'re already up!';
        }
    }
    
    //Case 2: fastest-finger
    if (config.enforcement.ffarules.multiplespotffa && (djs.length < 4)) {
        return 'There\'s more than one spot open, so anyone can step up!';
    }
    
    //Case 3: Longer than FFA timeout
    if (config.enforcement.ffarules.timerffa && (djs.length < 5)
        && ((new Date()).getTime() - enforcementtimeout > (config.enforcement.ffarules.length * 1000))) {
        return 'It\'s been ' + config.enforcement.ffarules.length + ' seconds, so anyone can step up!';
    }
    
    //Case 4: DJ in queue
    //The bot will tell the user how much longer they must wait
    for (i in pastdjs) {
        if (pastdjs[i].id == userid) {
            if (config.enforcement.stepuprules.waittype == 'SONGS' && config.enforcement.stepuprules.waittostepup) {
                if (pastdjs[i].wait == 1) {
                    return (name + ', please wait one more song.');
                } else {
                    return (name + ', please wait another ' + pastdjs[i].wait + ' songs.');
                }
            } else if (config.enforcement.stepuprules.waittype == 'MINUTES' && config.enforcement.stepuprules.waittostepup) {
                var timeremaining = (config.enforcement.stepuprules.length * 60000)
                    - (new Date().getTime() - pastdjs[i].wait.getTime());
                
                return (name + ', please wait ' + Math.floor(timeremaining / 60000) + ' minutes and '
                    + Math.floor((timeremaining % 60000)/1000) + ' seconds.');
            }
        }
    }
    
    //Case 5: Free to step up, but no spots
    if (djs.length == 5) {
        return (name + ', you can, but there aren\'t any spots...');
    }
    
    //Default: Free to step up
    return (name + ', go ahead!');
}

//Handles chat commands
global.handleCommand = function (name, userid, text, source) {
    for (i in commands) {
        if (commands[i].matchStart && (text.indexOf(commands[i].name) == 0)) {
            commands[i].handler({name: name, userid: userid, text: text, source: source});
            break;
        } else if (commands[i].name == text) {
            commands[i].handler({name: name, userid: userid, text: text, source: source});
            break;
        }
    }
    
    //--------------------------------------
    // Matching commands (regex)
    //--------------------------------------
    
    //Shuts down bot (only the main admin can run this)
    //Disconnects from room, exits process.
    if (text.toLowerCase() == (config.botinfo.botname + ', shut down')) {
        if (userid == config.admin) {
            bot.speak('Shutting down...');
            bot.roomDeregister();
            process.exit(0);
        }
    }
    
    //Shuts down bot (only the main admin can run this)
    //Disconnects from room, exits process.
    if (text.toLowerCase() == (config.botinfo.botname + ', go away')) {
        if (userid == config.admin) {
            bot.speak('Shutting down...');
            bot.roomDeregister();
            process.exit(33);
        }
    }
    
    if (text.toLowerCase() == (config.botinfo.botname + ', come back later')) {
        if (userid == config.admin) {
            bot.speak('I\'ll be back in ten minutes!');
            bot.roomDeregister();
            process.exit(34);
        }
    }
    
    //Have the bot step up to DJ
    if (text.toLowerCase() == (config.botinfo.botname + ', step up')) {
        if (admincheck(userid)) {
            bot.addDj();
        }
    }
    
    //Have the bot jump off the decks
    if (text.toLowerCase() == (config.botinfo.botname + ', step down')) {
        if (admincheck(userid)) {
            bot.remDj(config.botinfo.userid);
        }
    }
    
    //Hug bot
    if (text.toLowerCase() == ('hugs ' + config.botinfo.botname) || text.toLowerCase() == 'hugs meow') {
        var rand = Math.random();
        var timetowait = 1600;
        if (rand < 0.4) {
            setTimeout(function() {
                output({text: 'Awww!', destination: source, userid: userid});
            }, 1500);
            timetowait += 600;
        }
        setTimeout(function() {
            var response = ('hugs ' + name);
            output({text: response, destination: source, userid: userid});
        }, timetowait);
    }
    
    //Sends a PM to the user
    if (text.toLowerCase() == (config.botinfo.botname + ', pm me')) {
        if (source == 'speak') {
            bot.pm('Hey there! Type "commands" for a list of commands.', userid);
        } else if (source == 'pm') {
            bot.pm('But... you PM\'d me that. Do you think I\'m stupid? >:T', userid);
        }
    }    
}
