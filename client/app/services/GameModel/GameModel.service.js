'use strict';

angular.module('partyanimalsDraftApp')
  .service('GameModel', function Gamemodel() {
    this.District = function(game, group, key, handler, context){
      var district = new Phaser.Group(game, group, key);
      var sprite = new Phaser.Sprite(game, 0, 0, key);
      this.name = key;
      sprite.inputEnabled = true;
      sprite.anchor.set(0.5);
      sprite.events.onInputDown.add(handler, context);
      district.add(sprite);
      this.base = district;
      this.sprite = sprite;

      //text
      var style = { font: '12px Arial', fill: 'black', align: 'center' };
      var text = new Phaser.Text(game, -30, 40, 'x', style);
      this.base.add(text);
      this.label = text;
    };
  });
