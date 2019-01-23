/**
 * Created by wenyuan on 16/10/25.
 */

// 数据解析

// 配置到界面上

// 区分条目

// 下一页的配置

// 点击a标签进入到详情页面 模块的跳转

//    MVC
    
    var mlmodule = angular.module("app.movieList",[]);

// 首先分清楚这个控制器当中需要做那些事
// $scope 配置界面上的区域里面的东西
// URLConfig 链接API接口 获取数据
// $routeParams 一个路由参数
// $rootScope 根块
// $http 通过网络获取数据的协议

    console.log(mlmodule);

    mlmodule.controller('MovieListController',
        ['$scope','URLConfig','$routeParams','$http','$rootScope','$route',
            function ($scope,$URLConfig,$routeParams,$http,$rootScope,$route) {

                //配置见面显示的个数 和 获取数据的api
                var count = $URLConfig.page_size || 20;
                var appurl = $URLConfig.appURL;

                //  获取分类的类型
                var type = $routeParams.type || 'in_theaters';
                var page = $routeParams.page || 1;

                $scope.currentPage = page;
                $scope.type = type;
                $scope.loading = true;
                $scope.size = count;

                // 请求数据 我需要一个接口 这个接口必须是一个完整的接口
                var url = appurl + type + '?count=' + count +"&start="
                    + page + "&callback=movieListCallBack";

                console.log(url);

                $http.jsonp(url).error(function () {
                    // console.log("请求失败");
                });

                window.movieListCallBack = function (jsonData) {
                    console.log("进来了么?");
                    console.log(jsonData);

                    $scope.title = jsonData.title;
                    $scope.total = jsonData.total;
                    $scope.movies = jsonData.subjects;

                    $scope.loading = false;
                }

                $scope.$watch("currentPage",function (newValue,oldValue) {
                    console.log("第" + newValue + "页");
                    console.log("第" + oldValue + "页");

                    if(newValue !== oldValue)
                    {
                        $scope.updateParams({
                            page : newValue
                        })
                    }
                })
            }]);





