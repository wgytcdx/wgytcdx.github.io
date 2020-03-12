(function () {
  $('.banner_div').css('height', `${document.documentElement.clientHeight}px`);

  /* ------navShow------*/
  $.goNavShow = function (node) {
    const $node = $(node);

    $(window).on('scroll', function (e) {
      e.preventDefault();
      const offsetY = $(this).scrollTop();

      if (offsetY >= 200) {
        $node.addClass('visible');
      } else {
        $node.removeClass('visible');
      }
    });
  };

  /* ------topNav------*/
  const $navToggle = $('#nav-toggle');
  const $menu = $('nav ul');

  $navToggle.on('click', function (e) {
    e.preventDefault();
    $menu.slideToggle(250);
    this.classList.toggle('active');
  });
  $(window).resize(() => {
    const resizeW = $(window).width();

    resizeW > 320 && $menu.is(':hidden') && $menu.removeAttr('style');
  });

  /* ------gotoTop------*/
  $('.gotop-js').on('click', (e) => {
    $('body').animate({ scrollTop: 0 }, 'slow');
  });

  /* ------modal------*/
  const $last = $('li.last');
  const $modalCt = $('#modal');
  const $close = $('.close');
  const $cover = $('.cover');

  $last.on('click', (e) => {
    $('body').addClass('remodal'); /* 隐藏body的其他内容 */
    $modalCt.show();
  });
  $close.on('click', (e) => {
    $modalCt.hide();
    $('body').removeClass('remodal');
  });
  $cover.on('click', () => {
    $modalCt.hide();
    $('body').removeClass('remodal');
  });
  $('.hero a').on('click', (e) => {
    e.preventDefault();
    $modalCt.show();
    $('body').addClass('remodal');
  });

  /* ------projects mouseenter------*/
  $('.projects').on('mouseenter', 'article', function () {
    $(this).siblings().addClass('dim');
  }).on('mouseleave', 'article', function () {
    $(this).siblings().removeClass('dim');
  });

  /* ------文字翻转------*/
}(jQuery));

$(() => {
  const liItems = $('#Change').children();
  const liLen = liItems.length;
  let count = 0;
  let Atimer = null;

  // 定义图片切换函数(即改变透明度)
  function showImages (index) {
    for (let i = 0; i < liLen - 1; i++) {
      liItems[i].style.zIndex = 100 - i;
      liItems[i].style.opacity = '0';
    }
    liItems[index].style.zIndex = 100;
    liItems[index].style.opacity = '1';
  }

  showImages(0);

  // 定义自动轮播函数
  function autoplay () {
    if (count % 2 == 0) {
      count = 0;
    }
    showImages(count);
    count++;
  }

  Atimer = setInterval(autoplay, 5000);

  /* ------navShow------*/
  $.goNavShow($('#top-js'));
  $('.wodryRX').wodry();


  $('.top_ul li').mouseover(function () {
    $(this).children('div').addClass('selected');
  });
  $('.top_ul li').mouseout(function () {
    $(this).children('div').removeClass('selected');
  });
});
