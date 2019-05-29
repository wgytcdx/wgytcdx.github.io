/**
 * Created by 15267 on 2017/5/17.
 */
/*
 * http://love.hackerzhou.me
 */

// variables
const $win = $(window);
const clientWidth = $win.width();
const clientHeight = $win.height();

$(window).resize(() => {
  const newWidth = $win.width();
  const newHeight = $win.height();
  if (newWidth != clientWidth && newHeight != clientHeight) {
    location.replace(location);
  }
});

(function ($) {
  $.fn.typewriter = function () {
    this.each(function () {
      const $ele = $(this); const str = $ele.html(); let
        progress = 0;
      $ele.html('');
      var timer = setInterval(() => {
        const current = str.substr(progress, 1);
        if (current == '<') {
          progress = str.indexOf('>', progress) + 1;
        } else {
          progress++;
        }
        $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
        if (progress >= str.length) {
          clearInterval(timer);
        }
      }, 75);
    });
    return this;
  };
}(jQuery));

function timeElapse(date) {
  const current = Date();
  let seconds = (Date.parse(current) - Date.parse(date)) / 1000;
  const days = Math.floor(seconds / (3600 * 24));
  seconds %= (3600 * 24);
  let hours = Math.floor(seconds / 3600);
  if (hours < 10) {
    hours = `0${hours}`;
  }
  seconds %= 3600;
  let minutes = Math.floor(seconds / 60);
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  seconds %= 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  const result = `第 <span class="digit">${days}</span> 天 <span class="digit">${hours}</span> 小时 <span class="digit">${minutes}</span> 分钟 <span class="digit">${seconds}</span> 秒`;
  $('#clock').html(result);
}
