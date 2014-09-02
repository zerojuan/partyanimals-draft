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

      this.name = key;
      sprite.inputEnabled = true;
      sprite.anchor.set(0.5);
      sprite.events.onInputDown.add(handler, context);
      district.add(sprite);

      var peoples;

      this.base = district;
      this.sprite = sprite;

      //text
      var style = { font: '12px Arial', fill: 'black', align: 'center' };
      var text = new Phaser.Text(game, -30, 40, 'x', style);
      this.base.add(text);
      this.label = text;

      this.selected = function(){
        peoples.callAll('play', null, 'run');
        that.updateReputation();
      };

      this.unSelected = function(){
        peoples.callAll('play', null, 'stay');
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
            sprite = peoples.create(5 * i - 50, 0, 'people');
            sprite.scale.x = 0.60;
            sprite.scale.y = 0.60;
            sprite.dest = {
              x: 20,
              y: 20
            };
            sprite.tint = 0xffffff;
          }

          peoples.callAll('animations.add', 'animations', 'run', [1,2,3], 10, true);
          peoples.callAll('animations.add', 'animations', 'stay', [0], 1, true);

          that.updateReputation();
        }

        //update reputation


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
