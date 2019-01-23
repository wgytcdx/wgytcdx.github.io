/**
 * Created by Administrator on 2016/10/4.
 */
//window.onload = function () {
//            今日推荐轮播图js部分设置开始
    var todayScroll = document.getElementById("today_scroll");
    var todayUl= todayScroll.children[0];
    var items = todayUl.children;
    var arrow = todayScroll.children[1];
    var arrowL = arrow.children[0];
    var arrowR = arrow.children[1];
    var target = 0,leader = 0;

    todayScroll.onmouseover = function () {
        arrow.style.display = "block";
    };
    todayScroll.onmouseout = function () {
        arrow.style.display = "none";
    };

    arrowL.onclick = function () {
        target += 252;
    };
    arrowR.onclick = function () {
        target -= 252;
    };
    setInterval(function () {
        if(target < -2015){
            target = 0;
        }else if(target > 0){
            target = -1764;
        }
        leader = leader + (target - leader) / 10;
        todayUl.style.left = leader + "px";
    },1);
//            今日推荐轮播图js部分设置结束

    //            明星单品轮播图js部分开始
    var starScroll = document.getElementById("star_scroll");
    var  starUl = starScroll.children[0];
    var starArrow = document.getElementById("star_arrow");
    var starL = starArrow.children[0];
    var starR = starArrow.children[1];
    var targets = 0,leaders = 0;

    starL.onclick = function () {
        targets += 200;
    };
    starR.onclick = function () {
        targets -= 200;
    };
    setInterval(function () {
        if(targets < -2399){
            targets = 0;
        } else if(targets > 0){
            targets = -2200;
        }
        leaders = leaders + (targets - leaders)/30;
        starUl.style.left = leaders + "px";
    });
//            明星单品轮播图js部分结束

//}
