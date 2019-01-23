var clock //设置延时，提高性能
$(window).on('scroll',function(){
	if (clock) {
		clearTimeout(clock)
	}
	clock = setTimeout(function(){
		checkAppeared()
	},500)
});
checkAppeared () //打开页面加载可视范围内的图片
//检查图片是否已加载
function checkAppeared(){
	$('.container img').each(function(){
		var $current = $(this)
		console.log($(this))
		if($current.attr('isLoaded')){ /* 滚动的时候检测每一张图片，该图片位置如果已经显示了，就可以加载图片了 */
			return
		}
		if(isVisible($current)){
			loadImg($current)
		}
	});
}
function loadImg(node){
	var $node = $(node)
	$node.attr('src',$node.attr('data-src'))
	$node.attr('isLoad',true)
}
//判断图片是否出现在可视区域内
function isVisible(node){
	var $node = $(node)
	var scrollTop = $(window).scrollTop()
	var windowHeight = $(window).height()
	var offSetHeight = $node.offset().top
	if (scrollTop + windowHeight >= offSetHeight) {
		return true
	}else{
		return false
	}
}