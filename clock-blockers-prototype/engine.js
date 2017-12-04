var ClockBlocker = function(positionArray, bulletsArray, sprite, bulletSprite, tint){
    this.posArr = positionArray;
    this.posArrIndex = 0;
    this.sprite = game.add.sprite(game.width/2, game.height/2, sprite);
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.visible = false;
    this.sprite.tint = tint;
    this.bulletGroup = game.add.group();
    this.bulletsArray = bulletsArray;
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    var self = this;
    this.renderBlocker = function(){
        self.sprite.visible = true;
        self.blockerBulletWeapon.trackSprite(self.sprite);
        self.blockerBulletWeapon.onFire.add(function(bullet){
            bullet.tint = self.sprite.tint;
            self.bulletGroup.add(bullet);
        });
        if(self.bulletsArray !== undefined){
            self.bulletsArray.forEach(function(bullet){
                game.bullets.push(bullet);
                window.setTimeout(function(){
                    self.blockerBulletWeapon.fireAngle = bullet.rotation + 180;
                    self.blockerBulletWeapon.fire();
                }, bullet.time);
            });
        }
        self.interval = window.setInterval(function(){
            self.posArrIndex += 1;
            var tween = game.add.tween(self.sprite);
            tween.to({x: self.posArr[self.posArrIndex].x * game.width, y: self.posArr[self.posArrIndex].y  * game.height}, 60, Phaser.Easing.Linear.None);
            tween.start();
            if(self.posArrIndex === self.posArr.length - 1){
                clearInterval(self.interval);
            }
        }, 60);
    }
    this.blockerBulletWeapon = game.add.weapon(9, bulletSprite);
    this.blockerBulletWeapon.fireRate = 500;
    this.blockerBulletWeapon.bulletSpeed = 500;
    this.blockerBulletWeapon.bulletAngleOffset = 180;
    this.blockerBulletWeapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.destroy = function(){
        self.sprite.destroy();
        self.blockerBulletWeapon.destroy();
        self.bulletsGroup.destroy();
        delete self.posArr;
        delete self.posArrIndex;
        delete self.bulletsArray;
    };
};

var ScrollMenu = function(startX, startY, itemHeight, itemsGroup){
    var self = this;
    this.renderSelection = function(){
        var currentY = self.startY;
        var startX = self.startX;
        self.selectionArray[self.selectedIndex].forEach(function(item){
            item.visible = true;
            item.y = currentY;
            item.x = startX;
            currentY += self.itemHeight;
        });
    };
    this.getNext = function(){
        if(self.selectedIndex < self.selectionArray.length - 1){
            self.selectedIndex += 1;
            self.renderSelection();
        }
    };
    this.getPrev = function(){
        if(self.selectedIndex > 0){
            self.selectedIndex -= 1;
            self.renderSelection();
        }
    };
    var nextButton = game.add.button(game.width/2 + 100, game.height - 25, game.buttonSprite, this.getNext);
    nextButton.text = game.add.text(0, 0, "Next", {
        fill: "#ffffff",
        fontSize: game.width/120,
        font: "Arial"
    });
    nextButton.anchor.setTo(0.5, 0.5);
    nextButton.text.anchor.setTo(0.5, 0.5);
    nextButton.addChild(nextButton.text);
    var prevButton = game.add.button(game.width/2 - 100, game.height - 25, game.buttonSprite, this.getPrev);
    prevButton.text = game.add.text(0, 0, "Prev", {
        fill: "#ffffff",
        fontSize: game.width/120,
        font: "Arial"
    });
    prevButton.anchor.setTo(0.5, 0.5);
    prevButton.text.anchor.setTo(0.5, 0.5);
    prevButton.addChild(prevButton.text);
    prevButton.tint = 0xdd0000;
    nextButton.tint = 0xdd0000;
    this.nextButton = nextButton;
    this.prevButton = prevButton;
    this.group = itemsGroup;
    this.itemHeight = itemHeight;
    this.selectedIndex = 0;
    this.startX = startX;
    this.startY = startY;
    var currentArray = [];
    this.selectionArray = [];
    itemsGroup.forEach(function(item){
        if(item.y + item.height/2 > game.height){
            this.selectionArray.push(currentArray);
            currentArray = [];
        }
        currentArray.push(item);
        item.visible = false;
    });
    this.selectionArray.push(currentArray);
};