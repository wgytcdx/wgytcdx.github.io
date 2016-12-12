/**
 * Created by wenyuan on 16/10/25.
 */

// 整体模块的定义

// 对于module的第二个参数 其含义为该模块依赖模块

    //  app 要生成 必须依赖模块都是存在的 如果依赖模块不存在
//     app生成失败
//    生产一瓶水 瓶子 水
var app = angular.module('app',[
    'ngRoute',
    'app.movieList',
    'app.movieDetail',
    'ui.bootstrap'
]);

// 选择指令
app.directive('selectLink',[function () {
    console.log("能不能出来");
    var item = [];
    return {
        restrict:'A',
        link: function (scope,element,attr) {
            item.push(element);
            //事件绑定
            element.bind('click',function (e) {
                item.forEach(function (item) {
                    if(item === element)
                    {
                        item.parent().addClass("active");
                    }else{
                        item.parent().removeClass("active");
                    }
                })
            })
        }
    }
}]);

// 数据加载 
// app.config

app.config(['$routeProvider',function ($routeProvider) {

//  when 需要注入的模板等 otherwise default 默认加载的功能
    $routeProvider.when('/detail/:movieId',{
        controller:'MovieDetailController',
        //导入的模板路径
        templateUrl:'movie/movie-detail.html'
    }).when('/:type/:page?',{
        controller:'MovieListController',
        templateUrl:'movie/movie-list.html'
    }).otherwise({
        redirectTo:'/in_theaters/1'
    })
}]);

app.constant('URLConfig',{
    page_size:20,
    appURL:"https://api.douban.com/v2/movie/"
});

