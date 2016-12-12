/**
 * Created by Administrator on 2016/10/20.
 */

//全局变量声明
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var cwidth = 400;
var cheight = 600;
var birds = ['images/0.gif','images/1.gif','images/2.gif'];
var birdIndex = 0;//小鸟的图片索引
var velocity = 8;//水管移动的速度
var pipe_height = 200; //水管之间的间距
var gravity = 2;//小鸟掉落的速度
var score = 0; //得分
var isScore = false;//是否开启得分模式
var isOver = false;//游戏是否结束
var ver1 = 10;
var ver2;
//定时器
var tid; //定时器的标识

//页面布局
//背景制作
function Background (x,y,width,height,src) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    //图片处理和上面的处理不一样
    var image = new Image();
    image.src = src;
    this.image = image;
    this.draw = bgDraw;
}
function bgDraw() {
    context.drawImage(this.image,this.x,this.y,this.width,this.height);
}
//上方水管
function UpPipe (x,y,width,height,src) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    //图片处理和上面的处理不一样
    var image = new Image();
    image.src = src;
    this.image = image;
    this.draw = upPipeDraw;
}
function upPipeDraw() {
    context.drawImage(this.image,160,490,130,800,this.x,this.y,this.width,this.height);
}
//下方水管
function DownPipe (x,y,width,height,src) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    //图片处理和上面的处理不一样
    var image = new Image();
    image.src = src;
    this.image = image;
    this.draw = downPipeDraw;
}
function downPipeDraw() {
    context.drawImage(this.image,10,475,130,800,this.x,this.y,this.width,this.height);
}
//小鸟
function Bird (x,y,width,height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.draw = birdDraw;
}
function birdDraw() {
    birdIndex++;
    var image = new Image();
    image.src = birds[birdIndex%3];
    context.drawImage(image,this.x,this.y,this.width,this.height);
}
//创建对象
//创建背景对象
var back = new Background(0,0,400,600,'images/bg.png');
var groundBack = new Background(0,550,400,600,'images/ground.png');
var upPipe = new UpPipe(0,0,100,200,'images/pipe.png');
var downPipe = new DownPipe(0,400,100,150,'images/pipe.png');
var bird = new Bird(80,300,40,40);
//游戏规则
//死掉的条件
function calculator() {
    //判断死亡的三个条件
    //撞地面 撞上水管 下水管
    var groundCondition = bird.y + bird.height >= groundBack.y;
    var upPipeCondition = ((bird.x + bird.width >= upPipe.x) && (bird.x + bird.width <= upPipe.x + upPipe.width) && (bird.y > upPipe.y) && (bird.y <= upPipe.y + upPipe.height)) || ((bird.x >= upPipe.x)&&(bird.x <= upPipe.x + upPipe.width)&&(bird.y >= upPipe.y) && (bird.y <=upPipe.y + upPipe.height));
    var downPipeCondition = ((bird.x + bird.width >= downPipe.x)&& (bird.x + bird.width <= downPipe.x + downPipe.width)&&(bird.y + bird.height > downPipe.y) &&(bird.y + bird.height <= downPipe.y + downPipe.height))||((bird.x >= downPipe.x) && (bird.x <= downPipe.x + downPipe.width) && (bird.y + bird.height >= downPipe.y) &&(bird.y + bird.height <= downPipe.y + downPipe.height));
    if(groundCondition || upPipeCondition || downPipeCondition)
    {
        //停止定时器
        clearInterval(tid);
        context.fillStyle = "#ffffff";
        context.font = "30px Accent";
        context.fillText("你得了" + score + "分",100,100);
        isOver = true;
        return;
    }

    ver2 = ver1 + gravity;
    bird.y += (ver1 + ver2) * 0.5;
    if(upPipe.x + upPipe.width > 0)
    {
        upPipe.x -= velocity;
        downPipe.x -= velocity;
    }else{
        upPipe.x = 400;
        downPipe.x = 400;

        upPipe.height = 100 + Math.random()*200;
        downPipe.y = upPipe.height + pipe_height;
        downPipe.height = 600 - downPipe.y - 50;

        isScore = true;
    }

    if(isScore && bird.x > upPipe.x + upPipe.width)
    {
        score++;
        if (score>0 && score % 3 == 0)
        {
            velocity += 5;
            gravity += 2;
        }
        //这里需要写点东西
        isScore = false;
    }
    //小鸟运动
    //水管运动
    //分数计算
}

//其他配置 浏览器兼容 页面初始化 重新开始游戏
function keyUp(e) {
    e = e || event;
    var currentKey = e.keyCode || e.which || e.charCode;
    switch(currentKey)
    {
        case 32:
            bird.y -= 80;
            break;
    }
}
function reAction() {
    if(isOver)
    {
        isOver = false;
        window.location.reload();
    }
}

function init () {
    //获取canvas对象
    var canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    document.onkeyup = keyUp;
    document.onclick = reAction;
    //配置属性
    tid = setInterval(drawWall,80);
}

function drawWall() {
    context.clearRect(0,0,cwidth,cheight);
    //绘制函数的调用
    back.draw();
    groundBack.draw();
    upPipe.draw();
    downPipe.draw();
    bird.draw();
    calculator();
}



