/**
 * Created by Administrator on 2016/10/5.
 */
        //      张天爱图消失
        $("#hideIcon").click(function(){
            $("#imgBox").addClass("hided");
            $("#hideIcon").addClass("hided");
        });
        

        //            搜索区的搜索框内a标签的消失于隐藏
        var miix5 = document.getElementById("miix5");
        var miix5Hide = document.getElementById("miix5Hide");
        miix5.onfocus = function () {
            miix5Hide.style.display = "none";
        }
        miix5.onblur = function () {
            miix5Hide.style.display = "block";
        }

//            banner 左侧商品详细分栏
        var navCul = document.getElementById("navCul");
        var items = navCul.children;
        var len = items.length;
        var navLink = document.getElementById("navLink");
        for(var i = 0; i<len; i++){
            items[i].index = i;
            items[i].onmouseover = function(){
                this.children[0].children[1].style.display = "block";
                this.children[0].style.backgroundColor = "#f7f7f7";
            }
            items[i].onmouseout = function(){
                this.children[0].children[1].style.display = "none";
                this.children[0].style.backgroundColor = "#fff";
            }
        }

//          导航条中"社交平台" 和"手机版"两个标签内的隐藏块
        navLink.children[0].onmouseover = function () {
            navLink.children[0].style.color = "#c81623";
            navLink.children[1].style.display = "block";
            navLink.children[1].style.zIndex = "999";
        }
        navLink.children[1].onmouseover = function () {
            navLink.children[1].style.display = "block";
        }
        navLink.children[1].onmouseout = function () {
            navLink.children[1].style.display = "none";
        }
        navLink.children[0].onmouseout = function () {
            navLink.children[0].style.color = "#fff";
            navLink.children[1].style.display = "none";
        }
        navLink.children[2].onmouseover = function () {
            navLink.children[2].style.color = "#c81623";
            navLink.children[3].style.display = "block";
            navLink.children[3].style.zIndex = "999";
        }
        navLink.children[3].onmouseover = function () {
            navLink.children[3].style.display = "block";
        }
        navLink.children[3].onmouseout = function () {
            navLink.children[3].style.display = "none";
        }
        navLink.children[2].onmouseout = function () {
            navLink.children[2].style.color = "#fff";
            navLink.children[3].style.display = "none";
        }

//          中部 banner 特效开始
        var shopCar = document.getElementById("shopCar");
        var ArrowL = document.getElementById("ArrowL");
        var ArrowR = document.getElementById("ArrowR");
        var wrapCar = document.getElementById("wrapCar");
        var wrapCarUl = document.getElementById("wrapCarUl");
        var wCitems = wrapCarUl.children;
        var wClen = wCitems.length;
        var num = 0;
        var timer=null, timer1 = null, timer2 = null, timer3 = null, timer4 = null;
        var circles = document.getElementById("circles");
        var circlesItems = circles.children;




//            中部右侧上方 shop_news 的滚动文字块
        var timer5 = null, timer6 = null;
        var hornScroll = document.getElementById("hornScoll");
        timer6 = setInterval(autoPlay, 30);
        function autoPlay() {
            num -= 0.5;      // num 代表文字块的高度
            num <= -480 ? num = 0 : num;
            hornScroll.style.top = num + "px";

            if(num % 60 == 0){
                clearInterval(timer6);
                timer5 = setTimeout(function () {
                    timer6 = setInterval(autoPlay, 7)
                }, 2000)
            }
        }

/* ************** 广告图片切换效果 *************** */
// 图片切换显示函数
function showImage(index) {
    for (var i = 0; i < wClen; i++) {
        wCitems[i].style.zIndex = 100 - i;       //为图片排列顺序
        wCitems[i].style.opacity = '0';          //将图片透明度全部赋值为0
        circlesItems[i].className = 'active1';   //圆点背景色全部设置 active1
    }
    wCitems[index].style.opacity = '1';
    circlesItems[index].className = 'active2';
}
showImage(0);                                   //初始设置下标为0的图片和圆点的样式

var count = 0;                                  //获取计数器
// 定义自动轮播函数
function imageMove() {
    if (count % 6 == 0) {        // 判断count的值如果能被6整除，则将count重新赋值为0；
        count = 0;
    }                            // 将count值当做参数传给函数showImage();
    showImage(count);
    count++;                     //执行一次 ＋1
}
// 设置两秒调用一次函数imageMove()，并且赋值给imageInitailMove
var imageInitailMove = setInterval('imageMove()', 2000);

//  定义箭头点击函数
shopCar.onmouseover = function () {
    ArrowL.style.display = "block";
    ArrowR.style.display = "block";
}
shopCar.onmouseout = function () {
    ArrowL.style.display = "none";
    ArrowR.style.display = "none";
}

