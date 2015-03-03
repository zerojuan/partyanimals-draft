'use strict';

angular.module('partyanimalsDraftApp')
  .directive('twoSliderInput', function ($document) {
    return {
      templateUrl: 'components/twoSliderInput/twoSliderInput.html',
      restrict: 'EA',
      replace: true,
      scope: {
        model : '='
      },
      link: function (scope, element) {
        var startX = {
              a: 0,
              b: 170
            },
            x = {
              a: 0,
              b: 170
            };

        var aMarker = element.find('.marker-a');
        var bMarker = element.find('.marker-b');
        var aBar = element.find('.bar-a');
        var bBar = element.find('.bar-b');



        aMarker.on('mousedown', function(event){
          startX.a = event.pageX - x.a;
          $document.on('mousemove', mousemoveA);
          $document.on('mouseup', mouseupA);
        });

        bMarker.on('mousedown', function(event){
          startX.b = event.pageX - x.b;
          $document.on('mousemove', mousemoveB);
          $document.on('mouseup', mouseupB);
        })

        function mousemoveA(event){
          event.preventDefault();
          x.a = event.pageX - startX.a;
          if(x.a < 0){
            x.a = 0;
            startX.a = 0;
            setPosition(aMarker, 0);
            updateModel('a');
            mouseupA();
            return;
          }
          if(x.a >= x.b-10){
            x.a = x.b - 10;
            setPosition(aMarker, x.a);
            updateModel('a');
            mouseupA();
            return;
          }
          setPosition(aMarker, x.a);
          updateModel('a');
        }

        function mouseupA(){
          $document.off('mousemove', mousemoveA);
          $document.off('mouseup', mouseupA);
        }

        function mousemoveB(event){
          event.preventDefault();
          x.b = event.pageX - startX.b;
          if(x.b > 160){
            x.b = 160;
            startX.b = 160;
            mouseupB();
            setPosition(bMarker, x.b);
            updateModel('b');
            return;
          }
          if(x.b <= x.a+10){
            x.b = x.a+10;
            setPosition(bMarker, x.b);
            updateModel('b');
            mouseupB();
            return;
          }
          setPosition(bMarker, x.b);
          updateModel('b');
        }

        function mouseupB(){
          $document.off('mousemove', mousemoveB);
          $document.off('mouseup', mouseupB);
        }

        function updateModel(type){
          if(type === 'a'){
            scope.model.player = Math.floor((100 * (x.a + 10))/170);
          }else{
            scope.model.ai = 100-Math.floor((100 * x.b)/170);
          }
          scope.$apply();
        }

        function setPosition(marker, position){
          if(aMarker === marker){
            aBar.css({
              width: position + 'px'
            });
          }else{
            bBar.css({
              width: 170-position + 'px'
            });
          }
          marker.css({
            left: position + 'px'
          });
        }

        scope.$watch('model', function(){
          if(scope.model){            
            var aPos = scope.model.player * 170;
            x.a = (aPos / 100)-10;
            startX.a = x.a;
            setPosition(aMarker, x.a);
            var bPos = (100-scope.model.ai) * 170;
            x.b = bPos / 100;
            startX.b = x.b;
            setPosition(bMarker, x.b);
          }
        }, true);


      }
    };
  });
