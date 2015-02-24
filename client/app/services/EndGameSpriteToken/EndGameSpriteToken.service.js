'use strict';

angular.module('partyanimalsDraftApp')
  .service('EndGameSpriteToken', function(){
    return {
      createToken : function(game, group, key, handler, context){
        var that = this;
        that.context = context;
        var base = new Phaser.Group(game, group, key);
        var redSprite = new Phaser.Sprite(game, 0, 0, 'redCircle');
        var greenSprite = new Phaser.Sprite(game, 0, 0, 'greenCircle');

        redSprite.anchor.set(0.5);
        redSprite.scale.set(0.5);
        greenSprite.anchor.set(0.5);
        greenSprite.scale.set(0.5);

        base.add(redSprite);
        base.add(greenSprite);
        return {
          move: function(x,y){
            base.x = x;
            base.y = y;
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
