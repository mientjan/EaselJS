define(["require", "exports", '../../createts/util/HttpRequest', '../../createts/util/Promise', './flump/FlumpMovieData', './flump/FlumpTextureGroup', './flump/FlumpMovie', "../data/Queue"], function (require, exports, HttpRequest_1, Promise_1, FlumpMovieData_1, FlumpTextureGroup_1, FlumpMovie_1, Queue_1) {
    var FlumpLibrary = (function () {
        function FlumpLibrary(basePath) {
            this.movieData = [];
            this.textureGroups = [];
            this.fps = 0;
            this.isOptimised = false;
            this._hasLoaded = false;
            this._isLoading = false;
            if (basePath) {
                this.url = basePath;
            }
        }
        FlumpLibrary.load = function (url, flumpLibrary, onProcess) {
            var baseDir = url;
            if (url.indexOf('.json') > -1) {
                baseDir = url.substr(0, url.lastIndexOf('/'));
            }
            else {
                if (baseDir.substr(-1) == '/') {
                    baseDir = baseDir.substr(0, baseDir.length - 1);
                }
                url += (url.substr(url.length - 1) != '/' ? '/' : '') + 'library.json';
            }
            if (flumpLibrary == void 0) {
                flumpLibrary = new FlumpLibrary(baseDir);
            }
            else {
                flumpLibrary.url = baseDir;
            }
            return HttpRequest_1.default.getJSON(url).then(function (json) {
                return flumpLibrary.processData(json, onProcess);
            });
        };
        FlumpLibrary.prototype.hasLoaded = function () {
            return this._hasLoaded;
        };
        FlumpLibrary.prototype.isLoading = function () {
            return this._isLoading;
        };
        FlumpLibrary.prototype.load = function (onProgress) {
            var _this = this;
            if (this.hasLoaded()) {
                onProgress(1);
                return new Promise_1.default(function (resolve, reject) {
                    resolve(_this);
                });
            }
            if (!this.url) {
                throw new Error('url is not set and there for can not be loaded');
            }
            return FlumpLibrary.load(this.url, this, onProgress).catch(function () {
                throw new Error('could not load library');
            });
        };
        FlumpLibrary.prototype.processData = function (json, onProcess) {
            var _this = this;
            this.md5 = json.md5;
            this.frameRate = json.frameRate;
            this.referenceList = json.referenceList || null;
            this.isOptimised = json.optimised || false;
            var textureGroupLoaders = [];
            for (var i = 0; i < json.movies.length; i++) {
                var flumpMovieData = new FlumpMovieData_1.default(this, json.movies[i]);
                this.movieData.push(flumpMovieData);
            }
            var textureGroups = json.textureGroups;
            for (var i = 0; i < textureGroups.length; i++) {
                var textureGroup = textureGroups[i];
                var promise = FlumpTextureGroup_1.default.load(this, textureGroup);
                textureGroupLoaders.push(promise);
            }
            return HttpRequest_1.default.wait(textureGroupLoaders, onProcess)
                .then(function (textureGroups) {
                for (var i = 0; i < textureGroups.length; i++) {
                    var textureGroup = textureGroups[i];
                    _this.textureGroups.push(textureGroup);
                }
                _this._hasLoaded = true;
                return _this;
            });
        };
        FlumpLibrary.prototype.getFlumpMovieData = function (name) {
            for (var i = 0; i < this.movieData.length; i++) {
                var movieData = this.movieData[i];
                if (movieData.id == name) {
                    return movieData;
                }
            }
            throw new Error('movie not found');
        };
        FlumpLibrary.prototype.createSymbol = function (name, paused) {
            if (paused === void 0) { paused = false; }
            for (var i = 0; i < this.textureGroups.length; i++) {
                var flumpTextures = this.textureGroups[i].flumpTextures;
                if (name in flumpTextures) {
                    return flumpTextures[name];
                }
            }
            for (var i = 0; i < this.movieData.length; i++) {
                var movieData = this.movieData[i];
                if (movieData.id == name) {
                    var movie = new FlumpMovie_1.default(this, name);
                    movie.getQueue().add(new Queue_1.default(null, 0, movie.frames, -1, 0));
                    movie.paused = paused;
                    return movie;
                }
            }
            console.warn('no _symbol found: (' + name + ')');
            throw new Error("no _symbol found");
        };
        FlumpLibrary.prototype.createMovie = function (id) {
            if (this.referenceList) {
                var name = this.referenceList.indexOf(id);
            }
            else {
                var name = id;
            }
            for (var i = 0; i < this.movieData.length; i++) {
                var movieData = this.movieData[i];
                if (movieData.id == name) {
                    var movie = new FlumpMovie_1.default(this, name);
                    movie.paused = true;
                    return movie;
                }
            }
            console.warn('no _symbol found: (' + name + ') ', this);
            throw new Error("no _symbol found: " + this);
        };
        FlumpLibrary.prototype.getNameFromReferenceList = function (value) {
            if (this.referenceList && typeof value == 'number') {
                return this.referenceList[value];
            }
            return value;
        };
        FlumpLibrary.EVENT_LOAD = 'load';
        return FlumpLibrary;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FlumpLibrary;
});
