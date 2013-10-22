EPUBJS.Hooks.register("beforeChapterDisplay").swipeDetection = function(callback, renderer){
		
		var lock = false;
		
				
		$(renderer.docEl).on("swipeleft", function() {
			renderer.book.nextPage();
		});
		
		$(renderer.docEl).on("swiperight", function() {
			renderer.book.prevPage();
		});
				
		if(callback) callback();		
}