EPUBJS.Hooks.register("beforeChapterDisplay").swipeDetection = function(callback, renderer){

		//-- Load jQuery into iframe header
		EPUBJS.core.addScripts([ "http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js",
														"http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.js"], 
			function(){
				//-- Create a script element, you could also load this from an external file like above
				var script = renderer.doc.createElement("script");
				
				//-- Listen for swipe events
				script.text = '\
					$(window).on("swipeleft", function() {\
						alert("right");\
						renderer.book.nextPage();\
					});\
					$(window).on("swiperight", function() {\
						renderer.book.prevPage();\
					});';
				
				renderer.doc.head.appendChild(script);
				
		}, renderer.doc.head);

		

		if(callback) callback();		
}