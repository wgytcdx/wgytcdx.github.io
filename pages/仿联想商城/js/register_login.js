/**
 * Created by Administrator on 2016/10/6.
 */
var register = document.getElementById("register");
var maskReg = document.getElementById("mask_reg");
var registerShow = document.getElementById("register_show");
var close = document.getElementById("close");
var comRegister = document.getElementById("com_register");
var shortRegister = document.getElementById("short_register");

//普通登录注册
comRegister.onclick = function (event) {
    maskReg.style.display = "block";
    registerShow.style.display = "block";
    maskLog.style.display = "none";
    logShow.style.display = "none";

    var event = event|| window.event;
    if(event && event.stopPropagation){
        event.stopPropagation();
    }else{
        event.cancelBubble = true;
    }
};
//快捷登录注册
shortRegister.onclick = function (event) {
    maskReg.style.display = "block";
    registerShow.style.display = "block";
    maskLog.style.display = "none";
    logShow.style.display = "none";

    var event = event|| window.event;
    if(event && event.stopPropagation){
        event.stopPropagation();
    }else{
        event.cancelBubble = true;
    }
};
//点击注册
register.onclick = function (event) {
    maskReg.style.display = "block";
    registerShow.style.display = "block";

//                防止冒泡事件
//                document.body.style.overflow = "hidden";
    var event = event|| window.event;
    if(event && event.stopPropagation){
        event.stopPropagation();
    }else{
        event.cancelBubble = true;
    }
};
//关闭注册框
close.onclick = function () {
    maskReg.style.display = "none";
    registerShow.style.display = "none";
};
//            注册框js部分结束

//            登录框js部分开始
var login = document.getElementById("login");
var maskLog = document.getElementById("mask_log");
var logShow = document.getElementById("log_show");
var logClose = document.getElementById("log_close");
var common = document.getElementById("common");
var shortcut = document.getElementById("shortcut");
var commonLog = document.getElementById("common_log");
var shortcutLog = document.getElementById("shortcut_log");

//普通登录
common.onclick = function () {
    common.style.color = "red";
    common.style.borderBottom = "3px solid red";
    shortcut.style.color = "white";
    shortcut.style.borderBottom = "0px solid red";
    commonLog.style.display = "block";
    shortcutLog.style.display = "none";
};
//快捷登录
shortcut.onclick = function () {
    shortcut.style.color = "red";
    shortcut.style.borderBottom = "3px solid red";
    common.style.color = "white";
    common.style.borderBottom = "0px solid red";
    shortcutLog.style.display = "block";
    commonLog.style.display = "none";
};

login.onclick = function (event) {
    maskLog.style.display = "block";
    logShow.style.display = "block";

    var event = event|| window.event;
    if(event && event.stopPropagation){
        event.stopPropagation();
    }else{
        event.cancelBubble = true;
    }
};
//点击关闭登录框
logClose.onclick = function () {
    maskLog.style.display = "none";
    logShow.style.display = "none";
};
//            登录框js部分结束

//            注册数据js部分开始
var username = document.getElementById("username");
var password = document.getElementById("password");
var repassword = document.getElementById("repassword");
var regBtn = document.getElementById("reg_btn");
var pTag = document.getElementById("p_tag");
var check = document.getElementById("check");
var checkBox = document.getElementById("check_box");
var change = document.getElementById("change");
var pic = document.getElementById("pic");

            var arr = ["yanzhengma0.png", "yanzhengma1.png", "yanzhengma2.png", "yanzhengma3.png", "yanzhengma4.png", "yanzhengma5.png", "yanzhengma6.png", "yanzhengma7.png", "yanzhengma8.png", "yanzhengma9.png"];
            var arrn= ["a8qb","2y4u","rftq","j5pf","oded","plwz","uv6f","09yk","4co9","ux3s"];
            var index = 0;
change.onclick = function () {
    index++;
    if(index > 9){
        index = 0;
    }
    pic.src = "images/"+arr[index];
};

