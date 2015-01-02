var Models;
(function (Models) {
    'use strict';
})(Models || (Models = {}));
var Services;
(function (Services) {
    // Handle returned when subscribing to a topic
    var MessageBusHandle = (function () {
        function MessageBusHandle(topic, callback) {
            this.topic = topic;
            this.callback = callback;
        }
        return MessageBusHandle;
    })();
    Services.MessageBusHandle = MessageBusHandle;
    /**
     * Simple message bus service, used for subscribing and unsubsubscribing to topics.
     * @see {@link https://gist.github.com/floatingmonkey/3384419}
     */
    var MessageBusService = (function () {
        function MessageBusService() {
            PNotify.prototype.options.styling = 'fontawesome';
        }
        /**
         * Publish a notification
         * @title: the title of the notification
         * @text:  the contents of the notification
         */
        MessageBusService.prototype.notify = function (title, text) {
            var options = {
                title: title,
                text: text,
                icon: 'fa fa-info',
                cornerclass: 'ui-pnotify-sharp',
                addclass: 'stack-bottomright',
                stack: { "dir1": 'up', "dir2": 'left', "firstpos1": 25, "firstpos2": 25 }
            };
            var pn = new PNotify(options);
        };
        /**
         * Show a confirm dialog
         * @title           : the title of the notification
         * @text            : the contents of the notification
         * @callback        : the callback that will be called after the confirmation has been answered.
         */
        MessageBusService.prototype.confirm = function (title, text, callback) {
            var options = {
                title: title,
                text: text,
                hide: false,
                confirm: {
                    confirm: true
                },
                buttons: {
                    closer: false,
                    sticker: false
                },
                history: {
                    history: false
                },
                icon: 'fa fa-question-circle',
                cornerclass: 'ui-pnotify-sharp',
                addclass: 'stack-topright',
                stack: { "dir1": 'down', "dir2": 'left', "firstpos1": 25, "firstpos2": 25 }
            };
            var pn = new PNotify(options).get().on('pnotify.confirm', function () {
                callback(true);
            }).on('pnotify.cancel', function () {
                callback(false);
            });
        };
        MessageBusService.prototype.notifyBottom = function (title, text) {
            var stack_bar_bottom = { "dir1": 'up', "dir2": 'right', "spacing1": 0, "spacing2": 0 };
            var options = {
                title: 'Over Here',
                text: 'Check me out. I\'m in a different stack.',
                addclass: 'stack-bar-bottom',
                cornerclass: '',
                width: '70%',
                stack: stack_bar_bottom
            };
            var pn = new PNotify(options);
        };
        /**
         * Publish a notification
         * @title: the title of the notification
         * @text:  the contents of the notification
         */
        MessageBusService.prototype.notifyData = function (data) {
            var pn = new PNotify(data);
            //this.publish("notify", "", data);
        };
        /**
         * Publish to a topic
         */
        MessageBusService.prototype.publish = function (topic, title, data) {
            //window.console.log("publish: " + topic + ", " + title);
            if (!MessageBusService.cache[topic])
                return;
            MessageBusService.cache[topic].forEach(function (cb) { return cb(title, data); });
        };
        //public publish(topic: string, title: string, data?: any): void {
        //	MessageBusService.publish(topic, title, data);
        //}
        /**
         * Subscribe to a topic
         * @param {string} topic The desired topic of the message.
         * @param {IMessageBusCallback} callback The callback to call.
         */
        MessageBusService.prototype.subscribe = function (topic, callback) {
            if (!MessageBusService.cache[topic])
                MessageBusService.cache[topic] = new Array();
            MessageBusService.cache[topic].push(callback);
            return new MessageBusHandle(topic, callback);
        };
        //public subscribe(topic: string, callback: IMessageBusCallback): MessageBusHandle {            
        //	return MessageBusService.subscribe(topic, callback);
        //}
        /**
         * Unsubscribe to a topic by providing its handle
         */
        MessageBusService.prototype.unsubscribe = function (handle) {
            var topic = handle.topic;
            var callback = handle.callback;
            if (!MessageBusService.cache[topic])
                return;
            MessageBusService.cache[topic].forEach(function (cb, idx) {
                if (cb === callback) {
                    MessageBusService.cache[topic].splice(idx, 1);
                    return;
                }
            });
        };
        MessageBusService.cache = {};
        return MessageBusService;
    })();
    Services.MessageBusService = MessageBusService;
    var EventObj = (function () {
        function EventObj() {
        }
        // Events primitives ======================
        EventObj.prototype.bind = function (event, fct) {
            this.myEvents = this.myEvents || {};
            this.myEvents[event] = this.myEvents[event] || [];
            this.myEvents[event].push(fct);
        };
        EventObj.prototype.unbind = function (event, fct) {
            this.myEvents = this.myEvents || {};
            if (!(event in this.myEvents))
                return;
            this.myEvents[event].splice(this.myEvents[event].indexOf(fct), 1);
        };
        EventObj.prototype.unbindEvent = function (event) {
            this.myEvents = this.myEvents || {};
            this.myEvents[event] = [];
        };
        EventObj.prototype.unbindAll = function () {
            this.myEvents = this.myEvents || {};
            for (var event in this.myEvents)
                this.myEvents[event] = false;
        };
        EventObj.prototype.trigger = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.myEvents = this.myEvents || {};
            if (!(event in this.myEvents))
                return;
            for (var i = 0; i < this.myEvents[event].length; i++) {
                this.myEvents[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        };
        EventObj.prototype.registerEvent = function (evtname) {
            this[evtname] = function (callback, replace) {
                if (typeof callback == 'function') {
                    if (replace)
                        this.unbindEvent(evtname);
                    this.bind(evtname, callback);
                }
                return this;
            };
        };
        EventObj.prototype.registerEvents = function (evtnames) {
            var _this = this;
            evtnames.forEach(function (evtname) {
                _this.registerEvent(evtname);
            });
        };
        return EventObj;
    })();
    Services.EventObj = EventObj;
})(Services || (Services = {}));
'use strict';
var Services;
(function (Services) {
    /*
     * Singleton service that holds a reference to the movie collection.
     */
    var MovieService = (function () {
        function MovieService($http, $messageBusService, $socket) {
            var _this = this;
            this.$http = $http;
            this.$messageBusService = $messageBusService;
            this.$socket = $socket;
            this.collections = [];
            this.orderPredicate = 'title';
            this.orderDirection = false;
            this.collections.push({
                title: 'all',
                path: ''
            });
            this.collections.push({
                title: 'movies',
                path: ''
            });
            this.collections.push({
                title: 'kids',
                path: ''
            });
            this.collection = this.collections[0];
            $socket.emit('message', 'MovieService', 'Hello world');
            $http.get('/data/movies.json').success(function (movies) {
                _this.movies = movies;
                _this.collections.forEach(function (collection) {
                    collection.movies = [];
                    _this.movies.forEach(function (movie) {
                        if (movie.collection === collection.title)
                            collection.movies.push(movie);
                    });
                });
                _this.collections[0].movies = movies;
            });
        }
        MovieService.prototype.openCollection = function (collection) {
            if (this.collection === collection)
                return;
            var collections = this.collections;
            if (typeof collection !== 'undefined' && collection != null) {
                var found = false;
                for (var i = 0; i < collections.length; i++) {
                    var curCol = collections[i];
                    if (curCol.title === collection.title && curCol.path === collection.path)
                        found = true;
                }
                if (!found)
                    collections.push(collection);
                this.collection = collection;
            }
            else if (collections.length > 0)
                this.collection = collections[0];
        };
        MovieService.prototype.getMovieById = function (movieId) {
            var movies = this.movies;
            for (var i = 0; i < movies.length; i++) {
                var movie = movies[i];
                if (movie.id !== movieId)
                    continue;
                return movie;
            }
            return null;
        };
        MovieService.$inject = [
            '$http',
            'messageBusService',
            'socket'
        ];
        return MovieService;
    })();
    Services.MovieService = MovieService;
})(Services || (Services = {}));
var Translations;
(function (Translations) {
    var English = (function () {
        function English() {
        }
        English.locale = {
            CANCEL_BTN: 'Cancel',
            OK_BTN: 'OK',
            SEARCH: 'Search'
        };
        return English;
    })();
    Translations.English = English;
})(Translations || (Translations = {}));
var Translations;
(function (Translations) {
    var Dutch = (function () {
        function Dutch() {
        }
        Dutch.locale = {
            CANCEL_BTN: 'Annuleren',
            OK_BTN: 'OK',
            SEARCH: 'Zoeken'
        };
        return Dutch;
    })();
    Translations.Dutch = Dutch;
})(Translations || (Translations = {}));
var App;
(function (App) {
    var MovieCtrl = (function () {
        function MovieCtrl($scope, $routeParams, movieService, messageBusService) {
            this.$scope = $scope;
            this.$routeParams = $routeParams;
            this.movieService = movieService;
            this.messageBusService = messageBusService;
            $scope.vm = this;
            console.log($routeParams);
            if (typeof $routeParams == 'undefined' || $routeParams == null || $routeParams.movieId == null)
                return;
            var movieId = +$routeParams.movieId;
            this.movie = movieService.getMovieById(movieId);
        }
        Object.defineProperty(MovieCtrl.prototype, "collections", {
            get: function () {
                return this.movieService.collections;
            },
            enumerable: true,
            configurable: true
        });
        MovieCtrl.$inject = [
            '$scope',
            '$routeParams',
            'movieService',
            'messageBusService'
        ];
        return MovieCtrl;
    })();
    App.MovieCtrl = MovieCtrl;
})(App || (App = {}));
var App;
(function (App) {
    var MoviesCtrl = (function () {
        function MoviesCtrl($scope, movieService, messageBusService) {
            this.$scope = $scope;
            this.movieService = movieService;
            this.messageBusService = messageBusService;
            $scope.vm = this;
        }
        Object.defineProperty(MoviesCtrl.prototype, "collection", {
            get: function () {
                return this.movieService.collection;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoviesCtrl.prototype, "collections", {
            get: function () {
                return this.movieService.collections;
            },
            enumerable: true,
            configurable: true
        });
        MoviesCtrl.$inject = [
            '$scope',
            'movieService',
            'messageBusService'
        ];
        return MoviesCtrl;
    })();
    App.MoviesCtrl = MoviesCtrl;
})(App || (App = {}));
var App;
(function (App) {
    'use strict';
    var AppCtrl = (function () {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        function AppCtrl($scope, movieService, $messageBusService) {
            this.$scope = $scope;
            this.movieService = movieService;
            this.$messageBusService = $messageBusService;
            sffjs.setCulture('nl-NL');
            $scope.vm = this;
        }
        Object.defineProperty(AppCtrl.prototype, "collections", {
            get: function () {
                return this.movieService.collections;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppCtrl.prototype, "collection", {
            get: function () {
                return this.movieService.collection;
            },
            enumerable: true,
            configurable: true
        });
        AppCtrl.prototype.openCollection = function (collection) {
            this.movieService.openCollection(collection);
        };
        // $inject annotation.
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        AppCtrl.$inject = [
            '$scope',
            'movieService',
            'messageBusService'
        ];
        return AppCtrl;
    })();
    App.AppCtrl = AppCtrl;
})(App || (App = {}));
/// <reference path="AppCtrl.ts" />
var App;
(function (App) {
    'use strict';
    // Start the application
    angular.module('m3App', [
        'ngRoute',
        'ui.bootstrap',
        'LocalStorageModule',
        'pascalprecht.translate',
        'btford.socket-io'
    ]).config(function (localStorageServiceProvider) {
        localStorageServiceProvider.prefix = 'm3';
    }).config(function ($translateProvider) {
        // TODO ADD YOUR LOCAL TRANSLATIONS HERE, OR ALTERNATIVELY, CHECK OUT 
        // http://angular-translate.github.io/docs/#/guide/12_asynchronous-loading
        // Translations.English.locale['MAP_LABEL'] = 'MY AWESOME MAP';
        $translateProvider.translations('en', Translations.English.locale);
        $translateProvider.translations('nl', Translations.Dutch.locale);
        $translateProvider.preferredLanguage('en');
    }).controller('LanguageCtrl', function ($scope, $translate) {
        $scope.changeLanguage = function (key) {
            $translate.use(key);
        };
    }).factory('socket', function (socketFactory) {
        var socket = socketFactory();
        socket.forward('broadcast');
        return socket;
    }).service('movieService', Services.MovieService).service('messageBusService', Services.MessageBusService).controller('appCtrl', App.AppCtrl).config(function ($routeProvider) {
        $routeProvider.when('/', {
            controller: App.MoviesCtrl,
            templateUrl: 'app/views/movies/movies.html'
        }).when('/movie/:movieId', {
            controller: App.MovieCtrl,
            templateUrl: function (params) {
                return 'app/views/movie/movie.html?movieId=' + params.user_id;
            }
        }).otherwise({ redirectTo: '/' });
        //$locationProvider.html5Mode(true);
    });
})(App || (App = {}));
//# sourceMappingURL=m3.js.map