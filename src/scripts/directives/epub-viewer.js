'use strict';

angular.module('Reader')
	.directive('epubviewer', function() {
		return {
			restrict: "E",
			scope: {
				src: '@',
				path: '@',
				cfi: '@',
				metadata: '=',
				toc: '=',
				onChapterDisplayed: '&',
				onPageChanged: '&',
				onReady: "&"	,
				onRendered: '&'	
			},
			templateUrl: 'views/viewer.html',
			
			controller: function($scope, $rootScope, $location, $q, gAnalytics){
				
				$scope.prevArrowState = "";
				$scope.nextArrowState = "";
				$scope.isReady = false;

				var book = $scope.book = $rootScope.book = ePub({ restore: true, version: 0.1 });
				
				$scope.metadata = book.getMetadata();
				$scope.toc = book.getToc();
				
				
				
				book.ready.all.then(function() {
					$scope.isReady = true;	
					$scope.$apply();
					$scope.onReady({book: book});
				});
								
				
				
				book.on('renderer:chapterDisplayed', function(e) {
					$scope.onChapterDisplayed({e:e});
				});
				
				
				
				book.on('renderer:pageChanged', function(e) {
					$scope.onPageChanged({e:e});
				});
				
				
				this.arrowKeys = function(e) {

					if (e.keyCode == 37) { 
						 book.prevPage();
						 $scope.prevArrowState = "active";
						 $scope.$apply();
						 
						 // this.$.prev.classList.add("active");
						 this.lock = true;
						 setTimeout(function(){
							 this.lock = false;
							 $scope.prevArrowState = "";
							 $scope.$apply();
							 // this.$.prev.classList.remove("active");
						 }.bind(this), 100);
						 return false;
					}
					if (e.keyCode == 39) { 
						 book.nextPage();
						 // this.$.next.classList.add("active");
						 $scope.nextArrowState = "active";
						 $scope.$apply();
						 
						 this.lock = true;
						 setTimeout(function(){
							this.lock = false;
							$scope.nextArrowState = "";
							$scope.$apply();
							
							// this.$.next.classList.remove("active");
						 }.bind(this), 100);
						 return false;
					}
				}
				
				document.addEventListener('keydown', this.arrowKeys.bind(this), false);
				
				
				
				
			},
			
			link: function(scope, element, attrs) {
				var book = scope.book;
								
				attrs.$observe('src', function(value) {
					//TODO: destroy previous
					var opened = book.open(attrs.src);
					var rendered = book.renderTo(element.find('#area')[0]);
					
					rendered.then(function(){
							// $scope.onRendered();
					});
										
				});
				
				attrs.$observe('path', function(value) {
					if(scope.isReady && attrs.path) {
						book.goto(attrs.path);
					} else if(attrs.path.length > 1) {
						book.settings.goto = attrs.path;
					}
				});
				
				attrs.$observe('cfi', function(value) {
					if(scope.isReady && attrs.cfi.length > 1) {
						book.gotoCfi(attrs.cfi);
					} else if(attrs.cfi.length > 1) {
						book.settings.gotoCfi = attrs.cfi;
					}
					
				});
				
			}
			
		}
	});
	
