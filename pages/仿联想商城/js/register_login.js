/**
 * Created by Administrator on 2016/10/6.
 */
const register = document.getElementById('register');
const maskReg = document.getElementById('mask_reg');
const registerShow = document.getElementById('register_show');
const close = document.getElementById('close');
const comRegister = document.getElementById('com_register');
const shortRegister = document.getElementById('short_register');

// 普通登录注册
comRegister.onclick = function (event) {
  maskReg.style.display = 'block';
  registerShow.style.display = 'block';
  maskLog.style.display = 'none';
  logShow.style.display = 'none';

  var event = event || window.event;
  if (event && event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
};
// 快捷登录注册
shortRegister.onclick = function (event) {
  maskReg.style.display = 'block';
  registerShow.style.display = 'block';
  maskLog.style.display = 'none';
  logShow.style.display = 'none';

  var event = event || window.event;
  if (event && event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
};
// 点击注册
register.onclick = function (event) {
  maskReg.style.display = 'block';
  registerShow.style.display = 'block';

  //                防止冒泡事件
  //                document.body.style.overflow = "hidden";
  var event = event || window.event;
  if (event && event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
};
// 关闭注册框
close.onclick = function () {
  maskReg.style.display = 'none';
  registerShow.style.display = 'none';
};
//            注册框js部分结束

//            登录框js部分开始
const login = document.getElementById('login');
var maskLog = document.getElementById('mask_log');
var logShow = document.getElementById('log_show');
const logClose = document.getElementById('log_close');
const common = document.getElementById('common');
const shortcut = document.getElementById('shortcut');
const commonLog = document.getElementById('common_log');
const shortcutLog = document.getElementById('shortcut_log');

// 普通登录
common.onclick = function () {
  common.style.color = 'red';
  common.style.borderBottom = '3px solid red';
  shortcut.style.color = 'white';
  shortcut.style.borderBottom = '0px solid red';
  commonLog.style.display = 'block';
  shortcutLog.style.display = 'none';
};
// 快捷登录
shortcut.onclick = function () {
  shortcut.style.color = 'red';
  shortcut.style.borderBottom = '3px solid red';
  common.style.color = 'white';
  common.style.borderBottom = '0px solid red';
  shortcutLog.style.display = 'block';
  commonLog.style.display = 'none';
};

login.onclick = function (event) {
  maskLog.style.display = 'block';
  logShow.style.display = 'block';

  var event = event || window.event;
  if (event && event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
};
// 点击关闭登录框
logClose.onclick = function () {
  maskLog.style.display = 'none';
  logShow.style.display = 'none';
};
//            登录框js部分结束

//            注册数据js部分开始
const username = document.getElementById('username');
const password = document.getElementById('password');
const repassword = document.getElementById('repassword');
const regBtn = document.getElementById('reg_btn');
const pTag = document.getElementById('p_tag');
const check = document.getElementById('check');
const checkBox = document.getElementById('check_box');
const change = document.getElementById('change');
const pic = document.getElementById('pic');

const arr = ['yanzhengma0.png', 'yanzhengma1.png', 'yanzhengma2.png', 'yanzhengma3.png', 'yanzhengma4.png', 'yanzhengma5.png', 'yanzhengma6.png', 'yanzhengma7.png', 'yanzhengma8.png', 'yanzhengma9.png'];
const arrn = ['a8qb', '2y4u', 'rftq', 'j5pf', 'oded', 'plwz', 'uv6f', '09yk', '4co9', 'ux3s'];
let index = 0;
change.onclick = function () {
  index++;
  if (index > 9) {
    index = 0;
  }
  pic.src = `images/${arr[index]}`;
};

const storage = window.localStorage;
let ishaving = true;
regBtn.onclick = function () {
  const uname = username.value;
  const pwd = password.value;
  const repwd = repassword.value;

  for (let i = 0; i < storage.length; i++) {
    if (uname == storage.key(i)) {
      // console.log("用户名已经存在");
      alert('账号已经存在,请重新输入 账号');
      ishaving = false;
      break;
    }
  }
  if (ishaving) {
    if (uname != '' && pwd != '' && repwd != '') {
      if (pwd == repwd) {
        if (checkBox.checked == true) {
          if (check.value == arrn[index]) {
            saveMessage(uname, pwd);
            pTag.innerHTML = '注册成功';
            setTimeout(() => {
              maskReg.style.display = 'none';
              registerShow.style.display = 'none';
              maskLog.style.display = 'block';
              logShow.style.display = 'block';
            }, 3000);
          } else {
            pTag.innerHTML = '验证码错误';
          }
        } else {
          pTag.innerHTML = '请认真阅读使用条款和隐私政策权';
        }
      } else {
        pTag.innerHTML = '两次密码不一致';
      }
    } else {
      pTag.innerHTML = '输入不能为空';
    }
  }
  // 下面这段可以用作修改密码
  // if(uname != "" && pwd != "" && repwd != ""){
  //
  //        if(pwd == repwd){
  //            if(checkBox.checked == true){
  //                saveMessage(uname,pwd);
  //                pTag.innerHTML = "注册成功";
  //
  //                setTimeout(function close(){
  //                    maskReg.style.display = "none";
  //                    registerShow.style.display = "none";
  //                    maskLog.style.display = "block";
  //                    logShow.style.display = "block";
  //                },3000);
  //            }else{
  //                pTag.innerHTML = "请认真阅读使用条款和隐私政策权";
  //            }
  //        }else{
  //            pTag.innerHTML = "两次密码不一致";
  //        }
  // }else{
  //    pTag.innerHTML = "输入不能为空";
  // }
};
function saveMessage(username, password) {
  localStorage.setItem(username, password);
}
//            注册数据js部分结束

//            普通登录js部分设置开始
const comlogUname = document.getElementById('comlog_uname');
const comlogPwd = document.getElementById('comlog_pwd');
const comlogCkeck = document.getElementById('comlog_check');
const comlogBtn = document.getElementById('comlog_btn');
const comlogTag = document.getElementById('comlog_tag');
const yi = document.getElementById('yi');
const er = document.getElementById('er');
const san = document.getElementById('san');
const hide = document.getElementById('hide');

yi.onmouseover = function () {
  hide.style.display = 'block';
  hide.onmouseover = function () {
    hide.style.display = 'block';
  };
  hide.onmouseout = function () {
    hide.style.display = 'none';
  };
};
yi.onmouseout = function () {
  hide.style.display = 'none';
};

comlogBtn.onclick = function () { // 此处修改..................................................
  const nameval = comlogUname.value;
  const pwdval = comlogPwd.value;
  const storage = window.localStorage;
  console.log(storage);
  for (let i = 0; i < storage.length; i++) {
    if (nameval == storage.key(i)) {
      // console.log("用户名已经存在");
      ishaving = false;
      if (storage.key(i) == nameval && storage.getItem(storage.key(i)) == pwdval) {
        getMessage(comlogUname.value, comlogPwd.value);
      } else {
        comlogTag.innerHTML = '密码错误';
      }

      break;
    }
  }
  if (ishaving) {
    alert('账号不存在,您可以注册');
  }
};
function getMessage(username, password) {
  comlogTag.innerHTML = '登录成功';
  localStorage.getItem(username, password);
  yi.innerHTML = `你好啊!  ${username}`;
  er.style.display = 'none';
  san.style.display = 'none';


  setTimeout(() => {
    maskLog.style.display = 'none';
    logShow.style.display = 'none';
  }, 3000);
}

//            普通登录js部分设置结束

//            快捷登录js部分设置开始
const shortlogUname = document.getElementById('shortlog_uname');
const shortlogCkeck = document.getElementById('shortlog_check');
const shortlogBtn = document.getElementById('shortlog_btn');
const shortlogTag = document.getElementById('shortlog_tag');

shortlogBtn.onclick = function () { // ........................................................
  const namevalue = shortlogUname.value;
  // console.log(namevalue);
  const storage = window.localStorage;
  if (checkPhone(namevalue)) {
    for (let i = 0; i < storage.length; i++) {
      if (storage.key(i) == namevalue) {
        getMessage(shortlogUname.value);
      } else {
        shortlogTag.innerHTML = '登录失败';
      }
    }
  }
};
// 手机验证码倒计时开始
const changepwd = document.getElementById('changepwd');
const changenum = document.getElementById('changenum');
changepwd.onclick = function () {
  const { value } = shortlogUname;

  if (checkPhone(value)) {
    changepwd.innerHTML = ' 秒后重新获取';
    changenum.innerHTML = 10;
    changenum.style.color = '#666';
    var changetime = setInterval(() => {
      if (changenum.innerHTML == 0) {
        changenum.innerHTML = null;
        changepwd.innerHTML = '获取动态密码';
        clearInterval(changetime);
        return false;
      }
      if (changenum.innerHTML > 6) {
        // alert("5miao")
        changenum.style.color = '#666';
      } else {
        changenum.style.color = 'red';
      }
      changenum.innerHTML--;
    }, 1000);
  }
};
// 手机验证码倒计时结束
function getMessages(username) {
  shortlogTag.innerHTML = '登录成功';
  localStorage.getItem(username);
  yi.innerHTML = `你好啊!  ${username}`;
  er.style.display = 'none';

  setTimeout(() => {
    maskLog.style.display = 'none';
    logShow.style.display = 'none';
  }, 3000);
}

// 检测手机号码格式是否正确
function checkPhone(num) {
  if (!(/^1(3|4|5|7|8)\d{9}$/.test(num))) {
    alert('手机号码有误，请重填');
    return false;
  } return true;
}


//            快捷登录js部分设置结束
