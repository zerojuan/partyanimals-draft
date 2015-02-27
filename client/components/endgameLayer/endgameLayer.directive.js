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
        }

        function setTokenNumber(){
          _.forEach(scope.orderedDistricts, function(district, i){
            var t = _.find(tokens, function(token){
              return (token.district.name === district);
            })
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

          var token = _.find(tokens, function(val){
            console.log('isAlive? ', val.isAlive());
            return !val.isAlive();
          });

          if(token){
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



        var w = window.innerWidth;
        var h = window.innerHeight;
        var game = new Phaser.Game(w, h, Phaser.AUTO, 'endgameCanvas',
          {preload: preload, create: create, update: update});
        game.scaleMode = Phaser.ScaleManager.RESIZE;

      }
    };
  });
