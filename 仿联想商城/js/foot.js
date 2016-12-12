/**
 * Created by Administrator on 10/5/2016.
 */

    //window.onload = function () {
        //左侧导航栏开始
            var TOP = 0;
            var leftbar = document.getElementById('leftbar');
            var star = document.getElementById('star');
            var leftStar = document.getElementById('leftstar');
            var like = document.getElementById('like');
            var leftLike = document.getElementById('leftlike');
            var floor1 = document.getElementById('floor1');
            var leftFloor1 = document.getElementById('leftf1');
            var floor2 = document.getElementById('floor2');
            var leftFloor2 = document.getElementById('leftf2');
            var floor3 = document.getElementById('floor3');
            var leftFloor3 = document.getElementById('leftf3');
            var floor4 = document.getElementById('floor4');
            var leftFloor4 = document.getElementById('leftf4');
            var floor5 = document.getElementById('floor5');
            var leftFloor5 = document.getElementById('leftf5');
            var floor6 = document.getElementById('floor6');
            var leftFloor6 = document.getElementById('leftf6');

            //储存右侧栏原来的classname
            var arrClassName=[];
            for(var i = 1;i < leftStar.parentNode.childNodes.length;i += 4){
                arrClassName[i] = leftStar.parentNode.childNodes[i].className;
            }
        //    滚动效果
            window.onscroll = function () {
              TOP = document.body.scrollTop + 200;
                if(TOP) {
                    if (TOP < star.offsetTop) {
                        leftbar.style.display = "none";
                    } else if (TOP >= star.offsetTop && TOP < like.offsetTop) {
                        leftbar.style.display = "block";
                        updateClassName(leftStar);
                        addClassName(leftStar, "leftactive");
                        //alert('2')
                    } else if (TOP >= like.offsetTop && TOP < floor1.offsetTop) {
                        updateClassName(leftLike);
                        addClassName(leftLike, "leftactive");
                    } else if (TOP >= floor1.offsetTop && TOP < floor2.offsetTop) {
                        updateClassName(leftFloor1);
                        addClassName(leftFloor1, "leftactive");
                    } else if (TOP >= floor2.offsetTop && TOP < floor3.offsetTop) {
                        updateClassName(leftFloor2);
                        addClassName(leftFloor2, "leftactive");
                    } else if (TOP >= floor3.offsetTop && TOP < floor4.offsetTop) {
                        updateClassName(leftFloor3);
                        addClassName(leftFloor3, "leftactive");
                    } else if (TOP >= floor4.offsetTop && TOP < floor5.offsetTop) {
                        updateClassName(leftFloor4);
                        addClassName(leftFloor4, "leftactive");
                    } else if (TOP >= floor5.offsetTop && TOP < floor6.offsetTop) {
                        updateClassName(leftFloor5);
                        addClassName(leftFloor5, "leftactive");
                    } else if (TOP >= floor6.offsetTop ) {
                        updateClassName(leftFloor6);
                        addClassName(leftFloor6, "leftactive");
                    }
                }
            };
                //左侧跳转
                toplace(leftStar,star);
                toplace(leftLike,like);
                toplace(leftFloor1,floor1);
                toplace(leftFloor2,floor2);
                toplace(leftFloor3,floor3);
                toplace(leftFloor4,floor4);
                toplace(leftFloor5,floor5);
                toplace(leftFloor6,floor6);
        //初始化其他兄弟元素的classname
        function updateClassName(ele){
            for(var i = 1;i < leftStar.parentNode.childNodes.length;i += 4){
                leftStar.parentNode.childNodes[i].className = arrClassName[i];
            }
        }
        //为元素添加新classname
        function addClassName(ele,classname){
            if(!ele.className){
                ele.className = classname;
            }else{
                newclassname = ele.className;
                newclassname += " ";
                newclassname += classname;
                ele.className = newclassname;
            }
        }

        //左侧导航栏结束

        //右侧导航栏开始
            var phone = document.getElementById('phone');
            var ask = document.getElementById('ask');
            var phoneshow = document.getElementById('phoneshow');
            var askshow = document.getElementById('askshow');
            phone.onmouseover = function () {
                phoneshow.style.display = "block";
            };
            phone.onmouseout = function () {
                phoneshow.style.display = "none";
            };
            ask.onmouseover = function () {
                askshow.style.display = "block";
            };
            ask.onmouseout = function () {
                askshow.style.display = "none";
            };
        //右侧返回顶部
        var totop = document.getElementById('totop');
        var target = 0;
            totop.onclick = function () {
                clearInterval(timer);
                var timer = setInterval(function () {
                    target = document.body.scrollTop -50;
                    window.scrollTo(0, target);
                    if (parseInt(target) < 60) {
                        window.scroll(0, 0);
                        clearInterval(timer);
                    }
                }, 1);
            };
    //封装缓慢跳转到目标位置的函数
    function toplace(ele,tar){ // ele 是要点击的触发跳转的元素,tar是要跳转的目标位置(也是目标元素)
        var target = 0;

            ele.onclick = function () {
                if(document.body.scrollTop > tar.offsetTop){
                    clearInterval(timer);
                    var timer = setInterval(function () {
                        target = document.body.scrollTop -50;
                        window.scrollTo(tar.offsetTop, target);
                        if (parseInt(target) < tar.offsetTop) {
                            window.scroll(tar.offsetTop, tar.offsetTop);
                            clearInterval(timer);
                        }
                        leftbar.style.display = "block";
                    }, 1);
                }else if(document.body.scrollTop < tar.offsetTop){
                    clearInterval(timer);
                    var timer = setInterval(function () {
                        target = document.body.scrollTop + 50;
                        window.scrollTo(tar.offsetTop, target);
                        if (parseInt(target) > tar.offsetTop - 50) {
                            window.scroll(tar.offsetTop, tar.offsetTop);
                            clearInterval(timer);
                        }
                        leftbar.style.display = "block";
                    }, 1);
                }
            };
    

    }
    //};

