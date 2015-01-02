module App {
    export interface IMoviesScope extends ng.IScope {
        vm: MoviesCtrl;
    }

    export class MoviesCtrl {
        static $inject = [
            '$scope',
            'movieService',
            'messageBusService'
        ];
    
        constructor(
            private $scope           : IMoviesScope,
            public  movieService     : Services.MovieService,
            private messageBusService: Services.MessageBusService) {
            $scope.vm = this;
        }

        get collection(): Models.ICollection {
            return this.movieService.collection;
        }

        get collections(): Models.ICollection[] {
            return this.movieService.collections;
        }


    }
}