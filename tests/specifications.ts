describe('The movie service', () => {
    beforeEach(() => {
        this.movieService = new Services.MovieService(null, null);
        this.movieService.collections = [
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

    it('should report the correct collection title when a collection is loaded', () => {
        this.movieService.openCollection({
            title: 'test',
            path: ''
        });

        expect(this.movieService.collection.title).toBe('test');
    });

    it('should add an opened collection to its list of collections', () => {
        this.movieService.openCollection({
            title: 'test',
            path: ''
        });

        expect(this.movieService.collections[this.movieService.collections.length-1].title).toBe('test');
    });

    it('should open the first collection when started for the first time', () => {
        this.movieService.openCollection();
        expect(this.movieService.collection.title).toBe('movies');
    });

    it('should add a new collection to the list of all collections', () => {
        var newCollection: Models.ICollection = {
            title: 'test',
            path: ''
        }
        expect(this.movieService.collections.length).toBe(2);

        this.movieService.openCollection(newCollection);
        expect(this.movieService.collection.title).toBe('test');
        this.movieService.openCollection(this.movieService.collections[1]);
        expect(this.movieService.collections.length).toBe(3);
    });
});