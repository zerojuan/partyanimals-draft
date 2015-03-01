'use strict';

angular.module('partyanimalsDraftApp')
  .directive('endgameLayer', function (GameModel, EndGameSpriteToken) {
    return {
      template: '<div id="endgameCanvas"></div>',
      restrict: 'E',
      replace: true,
      scope: {
        orderedDistricts: '=',
        districts: '='
      },
      link: function (scope) {
        var seaBG1;

        var districtArray = [];
        var districtImages = [
          'kapitolyo',
          'casino',
          'fishingvillage',
          'port',
          'cathedral',
          'resort'
        ];
        var districtGroup;
        var uiGroup;
        var graphics;

        var tokens;

        function preload(){
          game.stage.backgroundColor = '#53b5ef';
          _.forEach(districtImages, function(val){
            game.load.image(val, './assets/images/districts/'+val+'.jpg');
          });
          game.load.image('greenCircle', './assets/images/ui/green.png');
          game.load.image('redCircle', './assets/images/ui/red.png');
          game.load.image('bg', './assets/images/districts/normal2.png');
        }

        function create(){
          var centerX = game.world.width / 2;

          seaBG1 = game.add.tileSprite(0,0,w,h, 'bg');

          districtGroup = game.add.group();
          graphics = game.add.graphics(0,0);
          uiGroup = game.add.group();

          tokens = [];

          _.forEach(districtImages, function(val, i){
            var district = new GameModel.District(game, districtGroup, null, val, onDistrictClicked, this);
            var x = Math.floor(i%2);
            var y = Math.floor(i/2);
            district.base.x = x*120 + centerX - 60;
            district.base.y = y*120 + 120;
            districtGroup.add(district.base);
            districtArray.push(district);

            var token = EndGameSpriteToken.createToken(game, uiGroup, i, onTokenClicked, this);
            tokens.push(token);
          });
        }

        function update(){
          _.forEach(tokens, function(token){
            if(token.district){
              var color = token.district.action === 'support' ? 'green' : 'red';
              token.setColor(color);
            }
          });
          graphics.clear();
          _.forEach(scope.orderedDistricts, function(districtName, i){
            var token = _.find(tokens, function(t){
              return t.district.name === districtName;
            });
            if(i !== scope.orderedDistricts.length-1){
              var districtName2 = scope.orderedDistricts[i+1];
              var token2 = _.find(tokens, function(t){
                return t.district.name === districtName2;
              });
              // graphics.beginFill(0x0033FF);
              graphics.lineStyle(10, 0x0033FF, 1);
              graphics.moveTo(token.base.x, token.base.y);
              graphics.quadraticCurveTo(token.base.x - 40,token.base.y - 40, token2.base.x, token2.base.y);
              graphics.endFill();
            }
          });
        }

        function setTokenNumber(){
          _.forEach(scope.orderedDistricts, function(district, i){
            var t = _.find(tokens, function(token){
              return (token.district.name === district);
            });
            t.setLabel(i+1);
          });
        }

        function onTokenClicked(clickedToken){
          console.log('Clicked on this token');
          var index = _.findIndex(tokens, function(token){
            console.log('Base the same? ', clickedToken, token.base);
            return token.base === clickedToken;
          });

          tokens[index].kill();
          //remove from list
          scope.orderedDistricts = _.reject(scope.orderedDistricts, function(district){
            return district === tokens[index].district.name;
          });

          scope.$apply();

          setTokenNumber();
        }

        function onDistrictClicked(sprite){
          var index = _.findIndex(districtImages, function(val){
            return val === sprite.key;
          });

          var selectedDistrict = _.find(districtArray, function(val, i){
            return i === index;
          });

          if(!_.contains(scope.orderedDistricts, selectedDistrict.name)){
            console.log('OrderedDistricts: ', scope.orderedDistricts);
            var token = _.find(tokens, function(val){
              console.log('isAlive? ', val.isAlive());
              return !val.isAlive();
            });

            if(token){

                console.log('District',token.district);
                var district = _.find(scope.districts, function(d){
                  return d.name === selectedDistrict.name;
                });
                token.setDistrict(district);
                token.move(selectedDistrict.base.x, selectedDistrict.base.y);
                scope.orderedDistricts.push(selectedDistrict.name);
                scope.$apply();
                setTokenNumber();


            }
          }

        }



        var w = window.innerWidth;
        var h = window.innerHeight;
        var game = new Phaser.Game(w, h, Phaser.AUTO, 'endgameCanvas',
          {preload: preload, create: create, update: update});
        game.scaleMode = Phaser.ScaleManager.RESIZE;

      }
    };
  });
