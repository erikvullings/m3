'use strict';
module Services {
    import ICollection = Models.ICollection;

    /*
     * Singleton service that holds a reference to the movie collection. 
     */
    export class MovieService {
        collections: ICollection[] = [];
        collection : ICollection;
        movies: Models.IMovie[];

        filterKeywords: string;
        orderPredicate = 'title';
        orderDirection = false;

        static $inject = [
            '$http',
            'messageBusService',
            'socket'
        ];

        constructor(
            private $http: ng.IHttpService,
            private $messageBusService: MessageBusService,
            private $socket: SocketIOClient.Socket) {
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
                path : ''
            });

            this.collection = this.collections[0];

            $socket.emit('message', 'MovieService', 'Hello world');

            $http.get('/data/movies.json').success((movies: Models.IMovie[]) => {
                this.movies = movies;
                this.collections.forEach((collection) => {
                    collection.movies = [];
                    this.movies.forEach((movie) => {
                        if (movie.collection === collection.title)
                            collection.movies.push(movie);
                    });
                });
                this.collections[0].movies = movies;
            });
            
        }

        openCollection(collection?: ICollection) {
            if (this.collection === collection) return;
            var collections = this.collections;
            if (typeof collection !== 'undefined' && collection != null) {
                var found = false;
                for (var i = 0; i < collections.length; i++) {
                    var curCol = collections[i];
                    if (curCol.title === collection.title && curCol.path === collection.path)
                        found = true;
                }
                if (!found) collections.push(collection);
                this.collection = collection;
            } else if (collections.length > 0)
                this.collection = collections[0];
        }

        getMovieById(movieId: number) {
            var movies = this.movies;
            for (var i = 0; i < movies.length; i++) {
                var movie = movies[i];
                if (movie.id !== movieId) continue;
                return movie;
            }
            return null;
        }
    }
}