/**
 * Created by wenyuan on 16/10/25.
 */

// 数据配置

// route 路由 $provider 服务提供商

// route 在不改变网页的引用的情况下 改变模板的调用 传入的信号不一样出现的结果不一样
// $provider 提供路由需要切换的信号

var mdModule = angular.module("app.movieDetail",[]);

mdModule.controller("MovieDetailController",
    ['$scope','URLConfig','$http','$rootScope','$route','$routeParams',
    function ($scope,URLConfig,$http,$rootScope,$route,$routeParams) {
        var appurl = URLConfig.appURL;

        var movieId = $routeParams.movieId;

        var url = appurl + 'subject/' + movieId + "?callback=movieDetailCallBack";

        $http.jsonp(url).error(function () {

        });

        window.movieDetailCallBack = function (jsonData) {
            $scope.movie = jsonData;
        }
    }]);

