EPUBJS.Hooks.register("beforeChapterDisplay").base = function(callback, renderer){
		var currentBaseEL = document.head.getElementsByTagName("base"),
				base = currentBaseEL.length ? currentBaseEL[0].getAttribute('href') : false,
				insertBase;
		
		if(base) {
			insertBase = renderer.doc.createElement("base");
			insertBase.href=base;
			insertBase.target='_top';
			renderer.doc.head.appendChild(insertBase);
		}
		
		
		callback();
}