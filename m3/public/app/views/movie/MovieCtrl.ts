module App {
    export interface IMovieScope extends ng.IScope {
        vm: MovieCtrl;
    }

    export class MovieCtrl {
        movie: Models.IMovie;

        static $inject = [
            '$scope',
            '$routeParams',
            'movieService',
            'messageBusService'
        ];

        constructor(
            private $scope: IMovieScope,
            private $routeParams: any,
            private movieService: Services.MovieService,
            private messageBusService: Services.MessageBusService) {
            $scope.vm = this;

            console.log($routeParams);
            if (typeof $routeParams == 'undefined' || $routeParams == null || $routeParams.movieId == null) return;
            var movieId = +$routeParams.movieId;
            this.movie = movieService.getMovieById(movieId);
        }

        get collections(): Models.ICollection[] {
            return this.movieService.collections;
        }
    }
}