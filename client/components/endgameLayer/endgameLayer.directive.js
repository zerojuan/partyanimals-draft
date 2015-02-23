'use strict';

angular.module('partyanimalsDraftApp')
  .directive('endgameLayer', function (GameModel) {
    return {
      template: '<div id="endgameCanvas"></div>',
      restrict: 'E',
      replace: true,
      scope: {

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



        function preload(){
          game.stage.backgroundColor = '#53b5ef';
          _.forEach(districtImages, function(val){
            game.load.image(val, './assets/images/districts/'+val+'.jpg');
          });
          game.load.image('bg', './assets/images/districts/normal2.png');
        }

        function create(){
          var centerX = game.world.width / 2;

          seaBG1 = game.add.tileSprite(0,0,w,h, 'bg');

          districtGroup = game.add.group();

          _.forEach(districtImages, function(val, i){
            var district = new GameModel.District(game, districtGroup, null, val, onDistrictClicked, this);
            var x = Math.floor(i%2);
            var y = Math.floor(i/2);
            district.base.x = x*120 + centerX - 60;
            district.base.y = y*120 + 120;
            districtGroup.add(district.base);
            districtArray.push(district);
          });
        }

        function update(){
          /*TODO: update function*/
        }

        function onDistrictClicked(sprite){
          // var index = _.findIndex(districtImages, function(val){
          //   return val === sprite.key;
          // });

          console.log('Hey I clickd this : ' + sprite.key);
        }



        var w = window.innerWidth;
        var h = window.innerHeight;
        var game = new Phaser.Game(w, h, Phaser.AUTO, 'endgameCanvas',
          {preload: preload, create: create, update: update});
        game.scaleMode = Phaser.ScaleManager.RESIZE;

      }
    };
  });