var storage = window.localStorage;
var ishaving = true;
regBtn.onclick = function(){
    var uname = username.value;
    var pwd = password.value;
    var repwd = repassword.value;

    for(var i = 0;i < storage.length;i++){
        if(uname == storage.key(i)){
            //console.log("用户名已经存在");
            alert("账号已经存在,请重新输入 账号");
            ishaving = false;
            break;
        }
    }
    if(ishaving){
        if(uname != "" && pwd != "" && repwd != ""){
            if(pwd == repwd){
                if(checkBox.checked == true){
                    if(check.value == arrn[index]){
                        saveMessage(uname,pwd);
                        pTag.innerHTML = "注册成功";
                        setTimeout(function close(){
                            maskReg.style.display = "none";
                            registerShow.style.display = "none";
                                maskLog.style.display = "block";
                                logShow.style.display = "block";
                        },3000);
                    }else{
                        pTag.innerHTML = "验证码错误";
                    }
                }else{
                    pTag.innerHTML = "请认真阅读使用条款和隐私政策权";
                }
            }else{
                pTag.innerHTML = "两次密码不一致";
            }
        }else{
            pTag.innerHTML = "输入不能为空";
        }
    }
    //下面这段可以用作修改密码
    //if(uname != "" && pwd != "" && repwd != ""){
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
    //}else{
    //    pTag.innerHTML = "输入不能为空";
    //}
};
function saveMessage(username,password) {
    localStorage.setItem(username,password);
}
//            注册数据js部分结束

//            普通登录js部分设置开始
var comlogUname = document.getElementById("comlog_uname");
var comlogPwd = document.getElementById("comlog_pwd");
var comlogCkeck = document.getElementById("comlog_check");
var comlogBtn = document.getElementById("comlog_btn");
var comlogTag = document.getElementById("comlog_tag");
var yi = document.getElementById("yi");
var er = document.getElementById("er");
var san = document.getElementById("san");
var hide = document.getElementById("hide");

yi.onmouseover = function () {
    hide.style.display = "block";
    hide.onmouseover = function () {
        hide.style.display = "block";
    };
    hide.onmouseout = function () {
        hide.style.display = "none";
    }
};
yi.onmouseout = function () {
    hide.style.display = "none";
};

comlogBtn.onclick = function () {//此处修改..................................................
    var nameval = comlogUname.value;
    var pwdval = comlogPwd.value;
    var storage = window.localStorage;
    console.log(storage);
    for(var i = 0;i < storage.length;i++){
        if(nameval == storage.key(i)){
            //console.log("用户名已经存在");
            ishaving = false;
            if (storage.key(i) == nameval && storage.getItem(storage.key(i)) == pwdval) {
                getMessage(comlogUname.value, comlogPwd.value);
            } else {
                comlogTag.innerHTML = "密码错误";
            }

            break;
        }
    }
    if(ishaving) {
        alert("账号不存在,您可以注册");
    }
};
function getMessage(username,password){
    comlogTag.innerHTML = "登录成功";
    localStorage.getItem(username,password);
    yi.innerHTML = "你好啊!  "+username;
    er.style.display = "none";
    san.style.display = "none";


    setTimeout(function close(){
        maskLog.style.display = "none";
        logShow.style.display = "none";
    },3000);
}

//            普通登录js部分设置结束

//            快捷登录js部分设置开始
var shortlogUname = document.getElementById("shortlog_uname");
var shortlogCkeck = document.getElementById("shortlog_check");
var shortlogBtn = document.getElementById("shortlog_btn");
var shortlogTag = document.getElementById("shortlog_tag");

shortlogBtn.onclick = function () {//........................................................
    var namevalue = shortlogUname.value;
    //console.log(namevalue);
    var storage = window.localStorage;
    if(checkPhone(namevalue)) {
        for (var i = 0; i < storage.length; i++) {
            if (storage.key(i) == namevalue) {
                getMessage(shortlogUname.value);
            } else {
                shortlogTag.innerHTML = "登录失败";
            }
        }
    }
};
//手机验证码倒计时开始
var changepwd = document.getElementById("changepwd");
var changenum = document.getElementById("changenum");
changepwd.onclick = function () {
    var value = shortlogUname.value;

    if(checkPhone(value)) {
        changepwd.innerHTML = " 秒后重新获取";
        changenum.innerHTML = 10;
        changenum.style.color = "#666";
        var changetime = setInterval(function () {
            if (changenum.innerHTML == 0) {
                changenum.innerHTML = null;
                changepwd.innerHTML = "获取动态密码";
                clearInterval(changetime);
                return false;
            }
            if (changenum.innerHTML > 6) {
                //alert("5miao")
                changenum.style.color = "#666";
            } else {
                changenum.style.color = "red";
            }
            changenum.innerHTML--;
        }, 1000);
    }
};
//手机验证码倒计时结束
function getMessages(username){
    shortlogTag.innerHTML = "登录成功";
    localStorage.getItem(username);
    yi.innerHTML = "你好啊!  "+username;
    er.style.display = "none";

    setTimeout(function close(){
        maskLog.style.display = "none";
        logShow.style.display = "none";
    },3000);
}

//检测手机号码格式是否正确
function checkPhone(num){

    if(!(/^1(3|4|5|7|8)\d{9}$/.test(num))){
        alert("手机号码有误，请重填");
        return false;
    }else{return true;}
}




//            快捷登录js部分设置结束