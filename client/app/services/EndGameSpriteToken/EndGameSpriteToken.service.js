'use strict';

angular.module('partyanimalsDraftApp')
  .service('EndGameSpriteToken', function(){
    return {
      createToken : function(game, group, key, handler, context){
        var that = this;
        var alive = false;
        var label = key;
        that.context = context;
        var base = new Phaser.Group(game, group, key);
        var redSprite = new Phaser.Sprite(game, 0, 0, 'redCircle');
        var greenSprite = new Phaser.Sprite(game, 0, 0, 'greenCircle');

        var style = {
          font: '12px Arial',
          fill: 'black',
          align: 'center'};
        var text = new Phaser.Text(game, 0, 0, key+1, style);
        that.label = text;

        redSprite.anchor.set(0.5);
        redSprite.scale.set(0.5);
        greenSprite.anchor.set(0.5);
        greenSprite.scale.set(0.5);

        base.add(redSprite);
        base.add(greenSprite);
        base.add(text);

        var clickHandler = function(){
            handler(base);
        }
        redSprite.inputEnabled = true;
        greenSprite.inputEnabled = true;
        redSprite.events.onInputDown.add(clickHandler, context);
        greenSprite.events.onInputDown.add(clickHandler, context)
        return {
          base: base,
          district: null,
          setLabel: function(x){
            label = x;
            text.text = x;
          },
          setDistrict: function(district){
            this.district = district;            
          },
          move: function(x,y){
            alive = true;
            base.alpha = 1;
            base.x = x;
            base.y = y;
          },
          isAlive: function(){
            return alive;
          },
          kill: function(){
            alive = false;
            base.alpha = 0;
            base.x = -100;
            base.y = -100;
          },
          setColor: function(color){
            switch(color){
              case 'green': redSprite.alpha = 0;
                            greenSprite.alpha = 1;
                            break;
              case 'red':   greenSprite.alpha = 0;
                            redSprite.alpha = 1;
                            break;
            }
          }
        };
      }
    };
  });
