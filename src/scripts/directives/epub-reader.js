'use strict';

angular.module('Reader')
	.directive('epubreader', function() {
		return {
			restrict: "E",
			scope: {
				src: '@'
			},
			templateUrl: 'views/reader.html',

			controller: function($scope, $rootScope, $location, $q, gAnalytics){
				
				var silent = true;
				
				var isDocument = function(path) {
					return (path.search(".xhtml") != -1);
				}
				
				var pathFromLocation	= function() {
					var path = $location.path().slice(1),
							hash = $location.hash();
					
					if(hash) {
						path = path + "#" + hash;
					}
					
					return path;
				}
				
				gAnalytics.init('UA-43609037-1');
				if(isDocument($location.path())) {
					$scope.path = pathFromLocation();
				} else {
					$scope.cfi = decodeURIComponent($location.path());
				}
				
				
				$scope.metadata = {};
				$scope.toc = {};
				$scope.currentChapterId = '';
				$scope.open = false;
				$scope.single = false;
				$scope.currentCfi = '';
				
				//-- Set the title and other metadata in head
				$rootScope.metadata = $scope.metadata;
				
				$scope.prevHash;
				
				$rootScope.$on('$locationChangeSuccess', function(e, url){
					var path;
					
					if(!silent) {
						path = $location.path();
						
						if(isDocument(path)) {
							$scope.path = pathFromLocation();
						} else {
							$scope.cfi = decodeURIComponent(path);
						}
						
					}
					
					silent = false;
					
				});
				
				$scope.afterReady = function(book) {
					$scope.book = book;
					$scope.contentsPath = $scope.book.settings.contentsPath;
					
				}
				
				$scope.afterChapterDisplayed = function(e) {
					
					$scope.currentCfi = e.cfi;
					
					
					// if(!$scope.$$phase) {
						
						// $scope.$apply(function(){
					// $location.hash('');
					// $location.path($scope.currentCfi);
					// console.debug("e.cfi", e.cfi);
					// // silent = true;
					// if(!$scope.$$phase) { 
					// 	$scope.$apply();
					// }
					// }
					
					$scope.updateAnnotations();
					
					gAnalytics.trackChapterChange(e)
					gAnalytics.trackLinkFollows(e);
				};
				
				$scope.afterPageChanged = function(e) {
					var hash = e.detail;
					
					if($scope.currentCfi == hash) return;
					
					$scope.currentCfi = hash;

					$location.hash('');
					$location.path($scope.currentCfi);

					silent = true;

					var notes = [];

					if($scope.annotator) {
						setTimeout(function(){
							$scope.updateAnnotations();
						}, 10);
					}

				};
				
				
				$scope.updateAnnotations = function() {
					var annotatations = [],
							annotator = $scope.book.render.iframe.contentWindow.Annotator,
							_$, $annotations, width;
					
					if($scope.noUpdate) {
						$scope.noUpdate = false;
						return;
					}
					
						
					if(!annotator) {
						if($scope.annotator) $scope.annotator.updateViewer([]);
						return;	
					};
					
				  _$ = annotator.$;
					$annotations = _$(".annotator-hl");
					width = $scope.book.render.iframe.clientWidth;
					
					//-- Find visible annotations
						
					$annotations.each(function(){
						var $this = _$(this),
								left = this.getBoundingClientRect().left;
								
						if(left >= 0 && left <= width) {
							// console.debug("on screen", left);
							annotatations.push($this.data('annotation'));
						}
						
					});
					// console.debug("annotatations", $annotations, annotatations)
					//-- Update viewer
					$scope.annotator.updateViewer(annotatations);

				};
				
				$scope.afterAnnotationsLoaded = function(annotator, annotatations) {
					var _$ = $scope.book.render.iframe.contentWindow.Annotator.$;
					
					// Initialize annotation event tracking
					gAnalytics.trackAnnotations();
					
					$scope.annotator = annotator;
					$scope.updateAnnotations();

					_$($scope.book.render.bodyEl).on("click", ".annotator-hl", function(event){
						var $this = _$(this);
						
						$scope.annotator.updateViewer([$this.data('annotation')]);
						
						$scope.$apply(function(){
							$scope.single = true;
							$scope.noUpdate = true;
						});
						
					});
					
				};
				
				
			},

			link: function(scope, element, attrs, gAnalytics) {
				
				// attrs.$observe('ua', function(value) {
				// 	if(attrs.ua) {
				// 		book.goto(attrs.path);
				// 	}
				// });
				
			}

		}
	});
