WebFontConfig = {

//  The Google Fonts we want to load (specify as many as you like in the array)
google: {
  families: ['Poiret One', 'Josefin Slab', 'Yanone Kaffeesatz']
}

};
function signIn(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        bootbox.alert("Error Code " + errorCode + "", "The error reads: \'" + errorMessage + "\' \n Because of this, multiplayer functionality is disabled. Please reload the page and try again, or try to resolve the issue.", "error");
    });
    document.getElementById("game").removeChild(document.getElementById("signIn"));
    document.getElementById("game").innerHTML += "<button id=\"begin\">Start</button>";
    document.getElementById("begin").onclick = startGame;
}
window.onload = function(){
    document.getElementById("signIn").addEventListener("click", signIn);
};
function startGame(){
    document.getElementById("game").removeChild(document.getElementById("begin"));
    var game = new Phaser.Game(window.innerWidth, window.innerHeight, "game", Phaser.AUTO);
    var introScreen = function(){};
    introScreen.prototype = {
        preload: function(){
            game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
            var graphics = game.add.graphics();
            graphics.beginFill(0xffffff);
            graphics.drawRect(0, 0, 100, 50);
            introScreen.prototype.buttonSprite = graphics.generateTexture();
            graphics.endFill();
            graphics.destroy();
            graphics = game.add.graphics();
            graphics.beginFill(0x000000);
            graphics.lineStyle(3, 0x000000, 1);
            graphics.moveTo(0, 0);
            graphics.lineTo(0, 6);
            introScreen.prototype.minuteHand = graphics.generateTexture();
            graphics.endFill();
            graphics.destroy();
            graphics = game.add.graphics();
            graphics.beginFill(0xff0000);
            graphics.lineStyle(3, 0xff0000, 1);
            graphics.moveTo(0, 0);
            graphics.lineTo(0, 5);
            introScreen.prototype.hourHand = graphics.generateTexture();
            graphics.endFill();
            graphics.destroy();
            graphics = game.add.graphics();
            graphics.beginFill(0x000000);
            graphics.drawEllipse(0, 0, 3, 3);
            introScreen.prototype.connector = graphics.generateTexture();
            graphics.endFill();
            graphics.destroy();
            graphics = game.add.graphics();
            graphics.beginFill(0xffffff);
            graphics.drawEllipse(0, 0, 8, 8);
            introScreen.prototype.clock = graphics.generateTexture();
            graphics.destroy();
        },
        create: function(){
            game.time.events.add(Phaser.Timer.SECOND, initGame);
            function initGame(){
                game.introPlayed = true;
                var skipButton = game.add.button(game.width - 50, game.height - 25, introScreen.prototype.buttonSprite, function(){
                    //If there's an interval
                    if(game.minuteInterval){
                        clearInterval(game.minuteInterval);
                        clearInterval(game.hourInterval);
                    }
                    if(game.clockTime){
                        clearTimeout(game.clockTime);
                    }
                    game.state.start('selectScreen');
                });
                skipButton.tint = 0xbbdd00;
                var skipText = game.add.text(0, 0, "Skip", {
                    font: "Yanone Kaffeesatz",
                    fill: "#ffffff",
                    align: "center",
                    fontSize: "20px"
                });
                skipButton.anchor.setTo(0.5);
                skipText.anchor.setTo(0.5);
                skipButton.addChild(skipText);
                var text = game.add.text(game.width/2, 0, "Some random guy from the Internet", {
                    font: "Poiret One",
                    fill: "#FFFFFF",
                    align: "center",
                    fontSize: game.width/20
                });
                text.anchor.setTo(0.5);
                var tween = game.add.tween(text);
                var otherText = game.add.text(game.width/2, game.height + 100, "Presents...", {
                    fill: "#ffffff",
                    font: 'Josefin Slab',
                    align: 'center',
                    fontSize: '40px'
                });
                otherText.anchor.setTo(0.5);
                var otherTween = game.add.tween(otherText);
                tween.to({y: game.height/2 }, 1000, Phaser.Easing.Elastic.Out);
                otherTween.to({y: game.height/2 + 100}, 1000, Phaser.Easing.Sinusoidal.Out);
                tween.chain(otherTween);
                var tweenFade = game.add.tween(text);
                tweenFade.to({alpha: 0}, 1000, Phaser.Easing.Linear.None);
                otherTween.chain(tweenFade);
                otherTween.onComplete.add(function(){
                    game.clockTime = window.setTimeout(function(){
                        otherText.text = "Clock Blocked";
                    }, 1500);
                });
                var biggerTween = game.add.tween(otherText);
                biggerTween.to({y: game.height/2, fontSize: game.width/20}, 2000, Phaser.Easing.Bounce.Out);
                tweenFade.chain(biggerTween);
                var buttonTween = game.add.tween(skipButton);
                buttonTween.to({x: game.width/2, y: game.height/2 + 100}, 1500, Phaser.Easing.Circular.Out);
                biggerTween.chain(buttonTween);
                biggerTween.onComplete.add(function(){
                    skipText.text = "Play";
                    var what = game.add.button(game.width/2, game.height/2 + 200, introScreen.prototype.buttonSprite, function(){
                        clearInterval(game.minuteInterval);
                        clearInterval(game.hourInterval);
                        game.state.start("aboutScreen");
                    });
                    what.anchor.setTo(0.5);
                    what.tint = 0x00aadd;
                    game.add.text(game.width/2, game.height/2 + 200, "ABOUT", {
                        fill: "#ffffff",
                        fontSize: "20px",
                        font: "Arial"
                    }).anchor.setTo(0.5);
                }, 500);
                tween.start();
                game.text = text;
            }
        },
    };
    game.state.add("intro", introScreen);
    var aboutScreen = function(){};
    aboutScreen.prototype = {
        preload: function(){
            //For Hyperlinks
            game.load.image("invisible", "./assets/Invisible.png");
            var graphics = game.add.graphics();
            graphics.beginFill(0xffffff);
            graphics.drawRect(0, 0, 100, 50);
            game.buttonSprite = graphics.generateTexture();
            graphics.destroy();
        },
        create: function(){
            //Stop updating the server list
            firebase.database().ref('servers').off('value');
            var introText = game.add.text(game.width/2, game.height/2, "This game, called (something, I don't know yet) is inspired by Corridor Digital's video", {
                fill: "#ffffff",
                fontSize: "25px",
                font: "Arial",
                align: "center"
            });
            introText.anchor.setTo(0.5, 0.5);
            var hyperlinkText = game.add.text(game.width/2, game.height/2 + 30, "Clock Blockers.", {
                fill: "#00aadd",
                fontSize: "30px",
                font: "Arial",
                align: "center"
            });
            hyperlinkText.anchor.setTo(0.5);
            var hyperlink = game.add.button(game.width/2, game.height/2 + 30, "invisible", function(){
                window.open("https://www.youtube.com/watch?v=CBawCe6du3w");
            });
            hyperlink.width = 450;
            hyperlink.height = 30;
            hyperlink.anchor.setTo(0.5);
            var finishingText = game.add.text(game.width/2, game.height/2 + 150, "So far, it's in a really early state, where all you can do is shoot another player. Hopefully there'll be more in the future. Enjoy! \n Oh, and controls: " +
            "W, S, A, and D - If you need to know what these do (and you have played video games before), \n I think you need to sit down for a moment, and have someone slap you on the upside of the head. \n Left Click - Shoot and interact with menu items (if you don't know that, then... \n wait, how did you get to this screen? There was a button, \n and you had to... I think you're the dumbest wizard in existence. Congrats.)", {
                fill: "#ffffff",
                fontSize: "25px",
                font: "Arial",
                align: "center"
            });
            finishingText.anchor.setTo(0.5);
            var b = game.add.button(0, 0, game.buttonSprite, function(){
                game.state.start("selectScreen");
            });
            b.tint = 0x00aadd;
            var t = game.add.text(50, 25, "To servers", {
                fill: "#ffffff",
                fontSize: "20px",
                font: "Arial"
            });
            t.anchor.setTo(0.5);
        }
    };
    game.state.add("aboutScreen", aboutScreen);
    //Scene for selecting servers, choosing loadouts
    var selectScreen = function(){};
    selectScreen.prototype = {
        preload: function(){
            var graphics = game.add.graphics();
            graphics.beginFill(0xffffff);
            graphics.drawRect(0, 0, 100, 50);
            game.buttonSprite = graphics.generateTexture();
            graphics.destroy();
        },
        create: function(){
            var what = game.add.button(50, game.height - 25, game.buttonSprite, function(){
                game.state.start("aboutScreen");
            });
            what.anchor.setTo(0.5);
            what.tint = 0x00aadd;
            game.add.text(50, game.height - 25, "ABOUT", {
                fill: "#ffffff",
                fontSize: "20px",
                font: "Arial"
            }).anchor.setTo(0.5);
            var ref = firebase.database().ref('servers');
            var servers = [];
            var createServer = game.add.button(game.width - 50, game.height - 25, game.buttonSprite, this.createNewServer);
            createServer.tint = 0x00bbdd;
            createServer.anchor.setTo(0.5, 0.5);
            createServer.text = game.add.text(0, 0, "Create Server", {
                fill: "#ffffff",
                fontSize: game.width/120,
                font: "Arial"
            });
            createServer.text.anchor.setTo(0.5, 0.5);
            createServer.addChild(createServer.text);
            var serverGroup = game.add.group();
            var serverMenu;
            var errMessage = game.add.text();
            ref.on('value', function(dat){
                servers = [];
                if(serverMenu){
                    serverMenu.group.destroy();
                    serverMenu.nextButton.destroy();
                    serverMenu.prevButton.destroy();
                }
                errMessage.destroy();
                serverGroup.destroy();
                serverGroup = game.add.group();
                var data = dat.val();
                for(var item in data){
                    if(!data[item].maxPlayersReached){
                        servers.push(data[item]);
                    }
                }
                servers.forEach(function(item){
                    if(item.currentPlayers > 0){
                        var button = game.add.button(0, 0, game.buttonSprite, function(){
                            selectScreen.prototype.joinServer(item.name);
                        });
                        button.tint = 0x00ccee;
                        button.anchor.setTo(0.5, 0.5);
                        button.text = game.add.text(0, 0, item.name, {
                            fill:" #ffffff",
                            fontSize: game.width/120,
                            font: "Arial"
                        });
                        button.text.anchor.setTo(0.5, 0.5);
                        button.addChild(button.text);
                        serverGroup.add(button);
                    } else {
                        if(!item.justCreated){
                            firebase.database().ref('servers/' + item.name).remove();
                        }
                    }
                });
                if(servers.length > 0){
                    serverMenu = new ScrollMenu(game.width/2, 100, 75, serverGroup);
                    serverMenu.renderSelection();
                } else {
                    errMessage.destroy();
                    errMessage = game.add.text(game.width/2, game.height/2, "Sorry, no servers were found. \n You can create one yourself in the bottom right corner.", {
                        font: "Arial",
                        fill: "#ffffff",
                        fontSize: game.width/60,
                        align: "center"
                    });
                    errMessage.anchor.setTo(0.5, 0.5);
                }
            });
        },
        createNewServer: function(){
            bootbox.prompt({
                title: "Please enter in the name of the server."
            },
                function(result){
                    if(result !== null){
                        var namePrompt = result;
                        firebase.database().ref('servers').once('value').then(function(dat){
                        if(dat.val()){
                            if(dat.val()[namePrompt]){
                                bootbox.alert("Name already taken.");
                                this.createNewServer();
                            } else {
                                firebase.database().ref('servers/' + namePrompt).set({
                                    blueTeam: {
                                        pos: {
                                            currentX: 0,
                                            currentY: 0
                                        }
                                    },
                                    redTeam: {
                                        pos: {
                                            currentX: 0,
                                            currentY: 0
                                        }
                                    },
                                    currentPlayers: 0,
                                    justCreated: true,
                                    name: namePrompt
                                });
                                bootbox.alert("Server created successfully.");
                                selectScreen.prototype.joinServer(namePrompt);
                            }
                        } else {
                            firebase.database().ref('servers').set("temp");
                            firebase.database().ref('servers/' + namePrompt).set({
                                blueTeam: {
                                    pos: {
                                        currentX: 0,
                                        currentY: 0
                                    }
                                },
                                redTeam: {
                                    pos: {
                                        currentX: 0,
                                        currentY: 0
                                    }
                                },
                                currentPlayers: 0,
                                justCreated: true,
                                name: namePrompt
                            });
                            bootbox.alert("Server created successfully.");
                            selectScreen.prototype.joinServer(namePrompt);
                        }
                    });
                    }
            });
        },
        joinServer: function(serverName){
            firebase.database().ref('servers').off('value');
            firebase.database().ref('servers/' + serverName).once('value').then(function(dat){
                var data = dat.val();
                if(data.justCreated){
                    data.justCreated = false;
                }
                data.currentPlayers += 1;
                game.playerNum = data.currentPlayers;
                firebase.database().ref('servers/' + serverName).update(data);
                game.currentServer = data;
                console.log(data);
                console.log(data.name);
                game.state.start("playScreen");
            });
            game.add.text(game.width/2, game.height/2, "LOADING...", {
                font: "Arial",
                fontSize: "40px",
                align: "center",
                fill: "#ffffff"
            }).anchor.setTo(0.5, 0.5);
        }
    };
    game.state.add("selectScreen", selectScreen);
    var playScreen = function(){};
    playScreen.prototype = {
        preload: function(){
            game.load.image('bullet', './assets/Bullet.png');
            game.load.image('pistol', './assets/Pistol.png');
            game.load.image('player', './assets/WhitePlayer.png');
        },
        create: function(){
            game.matchBegin = false;
            game.currentIteration = 0;
            var prevPlayers;
            //Make the servers stop updating in the previous scene.
            firebase.database().ref('servers').off('value');
            firebase.database().ref('servers/' + game.currentServer.name).on('value', function(dat){
                //Reset the onDisconnect, if the number of current players changes. Fixes the bug where servers aren't removed when all players leave.
                firebase.database().ref('servers/' + game.currentServer.name + "/currentPlayers").onDisconnect().cancel();
                firebase.database().ref('servers/' + game.currentServer.name + "/currentPlayers").onDisconnect().set(game.currentServer.currentPlayers - 1);
                var data = dat.val();
                game.currentServer = data;
                if(game.currentServer[game.enemyTeam].pos.bullets){
                    console.log(game.currentServer[game.enemyTeam].pos.bullets);
                    for(var i in game.currentServer[game.enemyTeam].pos.bullets) {
                        console.log(i);
                        console.log(game.currentServer[game.enemyTeam]);
                        console.log(game.currentServer[game.enemyTeam].pos.bullets[i]);
                        if(game.currentServer[game.enemyTeam].pos.bullets[i] !== undefined){
                            var bullet = game.currentServer[game.enemyTeam].pos.bullets[i];
                            var index = i;
                            firebase.database().ref('servers/' + game.currentServer.name + "/" + [game.enemyTeam] + "/pos/bullets/" + [index]).remove();
                            game.rivalWeapon.trackSprite(game.rivalPlayer);
                            game.rivalWeapon.fireAngle = bullet.rotation + 180;
                            game.rivalWeapon.fire();
                        }
                    }
                }
                if(game.currentServer.currentPlayers >= 2 && game.currentIteration === 0){
                    firebase.database().ref('servers/' + game.currentServer.name + "/currentPlayers").onDisconnect().set(game.currentServer.currentPlayers - 1);
                    game.matchBegin = true;
                    playScreen.prototype.initMatch();
                }
                console.log(prevPlayers);
                console.log(game.currentServer.currentPlayers);
                if(prevPlayers !== game.currentServer.currentPlayers){
                    firebase.database().ref('servers/' + game.currentServer.name + "/currentPlayers").onDisconnect().off();
                    firebase.database().ref('servers/' + game.currentServer.name + "/currentPlayers").onDisconnect().set(game.currentServer.currentPlayers);
                }
                prevPlayers = game.currentServer.currentPlayers;
            });
            //Make sure that the game doesn't pause when you click away (to prevent cheating):
            game.stage.disableVisibilityChange = true;
            game.team = game.playerNum - 1;
            var teams = ["blueTeam", "redTeam"];
            if(game.team > 1){
                //TODO: Replace
                bootbox.alert("Match already full. A spectator mode is coming, rest assured.");
                game.state.start("selectScreen");
            }
            game.enemyTeam = game.team === 0 ? "redTeam" : "blueTeam";
            game.team = teams[game.team];
            firebase.database().ref('servers/' + game.currentServer.name + "/currentPlayers").onDisconnect().set(game.currentServer.currentPlayers - 1);
            game.player = game.add.sprite(game.width/2, game.height/2, 'player');
            game.player.anchor.setTo(0.5, 0.5);
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.enable(game.player);
            game.player.pistol = game.add.sprite(game.player.x, game.player.y, 'pistol');
            game.player.pistol.anchor.setTo(0.5, 0.5);
            game.player.pistol.scale.setTo(-1, 1);
            game.player.weapon = game.add.weapon(9, 'bullet');
            game.player.weapon.fireRate = 500;
            game.player.weapon.bulletSpeed = 500;
            game.player.weapon.bulletAngleOffset = 180;
            game.player.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            game.playerBullets = game.add.group();
            game.players = game.add.group();
            game.players.add(game.player);
            game.bullets = [];
            game.player.weapon.onFire.add(function(bullet){
                var fireTime = new Date().getTime();
                //Get the time the bullet was fired from the start of the round:
                var newTime = fireTime - game.startTime.getTime();
                game.player.bulletsArr.push({x: bullet.x, y: bullet.y, rotation: bullet.angle, time: newTime});
                game.bullets.push({rotation: bullet.angle});
                //game.playerBullets.add(bullet); This causes issues, because the bullet is removed from the group, making you able to only fire 9 bullets. Instead, maybe just create an array?
            });
            game.keys = {};
            game.keys.W = game.input.keyboard.addKey(Phaser.KeyCode.W);
            game.keys.S = game.input.keyboard.addKey(Phaser.KeyCode.S);
            game.keys.A = game.input.keyboard.addKey(Phaser.KeyCode.A);
            game.keys.D = game.input.keyboard.addKey(Phaser.KeyCode.D);
            game.rivalPlayer = game.add.sprite(game.width/2, game.height/2, 'player');
            game.rivalPlayer.tint = 0xff0000;
            game.rivalPlayer.anchor.setTo(0.5, 0.5);
            game.rivalBulletsGroup = game.add.group();
            game.rivalWeapon = game.add.weapon(9, 'bullet');
            game.rivalWeapon.fireRate = 500;
            game.rivalWeapon.bulletSpeed = 500;
            game.rivalWeapon.bulletAngleOffset = 180;
            game.rivalWeapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            game.rivals = game.add.group();
            game.rivals.add(game.rivalPlayer);
            game.rivalWeapon.onFire.add(function(bullet){
                game.rivalBulletsGroup.add(bullet);
                bullet.tint = 0xff0000;
            });
            game.physics.enable(game.rivalPlayer, Phaser.Physics.ARCADE);
            game.directions = {
                W: 0,
                S: -180,
                A: -90,
                D: 90
            };
            game.matchText = game.add.text(game.width/2, game.height/2, "Waiting for another player to join...", {
                font: "Arial",
                fontSize: "40px",
                align: "center",
                fill: "#00ff00"
            });
            game.matchText.anchor.setTo(0.5, 0.5);
            game.blockers = [];
        },
        initMatch: function(){
            game.blockers.forEach(function(blocker){
                console.log(blocker);
                if(blocker !== null && blocker !== undefined){
                    blocker.destroy();
                }
            });
            //LIFE:
            game.player.hits = 3;
            game.player.tint = 0xffffff;
            if(game.matchText){
                game.matchText.destroy();
            }
            console.log("INITING");
            game.player.position.setTo(game.width/2, game.height/2);
            game.rivalPlayer.position.setTo(game.width/2, game.height/2);
            var blockers = [];
            for(var i = 0; i <= game.currentIteration; i++){
                if(game.currentServer[game.enemyTeam]["blocker" + i]){
                    var enemyBlocker = new ClockBlocker(game.currentServer[game.enemyTeam]["blocker" + i].pos, game.currentServer[game.enemyTeam]["blocker" + i].bulletsArray, 'player', 'bullet', 0xff0000);
                    enemyBlocker.sprite.tint = 0xff0000;
                    game.rivalBulletsGroup.add(enemyBlocker.bulletGroup);
                    game.rivals.add(enemyBlocker.sprite);
                    blockers.push(enemyBlocker);
                }
                if(game.currentServer[game.team]["blocker" + i]){
                    var blocker = new ClockBlocker(game.currentServer[game.team]["blocker" + i].pos, game.currentServer[game.team]["blocker" + i].bulletsArray, 'player', 'bullet', 0xffffff);
                    game.playerBullets.add(blocker.bulletGroup);
                    game.players.add(blocker.sprite);
                    blockers.push(blocker);
                }
            }
            game.player.currentPosArr = [];
            game.player.bulletsArr = [];
            game.startTime = new Date();
            var interval = window.setInterval(function(){
                game.player.currentPosArr.push({x: game.player.x/game.width, y: game.player.y/game.height});
            }, 60);
            window.setTimeout(function(){
                console.log("ITERATION:" + game.currentIteration);
                clearInterval(interval);
                firebase.database().ref('servers/' + game.currentServer.name + "/" + game.team + "/blocker" + game.currentIteration).set({pos: game.player.currentPosArr, bulletsArray: game.player.bulletsArr});
                if(game.currentIteration === 4){
                    bootbox.alert("GAME OVER.");
                    firebase.database().ref('servers/' + game.currentServer.name).off('value');
                    firebase.database().ref('servers/' + game.currentServer.name + "/currentPlayers").set(game.currentServer.currentPlayers - 1);
                    game.state.start("selectScreen");
                }
                game.matchBegin = false;
                var time = 3;
                var round = game.currentIteration;
                var text = game.add.text(game.width/2, game.height/2, "Round " + round + " will begin in 3...", {
                    font: "Arial",
                    fontSize: "40px",
                    fill: "#ff0000",
                    align: "center"
                });
                text.anchor.setTo(0.5, 0.5);
                var timeInterval = window.setInterval(function(){
                    time -= 1;
                    text.text = "Round " + round + " will begin in " + time + "...";
                    if(time === 0){
                        clearInterval(timeInterval);
                        text.destroy();
                        game.matchBegin = true;
                        playScreen.prototype.initMatch();
                    }
                }, 1000);
            }, 38000);
            window.setTimeout(function(){
                var time = 3;
                var timeLeftText = game.add.text(game.width/2, game.height/2, ":03", {
                    font: "Arial",
                    fontSize: "40px",
                    align: "center",
                    fill: "#ffffff"
                });
                timeLeftText.alpha = 0.25;
                timeLeftText.anchor.setTo(0.5, 0.5);
                var interval = window.setInterval(function(){
                    time -= 1;
                    timeLeftText.text = ":0" + time;
                    if(time <= 0){
                        clearInterval(interval);
                        timeLeftText.destroy();
                    }
                }, 1000);
            }, 35000);
            console.log(blockers);
            blockers.forEach(function(blocker){
                blocker.renderBlocker();
            });
            game.blockers = blockers;
            game.currentIteration += 1;
            game.player.weapon.trackSprite(game.player.pistol);
        },
        update: function(){
            if(game.matchBegin){
                game.physics.arcade.overlap(game.rivalBulletsGroup, game.players, function(bullet, player){
                    bullet.kill();
                    game.player.hits -= 1;
                    if(game.player.hits === 0){
                        //Temp death for now
                        game.player.tint = 0x0000ff;
                    }
                });
                game.physics.arcade.overlap([game.playerBullets, game.player.weapon.bullets], game.rivals, function(bullet, player){
                    bullet.kill();
                });
                game.rivalPlayer.position.setTo(game.width * game.currentServer[game.enemyTeam].pos.currentX, game.height * game.currentServer[game.enemyTeam].pos.currentY);
                game.player.pistol.position.setTo(game.player.position.x + game.player.width/2, game.player.position.y);
                game.player.pistol.rotation = game.physics.arcade.angleToPointer(game.player.pistol);
                game.player.body.velocity.setTo(game.player.body.velocity.x * .95, game.player.body.velocity.y * .95);
                if(game.player.hits > 0){
                    if (game.keys.W.isDown && game.player.body.velocity.y > -100) {
                        game.player.body.velocity.y -= 10;
                    } else if (game.keys.S.isDown && game.player.body.velocity.y < 100){
                        game.player.body.velocity.y += 10;
                    }
                    if(game.keys.A.isDown && game.player.body.velocity.x > -100){
                        game.player.body.velocity.x -= 10;
                    } else if (game.keys.D.isDown && game.player.body.velocity.x < 100){
                        game.player.body.velocity.x += 10;
                    }
                    if(game.input.mousePointer.isDown){
                        game.player.weapon.fireAngle = game.player.pistol.angle;
                        game.player.weapon.fire();
                        console.log(game.player.weapon.bullets.total);
                    }
                }
                firebase.database().ref('servers/' + game.currentServer.name + "/" + game.team + "/pos").set({
                    currentX: game.player.x/game.width,
                    currentY: game.player.y/game.height,
                    bullets: game.bullets
                });
                //Prevent it from seeming as if the enemy is constantly firing.
                game.bullets = [];
            }
        },
        render:function(){
            game.player.weapon.debug();
        }
    };
    game.state.add("playScreen", playScreen);
    game.state.start("intro");
}