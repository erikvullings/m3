var _this = this;
describe('The movie service', function () {
    beforeEach(function () {
        _this.movieService = new Services.MovieService(null, null);
        _this.movieService.collections = [
            {
                title: 'movies',
                path: ''
            },
            {
                title: 'kids',
                path: ''
            }
        ];
    });
    it('should report the correct collection title when a collection is loaded', function () {
        _this.movieService.openCollection({
            title: 'test',
            path: ''
        });
        expect(_this.movieService.collection.title).toBe('test');
    });
    it('should add an opened collection to its list of collections', function () {
        _this.movieService.openCollection({
            title: 'test',
            path: ''
        });
        expect(_this.movieService.collections[_this.movieService.collections.length - 1].title).toBe('test');
    });
    it('should open the first collection when started for the first time', function () {
        _this.movieService.openCollection();
        expect(_this.movieService.collection.title).toBe('movies');
    });
    it('should add a new collection to the list of all collections', function () {
        var newCollection = {
            title: 'test',
            path: ''
        };
        expect(_this.movieService.collections.length).toBe(2);
        _this.movieService.openCollection(newCollection);
        expect(_this.movieService.collection.title).toBe('test');
        _this.movieService.openCollection(_this.movieService.collections[1]);
        expect(_this.movieService.collections.length).toBe(3);
    });
});
//# sourceMappingURL=specifications.js.map