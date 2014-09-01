'use strict';

angular.module('partyanimalsDraftApp')
  .service('GameModel', function Gamemodel() {
    this.District = function(game, group, key, handler, context){
      var district = new Phaser.Group(game, group, key);
      var sprite = new Phaser.Sprite(game, 0, 0, key);

      //  Here we create our group and populate it with 6 sprites


      this.name = key;
      sprite.inputEnabled = true;
      sprite.anchor.set(0.5);
      sprite.events.onInputDown.add(handler, context);
      district.add(sprite);

      var peoples = new Phaser.Group(game, district, 'peoples');
      for (var i = 0; i < 20; i++){
        sprite = peoples.create(5 * i - 50, 0, 'people');
        sprite.scale.x = 0.5;
        sprite.scale.y = 0.5;
        sprite.tint = 0xffffff;
      }

      peoples.callAll('animations.add', 'animations', 'run', [1,2,3], 10, true);
      peoples.callAll('animations.add', 'animations', 'stay', [0], 1, true);

      this.base = district;
      this.sprite = sprite;

      //text
      var style = { font: '12px Arial', fill: 'black', align: 'center' };
      var text = new Phaser.Text(game, -30, 40, 'x', style);
      this.base.add(text);
      this.label = text;

      this.selected = function(){
        peoples.callAll('play', null, 'run');
        peoples.setAll('tint', Math.random() * 0xffffff);
      };

      this.unSelected = function(){
        peoples.callAll('play', null, 'stay');
      };
    };
  });
