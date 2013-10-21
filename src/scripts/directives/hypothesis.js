'use strict';

angular.module('Reader')
	.directive('hypothesis', function() {
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

				var annotator = window.annotator = new window.Annotator.Host(element,
					{
						"app": "https://hypothes.is/app/",
						"Heatmap": {"container": ".annotator-frame"},
						"Toolbar": {"container": "#singlepage"}
					});

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
	});
