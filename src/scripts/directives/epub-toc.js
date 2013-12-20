'use strict';

angular.module('Reader')
	.directive('epubtoc', function() {
		return {
			restrict: "E",
			scope: {
				toc: '='	,
				current: '@'	
			},
			templateUrl: 'views/toc.html',

			controller: function($scope, $rootScope){
				$scope.bookPath = $rootScope.bookPath;
				$scope.active = '';

				$scope.openParents = function($el) {
					$('.openChapter').removeClass("openChapter");
					$el.parents('li').addClass("openChapter");
				}

				$scope.updateCurrent = function(id) {
					// var item,
					// 		ancestors = [];
					// 
					// var $el = $('#toc-'+id);

					$scope.active = id;

					// $location.path(href);
					// $scope.$apply();

					// while(parent) {
					// 	item =  _.find($scope.toc, function(el){ return el.id == parent; });
					// 	ancestors.push(item)
					// 	parent = item.parent;
					// }
					// 
					// console.log(ancestors)

					// $('.openChapter').removeClass("openChapter");
					// $el.parents('li').addClass("openChapter");
				}



				$scope.toggleItem = function(id) {
					var $el = $('#toc-'+id),
							open = $el.hasClass("openChapter");

					if(open){
						$el.removeClass("openChapter");
					} else {
						$el.addClass("openChapter");
					}

				}


			},

			link: function(scope, element, attrs) {
				// var $el = element.find("")
				// console.log(element)
				// scope.active = '';

				attrs.$observe('current', function(id) {					
					if(!id) return;

					// $el = $('#toc-'+id);
					// scope.active = id;

					// $('.openChapter').removeClass("openChapter");
					// $el.parents('li').addClass("openChapter");
					// console.debug(scope.toc)
				});


			}

		}
	});

angular.module('Reader')
	.directive('postClick', function() {
			return function(scope, element, attrs) {
					var $el = $(element);

					$('.openChapter').removeClass("openChapter");
					$el.parents('li').addClass("openChapter");

			}
	})
