'use strict';

EPUBJS.VERSION = "0.1.7";
EPUBJS.filePath = "js/libs/";
EPUBJS.cssPath = "styles/";
// fileStorage.filePath = EPUBJS.filePath;

angular.module('Reader', ['ngTouch'])
  .config(function ($locationProvider) {
    
    $locationProvider.html5Mode(true);
      
  })
  .run(function($rootScope) {
    
    $rootScope.contentsPath = '';
    
    $rootScope.metadata = {bookTitle: 'TDO'};
    
  });