ArrowL.onclick = function() {
    clearInterval(imageInitailMove);
    if (count == 0) {         // 由于和自动轮换方向相反所以要判断count的值
        count = 6;            // 当值为0时，重新赋值为6，继续循环
    }
    count--;
    showImage(count);         //调用函数count先自－
    imageInitailMove = setInterval('imageMove()', 2000);
}
// 向右的点击事件
ArrowR.onclick = function() {
    clearInterval(imageInitailMove);
    imageMove();             //由于和自动轮播的方向相同所以直接调用
// 重新为定时器赋值
    imageInitailMove = setInterval('imageMove()', 2000);
}
// 圆点的点击事件
for (var i = 0; i <wClen; i++) {
    circlesItems[i].index = i;
    circlesItems[i].onmouseover = function() {
        clearInterval(imageInitailMove);
        count = this.index;         // 将当前点击的圆点的下标值赋值给count
        showImage(count);           // 调用图片切换函数
        imageInitailMove = setInterval('imageMove()', 2000);
    }
}
/******************************************************************************/

//            banner 区的图片自动切换
/************************************************* 135
 function autoplay(){
            var b = isActives();
            clearInterval(timer2);
            var a ;
            if(b != wClen-1){
                a = b+1;
            }else{
                a = 0;
            }
            var num = 0;
            isClear();
            circlesItems[a].className = "actives";
            timer2 = setInterval(function () {
                num = num + 0.1;
                wCitems[b].style.opacity = 1 - num;
                wCitems[a].style.opacity = num;
                wCitems[a].style.display = "block";
                if ( num > 1) {
                    wCitems[b].style.display = "none";
                    clearInterval(timer2);
                }
            }, 20);
        }
 function isActives(){                  // 通过判断小圆点的 class:active 确定此时显示的 li 的 index 函数
            for(var i = 0; i < 6; i++){
                if(circlesItems[i].className == "actives"){
                    return i;
                }
            }
        }
 function isClear(){    // 统一清除小圆点的 class
            for(var j = 0; j < wClen;j++){
                circlesItems[j].className = "";
            }
        }
 timer3 = setInterval(autoplay, 1000);
 *********************************************************/

/************************************************************************ 286

//            左箭头控制图片切换
    ArrowL.onmousedown = function () {
        //console.log(isActives());
        clearInterval(timer3);
        var b = isActives();
        clearInterval(timer2);
        var a ;
        if(b != 0){
            a = b-1;
        }else{
            a = 5;
        }
        var num = 0;
        isClear();
        circlesItems[a].className = "actives";
        timer2 = setInterval(function () {
            num = num + 0.1;
            wCitems[b].style.opacity = 1 - num;
            wCitems[a].style.opacity = num;
            wCitems[a].style.display = "block";
            if ( num > 1) {
                wCitems[b].style.display = "none";
                clearInterval(timer2);
            }
        }, 20);
    }
//            右箭头控制图片切换
    ArrowR.onmousedown = function () {
        //console.log(isActives());
        clearInterval(timer3);
        var b = isActives();
        clearInterval(timer2);
        var a ;
        if(b != wClen-1){
            a = b+1;
        }else{
            a = 0;
        }
        var num = 0;
        isClear();
        circlesItems[a].className = "actives";
        timer2 = setInterval(function () {
            num = num + 0.1;
            wCitems[b].style.opacity = 1 - num;
            wCitems[a].style.opacity = num;
            wCitems[a].style.display = "block";
            if ( num > 1) {
                wCitems[b].style.display = "none";
                clearInterval(timer2);
            }
        }, 20);
    }


//            小圆点控制图片切换
        for(var i = 0; i < wClen; i++){
            circlesItems[i].index = i;
            circlesItems[i].onmouseover = function(){
                var b = isBlock();
                var now = this.index;
                clearInterval(timer);
                var num = 0;
                for(var j = 0; j < wClen;j++){
                    circlesItems[j].className = "";
                }
                circlesItems[now].className = "actives";
                if( b != this.index ) {
                    timer = setInterval(function () {
                        num = num + 0.1;
                        wCitems[b].style.opacity = 1 - num;
                        wCitems[now].style.opacity = num;
                        wCitems[now].style.display = "block";
                        if ( num > 1) {
                            wCitems[b].style.display = "none";
                            clearInterval(timer);
                        }
                    }, 10);
                }
            }
        }
        function isBlock(){
            for(var i = 0; i < 6; i++){
                if(wCitems[i].style.display == "block"){
                    return i;
                }
            }
        }
************************************************************************/








