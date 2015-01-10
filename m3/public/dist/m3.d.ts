declare module App {
    interface IMovieScope extends ng.IScope {
        vm: MovieCtrl;
    }
    class MovieCtrl {
        private $scope;
        private $routeParams;
        private movieService;
        private messageBusService;
        movie: Models.IMovie;
        static $inject: string[];
        constructor($scope: IMovieScope, $routeParams: any, movieService: Services.MovieService, messageBusService: Services.MessageBusService);
        collections: Models.ICollection[];
    }
}
declare module Models {
    interface IEmployee {
        id: number;
        name: string;
        castId: number;
        creditId: string;
        profilePath: string;
    }
    interface ICast extends IEmployee {
        character: string;
        order: number;
    }
    interface ICrew extends IEmployee {
        department: string;
        job: string;
    }
    interface ICastCrew {
        cast: ICast[];
        crew: ICrew[];
    }
    interface IPersonInfo {
        adult: boolean;
        alsoKnownAs: string[];
        biography: string;
        birthday: Date;
        deathday: Date;
        homepage: string;
        id: number;
        imbdId: string;
        name: string;
        placeOfBirth: any;
        popularity: number;
        profilePath: string;
    }
    interface IGenre {
        id: number;
        name: string;
    }
    interface IProductionCompany {
        id: number;
        name: string;
    }
    interface IProductionCountry {
        iso31661: number;
        name: string;
    }
    interface ISpokenLanguage {
        iso6391: number;
        name: string;
    }
    interface IMovie {
        collection: string;
        adult: boolean;
        backdropPath: string;
        belongsToCollection: any;
        budget: number;
        genres: IGenre[];
        homepage: string;
        id: number;
        imdbId: number;
        originalTitle: string;
        overview: string;
        popularity: number;
        posterPath: string;
        productionCompanies: IProductionCompany[];
        productionCountries: IProductionCountry[];
        releaseDate: Date;
        revenue: number;
        runtime: number;
        spokenLanguages: ISpokenLanguage[];
        status: string;
        tagline: string;
        title: string;
        voteAverage: number;
        voteCount: number;
        videoFile: string;
        castCrew: ICastCrew;
    }
}
declare module Models {
    interface ICollection {
        title: string;
        path: string;
        movies?: IMovie[];
    }
}
declare module Translations {
    class English {
        static locale: ng.translate.ITranslationTable;
    }
}
declare module Translations {
    class Dutch {
        static locale: ng.translate.ITranslationTable;
    }
}
declare module Services {
    interface IMessageBusCallback {
        (title: string, data?: any): any;
    }
    class MessageBusHandle {
        constructor(topic: string, callback: IMessageBusCallback);
        topic: string;
        callback: IMessageBusCallback;
    }
    /**
     * Simple message bus service, used for subscribing and unsubsubscribing to topics.
     * @see {@link https://gist.github.com/floatingmonkey/3384419}
     */
    class MessageBusService {
        private static cache;
        constructor();
        /**
         * Publish a notification
         * @title: the title of the notification
         * @text:  the contents of the notification
         */
        notify(title: string, text: string): void;
        /**
         * Show a confirm dialog
         * @title           : the title of the notification
         * @text            : the contents of the notification
         * @callback        : the callback that will be called after the confirmation has been answered.
         */
        confirm(title: string, text: string, callback: (result: boolean) => any): void;
        notifyBottom(title: string, text: string): void;
        /**
         * Publish a notification
         * @title: the title of the notification
         * @text:  the contents of the notification
         */
        notifyData(data: any): void;
        /**
         * Publish to a topic
         */
        publish(topic: string, title: string, data?: any): void;
        /**
         * Subscribe to a topic
         * @param {string} topic The desired topic of the message.
         * @param {IMessageBusCallback} callback The callback to call.
         */
        subscribe(topic: string, callback: IMessageBusCallback): MessageBusHandle;
        /**
         * Unsubscribe to a topic by providing its handle
         */
        unsubscribe(handle: MessageBusHandle): void;
    }
    class EventObj {
        myEvents: any;
        constructor();
        bind(event: any, fct: any): void;
        unbind(event: any, fct: any): void;
        unbindEvent(event: any): void;
        unbindAll(): void;
        trigger(event: any, ...args: any[]): void;
        registerEvent(evtname: string): void;
        registerEvents(evtnames: string[]): void;
    }
}
declare module Services {
    import ICollection = Models.ICollection;
    class MovieService {
        private $http;
        private $messageBusService;
        private $socket;
        collections: ICollection[];
        collection: ICollection;
        movies: Models.IMovie[];
        filterKeywords: string;
        orderPredicate: string;
        orderDirection: boolean;
        static $inject: string[];
        constructor($http: ng.IHttpService, $messageBusService: MessageBusService, $socket: SocketIOClient.Socket);
        openCollection(collection?: ICollection): void;
        getMovieById(movieId: number): Models.IMovie;
    }
}
declare module App {
    interface IMoviesScope extends ng.IScope {
        vm: MoviesCtrl;
    }
    class MoviesCtrl {
        private $scope;
        movieService: Services.MovieService;
        private messageBusService;
        static $inject: string[];
        constructor($scope: IMoviesScope, movieService: Services.MovieService, messageBusService: Services.MessageBusService);
        collection: Models.ICollection;
        collections: Models.ICollection[];
    }
}
declare module App {
    import IProject = Models.ICollection;
    interface IAppScope extends ng.IScope {
        vm: AppCtrl;
    }
    class AppCtrl {
        private $scope;
        private movieService;
        private $messageBusService;
        static $inject: string[];
        constructor($scope: IAppScope, movieService: Services.MovieService, $messageBusService: Services.MessageBusService);
        collections: IProject[];
        collection: IProject;
        openCollection(collection?: IProject): void;
    }
}
declare module App {
}
