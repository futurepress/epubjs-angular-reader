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
					return (path.search(".xhtml") != -1 || path.search(".html") != -1);
				}
				
				var pathFromLocation	= function() {
					var path = $location.path().slice(1),
							hash = $location.hash();
					
					if(hash) {
						path = path + "#" + hash;
					}
					
					return path;
				}
				
				gAnalytics.init('UA-45075604-1');
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
					// console.log("url", url, silent)
					if(!silent) {
						path = $location.path();
						
						if(isDocument(path)) {
							$scope.path = pathFromLocation();
							// console.log("path", path)
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
					
					// console.debug("after chapter", $scope.currentCfi)
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
					if($scope.annotator) {
						$scope.updateAnnotations();
					}
					
					gAnalytics.trackChapterChange(e)
					gAnalytics.trackLinkFollows(e);
				};
				
				$scope.afterPageChanged = function(e) {
					var hash = e.detail;
					
					if($scope.currentCfi == hash) return;
					
					$scope.currentCfi = hash;
					// console.debug("after page", $scope.currentCfi)
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
							annotator = $scope.book.render.iframe.contentWindow.annotator,
							//$scope.book.render.iframe.contentWindow.Annotator,
							_$, 
							$annotations, width;

					if($scope.noUpdate) {
						$scope.noUpdate = false;
						return;
					}
					
					
					if(!annotator) {
						if($scope.annotator) $scope.annotator.updateViewer([]);
						return;	
					};
					
					_$ = annotator.constructor.$;
					
					$annotations = _$(".annotator-hl");
					width = $scope.book.render.iframe.clientWidth;

					//-- Find visible annotations
						
					$annotations.each(function(){
						var $this = _$(this),
								left = this.getBoundingClientRect().left;
								
						if(left >= 0 && left <= width) {
							annotatations.push($this.data('annotation'));
						}
						
					});
					// console.debug("annotatations", annotatations)
					
					//-- Update viewer
					$scope.annotator.updateViewer(annotatations);

				};
				
				$scope.afterAnnotationsLoaded = function(annotator, annotatations) {
					var _$ = $scope.book.render.iframe.contentWindow.annotator.constructor.$; 
					//$scope.book.render.iframe.contentWindow.Annotator.$;
					
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
				
				// Search
				$scope.SEARCH_SERVER = "http://epubjs-search.herokuapp.com";
				
				$scope.search = function(q, callback) {
					var fetch = $.ajax({
						dataType: "json",
						url: $scope.SEARCH_SERVER + "/search?q=" + encodeURIComponent(q) 
					});
				
					fetch.fail(function(err) {
						console.error(err);
					});
				
					fetch.done(function(results) {
						callback(results);
					});
				}
				
			},

			link: function(scope, element, attrs, gAnalytics) {
				
				// attrs.$observe('ua', function(value) {
				// 	if(attrs.ua) {
				// 		book.goto(attrs.path);
				// 	}
				// });
				
				var $searchBox = $("#searchBox"),
						$searchResults = $("#searchResults"),
						$tocView = $("#toclist"),
						$searchView = $("#searchView"),
						iframeDoc;
				
				
				$searchBox.on("search", function(e) {
					var q = $searchBox.val();
					
					$tocView = $("#toclist");
					
					e.preventDefault();
					//-- SearchBox is empty or cleared
					if(q == '') {
						$searchResults.empty();
						$searchView.removeClass("shown");
						$tocView.removeClass("hidden");
						$(iframeDoc).find('body').unhighlight();
						iframeDoc = false;
						return;
					}
				
					if(!$searchView.hasClass("shown")) {
						$searchView.addClass("shown");
						$tocView.addClass("hidden");
					}
					
					$searchResults.empty();
					$searchResults.append("<li><p>Searching...</p></li>");
					
					
					
					scope.search(q, function(data) {
						var results = data.results;
						
						$searchResults.empty();
						
						if(iframeDoc) { 
							$(iframeDoc).find('body').unhighlight();
						}
						
						if(results.length == 0) {
							$searchResults.append("<li><p>No Results Found</p></li>");
							return;
						}
						
						iframeDoc = $("#area iframe")[0].contentDocument;
						$(iframeDoc).find('body').highlight(q, { element: 'span' });
						
						results.forEach(function(result) {
							var $li = $("<li></li>");
							var $item = $("<a href='"+result.href+"' data-cfi='"+result.cfi+"'><span>"+result.title+"</span><p>"+result.highlight+"</p></a>");
				
							$item.on("click", function(e) {
								var $this = $(this),
										cfi = $this.data("cfi");
										
								scope.book.gotoCfi(cfi);
								
								scope.book.on("renderer:chapterDisplayed", function() {
									iframeDoc = $("#area iframe")[0].contentDocument;
									$(iframeDoc).find('body').highlight(q, { element: 'span' });
								})
								
								e.preventDefault();
								
							});
							$li.append($item);
							$searchResults.append($li);
						});
				
					});
				
				});
				
			}

		}
	});

