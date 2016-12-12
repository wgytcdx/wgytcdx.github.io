var Exposure = (function(){
	var exposure = {};
	 exposure.bind = function($target,callback){
	 	$(window).on('scroll',function(){
	 		if (exposure.isVisible($target)) {
	 			callback.call($target);
	 		}
	 	})
	 };
	exposure.isVisible = function($node){
		return $node.offset().top < $(window).height() + $(window).scrollTop();
	};
	exposure.one = function($target,callback){
		var $target = $target;
		$target.isExp = false;
		$(window).on('scroll',function(){
			if ($target.isExp) {return;}
			if (exposure.isVisible($target)) {
				callback.call($target);
				$target.isExp = true;
			}
		})
	};
	return{
		bind : exposure.bind,
		one : exposure.one
	}
})();