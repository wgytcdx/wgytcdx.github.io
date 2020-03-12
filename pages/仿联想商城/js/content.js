/**
 * Created by Administrator on 2016/10/4.
 */
// window.onload = function () {
//            今日推荐轮播图js部分设置开始
const todayScroll = document.getElementById('today_scroll');
const todayUl = todayScroll.children[0];
const items = todayUl.children;
const arrow = todayScroll.children[1];
const arrowL = arrow.children[0];
const arrowR = arrow.children[1];
let target = 0; let leader = 0;

todayScroll.onmouseover = function () {
  arrow.style.display = 'block';
};
todayScroll.onmouseout = function () {
  arrow.style.display = 'none';
};

arrowL.onclick = function () {
  target += 252;
};
arrowR.onclick = function () {
  target -= 252;
};
setInterval(() => {
  if (target < -2015) {
    target = 0;
  } else if (target > 0) {
    target = -1764;
  }
  leader += (target - leader) / 10;
  todayUl.style.left = `${leader}px`;
}, 1);
//            今日推荐轮播图js部分设置结束

//            明星单品轮播图js部分开始
const starScroll = document.getElementById('star_scroll');
const starUl = starScroll.children[0];
const starArrow = document.getElementById('star_arrow');
const starL = starArrow.children[0];
const starR = starArrow.children[1];
let targets = 0; let leaders = 0;

starL.onclick = function () {
  targets += 200;
};
starR.onclick = function () {
  targets -= 200;
};
setInterval(() => {
  if (targets < -2399) {
    targets = 0;
  } else if (targets > 0) {
    targets = -2200;
  }
  leaders += (targets - leaders) / 30;
  starUl.style.left = `${leaders}px`;
});
//            明星单品轮播图js部分结束

// }
