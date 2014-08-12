'use strict';

angular.module('partyanimalsDraftApp')
  .directive('provinceView', function () {
    return {
      templateUrl: 'components/provinceView/provinceView.html',
      restrict: 'E',
      replace: true,
      scope: {
        districts : '=',
        selectedDistrict  : '=',
        changeSelected : '=',
        showReputation: '@'
      },
      link: function postLink(scope) {
        scope.selected = function(district){
          scope.changeSelected(district);
        };

        function convertTo2D(val, cols){
          return {
            x: val % cols,
            y: Math.floor(val / cols)
          };
        }

        scope.isNeighbor = function(district){
          var isNeighbor = _.find(scope.selectedDistrict.neighbors, function(d){
            return d === district.id;
          });
          return isNeighbor >= 0;
        };

        scope.getArrowDirection = function(district){
          var selected = convertTo2D(scope.selectedDistrict.id, 2);
          var neighbor = convertTo2D(district.id, 2);
          
          if(neighbor.x < selected.x && neighbor.y === selected.y){
            return 'left';
          }
          if(neighbor.x > selected.x && neighbor.y === selected.y){
            return 'right';
          }
          if(neighbor.x === selected.x && neighbor.y < selected.y){
            return 'up';
          }
          if(neighbor.x === selected.x && neighbor.y > selected.y){
            return 'down';
          }

        };


      }
    };
  });
