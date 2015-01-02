module App {
    'use strict';

    import IProject = Models.ICollection;

    // TODO For setting the current culture for string formatting (note you need to include public/js/cs/stringformat.YOUR-CULTURE.js. See sffjs.1.09.zip for your culture.) 
    declare var sffjs;

    export interface IAppScope extends ng.IScope {
        vm: AppCtrl;
    }

    export class AppCtrl {
        // $inject annotation.
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        static $inject = [
            '$scope',
            'movieService',
            'messageBusService'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope            : IAppScope,
            private movieService      : Services.MovieService,
            private $messageBusService: Services.MessageBusService
        ) {
            sffjs.setCulture('nl-NL');

            $scope.vm = this;
        }

        get collections(): Models.ICollection[] {
            return this.movieService.collections;
        }

        get collection(): Models.ICollection {
            return this.movieService.collection;
        }

        openCollection(collection?: Models.ICollection) {
            this.movieService.openCollection(collection);
        }
    }
}
