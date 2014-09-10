'use strict';

angular.module('partyanimalsDraftApp')
  .service('GameModel', function Gamemodel() {
    this.District = function(game, group, peoplesGroup, key, handler, context){
      var that = this;
      var district = new Phaser.Group(game, group, key);
      var sprite = new Phaser.Sprite(game, 0, 0, key);

      //  Here we create our group and populate it with 6 sprites
      var blueNexus = {x:20, y:50};
      var redNexus = {x:70, y:50};
      var grayNexus = {x:50, y:70};

      this.topPositions = [];
      this.bottomPositions = [];

      var i = 0;
      for(i=0; i<3; i++){
        this.topPositions.push({x: i*33-30, y: -35});
        this.bottomPositions.push({x: i*33-30, y: 35});
      }

      this.name = key;
      this.isMouseOver = false;
      sprite.inputEnabled = true;
      sprite.anchor.set(0.5);
      sprite.events.onInputDown.add(handler, context);
      sprite.events.onInputOver.add(function(){
        that.isMouseOver = true;
      }, this);
      sprite.events.onInputOut.add(function(){
        that.isMouseOver = false;
      }, this);
      district.add(sprite);

      var peoples;

      this.base = district;
      this.sprite = sprite;
      this.border = null;

      //text
      var style = { font: '12px Arial', fill: 'black', align: 'center' };
      var text = new Phaser.Text(game, -30, 40, 'x', style);
      this.base.add(text);
      this.label = text;

      this.selected = function(){
        peoples.callAll('play', null, 'run');
        if(that.border.x <= 0 && that.border.y <= 0){
          that.border.alpha = 1;
          that.border.x = that.base.x;
          that.border.y = that.base.y;
        }else{
          game.add.tween(that.border).to( { x: that.base.x, y: that.base.y }, 250, Phaser.Easing.Sinusoidal.Out, true);
        }

        that.updateReputation();
      };

      this.unSelected = function(){
        peoples.callAll('play', null, 'stay');
        sprite.alpha = 1;
      };

      var scale = 50;
      this.updateData = function(){
        var total = this.data.population/scale;
        var i = 0;
        if(!peoples){
          peoples = new Phaser.Group(game, peoplesGroup, 'peoples');
          peoples.x = this.base.x;
          peoples.y = this.base.y;
          for (i = 0; i < total; i++){
            var pSprite = peoples.create(5 * i - 50, 0, 'people');
            pSprite.scale.x = 0.60;
            pSprite.scale.y = 0.60;
            pSprite.dest = new Phaser.Point();
            pSprite.dest.x = 20;
            pSprite.dest.y = 20;
            pSprite.tint = 0xffffff;
          }

          peoples.callAll('animations.add', 'animations', 'run', [1,2,3], 10, true);
          peoples.callAll('animations.add', 'animations', 'stay', [0], 1, true);

          that.updateReputation();
        }else{
          that.updateReputation();
        }

        //update reputation


      };

      this.update = function(){
        // if(that.isMouseOver){
          if(peoples && peoples.length > 0){
            peoples.forEach(function(person){
                if(Math.floor(person.x) === Math.floor(person.dest.x) && Math.floor(person.y) === Math.floor(person.dest.y)){
                  //look for a new destination
                  if(person.status === 'human'){
                    person.dest.x = blueNexus.x + (Math.random() * 30 - 60);
                    person.dest.y = blueNexus.y + (Math.random() * 30 - 60);
                  }else if(person.status === 'undecided'){
                    person.dest.x = grayNexus.x + (Math.random() * 30 - 60);
                    person.dest.y = grayNexus.y + (Math.random() * 30 - 60);
                  }else if(person.status === 'red'){
                    person.dest.x = redNexus.x + (Math.random() * 30 - 60);
                    person.dest.y = redNexus.y + (Math.random() * 30 - 60);
                  }
                }
                var direction = Phaser.Point.subtract(person.dest, person.position);
                direction = Phaser.Point.normalize(direction);
                direction.setMagnitude(0.2);
                person.x += direction.x;
                person.y += direction.y;
            });
          }
        // }
      };

      this.updateReputation = function(){
        var total = this.data.population/scale;
        var humans = Math.floor((this.data.population*(this.data.humanReputation/100))/scale);
        var ais = Math.floor((this.data.population*(this.data.aiReputation/100))/scale);
        var neutrals = total - humans - ais;
        var i = 0;
        peoples.forEach(function(val){
          if(i <= humans){
            val.tint = 0x0000ff;
            val.status = 'human';
            val.dest.x = blueNexus.x + (Math.random() * 30 - 60);
            val.dest.y = blueNexus.y + (Math.random() * 30 - 60);
          }else if(i > humans && i <= (humans+neutrals)){
            val.tint = 0xcccccc;
            if(val.status !== 'undecided'){
              val.status = 'undecided';
              val.dest.x = grayNexus.x + (Math.random() * 30 - 60);
              val.dest.y = grayNexus.y + (Math.random() * 30 - 60);
              val.x = val.dest.x;
              val.y = val.dest.y;
            }
          }else{
            val.tint = 0xff0000;
            val.status = 'red';
            val.dest.x = redNexus.x + (Math.random() * 30 - 60);
            val.dest.y = redNexus.y + (Math.random() * 30 - 60);
          }
          i++;
        });

        peoples.forEach(function(val){
          if(val.status !== 'undecided'){
              game.add.tween(val).to( { x: val.dest.x, y: val.dest.y }, 500, Phaser.Easing.Sinusoidal.Out, true);
          }
        });
      };
    };

  });
