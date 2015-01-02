/// <reference path="AppCtrl.ts" />

module App {
    'use strict';
    // Start the application
    angular.module('m3App', [
            'ngRoute',
            'ui.bootstrap',
            'LocalStorageModule',
            'pascalprecht.translate',
            'btford.socket-io'
        ])
        .config(localStorageServiceProvider => {
            localStorageServiceProvider.prefix = 'm3';
        })
        .config($translateProvider => {
            // TODO ADD YOUR LOCAL TRANSLATIONS HERE, OR ALTERNATIVELY, CHECK OUT 
            // http://angular-translate.github.io/docs/#/guide/12_asynchronous-loading
            // Translations.English.locale['MAP_LABEL'] = 'MY AWESOME MAP';
            $translateProvider.translations('en', Translations.English.locale);
            $translateProvider.translations('nl', Translations.Dutch.locale);
            $translateProvider.preferredLanguage('en');
        })
        .controller('LanguageCtrl', ($scope, $translate) => {
            $scope.changeLanguage = key => {
                $translate.use(key);
            };
        })
        .factory('socket', function (socketFactory) {
            var socket = socketFactory();
            socket.forward('broadcast');
            return socket;
        })
        //.factory('socket', function ($rootScope) {
        //    var socket = require('socket.io-client').connect();
        //    return {
        //        on: function (eventName, callback) {
        //            socket.on(eventName, function () {
        //                var args = arguments;
        //                $rootScope.$apply(function () {
        //                    callback.apply(socket, args);
        //                });
        //            });
        //        },
        //        emit: function (eventName, data, callback) {
        //            socket.emit(eventName, data, function () {
        //                var args = arguments;
        //                $rootScope.$apply(function () {
        //                    if (callback) {
        //                        callback.apply(socket, args);
        //                    }
        //                });
        //            })
        //        }   
        //    };
        //})
        .service('movieService', Services.MovieService)
        .service('messageBusService', Services.MessageBusService)
        .controller('appCtrl', AppCtrl)
        // Example switching the language (see http://angular-translate.github.io/).
        // <div ng-controller="Ctrl" class="ng-scope">
        //    <button class="btn ng-scope" ng-click="changeLanguage('en')" translate="BUTTON_LANG_EN"></button>
        //    <button class="btn ng-scope" ng-click="changeLanguage('de')" translate="BUTTON_LANG_DE"></button>
        // </div>
        .config(($routeProvider) => {
            $routeProvider
                .when('/', {
                    controller: MoviesCtrl,
                    templateUrl: 'app/views/movies/movies.html'
                })
                .when('/movie/:movieId', {
                    controller: MovieCtrl,
                    templateUrl: function (params) { return 'app/views/movie/movie.html?movieId=' + params.user_id; }
                })
                .otherwise({ redirectTo: '/' });
            //$locationProvider.html5Mode(true);
        });
    //.config(($stateProvider, $urlRouterProvider) => {
    //    // For any unmatched url, send to /
    //    $urlRouterProvider.otherwise('/');
    //    $stateProvider
    //        .state('overview', {
    //            url: '/',
    //            templateUrl: 'app/views/movies/movies.html'
    //        })
    //        .state('movie', {
    //            url: '/movie/:movieId',
    //            template: '<div><pre>' + params.movieId + '</pre></div>'
    //        });
    //});
}