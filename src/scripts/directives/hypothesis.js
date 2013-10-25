'use strict';

angular.module('Reader')
	.directive('hypothesis', [ '$window', function($window) {
		return {
			restrict: "E",
			scope: {
				src: '@',
				onAnnotationsLoaded: '&'
			},
			// templateUrl: '',

			controller: function($scope, $rootScope, $q){
				$scope.annotator = null;
			},

			link: function(scope, element, attrs) {
				scope.src = attrs.src;

				var setSinglePage = function (enabled) {
					scope.$parent.$apply(function () {
						scope.$parent.single = enabled;
					});
				}

				var body = $window.document.body;

				var annotator = window.annotator = new window.Annotator.Host(body, {
						"app": "https://hypothes.is/app/",
            "Toolbar": {container:"#singlepage"}
        });
        annotator.frame.appendTo(element);

				annotator.subscribe('annotationEditorShown', function () {
					setSinglePage(true);
					window.annotator.setVisibleHighlights(true)
				});
				annotator.subscribe('annotationViewerShown', function () {
					setSinglePage(true);
					window.annotator.setVisibleHighlights(true)
				});

				annotator.subscribe('annotationEditorHidden', function () {
					setSinglePage(false);
					window.annotator.setVisibleHighlights(false)
				});
				annotator.subscribe('annotationViewerHidden', function () {
					setSinglePage(false);
					window.annotator.setVisibleHighlights(false)
				});

				scope.annotator = annotator;

				scope.annotator.subscribe("annotationsLoaded", function(e){
					scope.onAnnotationsLoaded({ annotator: scope.annotator, annotations: e });
				});

			}

		}
	}]);
