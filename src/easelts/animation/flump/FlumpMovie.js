var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../display/DisplayObject', './FlumpMovieLayer', '../../data/AnimationQueue', '../../data/Queue'], function (require, exports, DisplayObject_1, FlumpMovieLayer_1, AnimationQueue_1, Queue_1) {
    var FlumpMovie = (function (_super) {
        __extends(FlumpMovie, _super);
        function FlumpMovie(flumpLibrary, name, width, height, x, y, regX, regY) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.type = 2048;
            this._labels = {};
            this._labelQueue = [];
            this._label = null;
            this._queue = null;
            this.hasFrameCallbacks = false;
            this.paused = true;
            this.frame = 0;
            this.frames = 0;
            this.speed = 1;
            this.fps = 1;
            this.name = name;
            this.flumpLibrary = flumpLibrary;
            this.flumpMovieData = flumpLibrary.getFlumpMovieData(name);
            var layers = this.flumpMovieData.flumpLayerDatas;
            var length = layers.length;
            var movieLayers = new Array(length);
            for (var i = 0; i < length; i++) {
                var layerData = layers[i];
                movieLayers[i] = new FlumpMovieLayer_1.default(this, layerData);
            }
            this.flumpMovieLayers = movieLayers;
            this.frames = this.flumpMovieData.frames;
            this._frameCallback = new Array(this.frames);
            for (var i = 0; i < this.frames; i++) {
                this._frameCallback[i] = null;
            }
            this.fps = flumpLibrary.frameRate;
            this.getQueue();
        }
        FlumpMovie.prototype.getQueue = function () {
            if (!this._queue) {
                this._queue = new AnimationQueue_1.default(this.fps, 1000);
            }
            return this._queue;
        };
        FlumpMovie.prototype.play = function (times, label, complete) {
            if (times === void 0) { times = 1; }
            if (label === void 0) { label = null; }
            this.visible = true;
            if (label instanceof Array) {
                if (label.length == 1) {
                    var queue = new Queue_1.default(null, label[0], this.frames, times, 0);
                }
                else {
                    var queue = new Queue_1.default(null, label[0], label[1], times, 0);
                }
            }
            else if (label == null || label == '*') {
                var queue = new Queue_1.default(null, 0, this.frames, times, 0);
            }
            else {
                var queueLabel = this._labels[label];
                if (!queueLabel) {
                    throw new Error('unknown label:' + queueLabel + ' | ' + this.name);
                }
                var queue = new Queue_1.default(queueLabel.label, queueLabel.index, queueLabel.duration, times, 0);
            }
            if (complete) {
                queue.then(complete);
            }
            this._queue.add(queue);
            if (complete) {
                queue.then(complete);
            }
            this.paused = false;
            return this;
        };
        FlumpMovie.prototype.resume = function () {
            this.paused = false;
            return this;
        };
        FlumpMovie.prototype.pause = function () {
            this.paused = true;
            return this;
        };
        FlumpMovie.prototype.end = function (all) {
            if (all === void 0) { all = false; }
            this._queue.end(all);
            return this;
        };
        FlumpMovie.prototype.stop = function () {
            this.paused = true;
            this._queue.kill();
            return this;
        };
        FlumpMovie.prototype.next = function () {
            return this._queue.next();
        };
        FlumpMovie.prototype.kill = function () {
            this._queue.kill();
            return this;
        };
        FlumpMovie.prototype.setFrameCallback = function (frameNumber, callback, triggerOnce) {
            var _this = this;
            if (triggerOnce === void 0) { triggerOnce = false; }
            this.hasFrameCallbacks = true;
            if (triggerOnce) {
                this._frameCallback[frameNumber] = function (delta) {
                    callback.call(_this, delta);
                    _this.setFrameCallback(frameNumber, null);
                };
            }
            else {
                this._frameCallback[frameNumber] = callback;
            }
            return this;
        };
        FlumpMovie.prototype.gotoAndStop = function (frameOrLabel) {
            var frame;
            if (typeof frameOrLabel === 'string') {
                frame = this._labels[frameOrLabel].index;
            }
            else {
                frame = frameOrLabel;
            }
            var queue = new Queue_1.default(null, frame, 1, 1, 0);
            this._queue.add(queue);
            return this;
        };
        FlumpMovie.prototype.onTick = function (delta) {
            _super.prototype.onTick.call(this, delta);
            delta *= this.speed;
            if (this.paused == false) {
                this._queue.onTick(delta);
                this.frame = this._queue.getFrame();
                for (var i = 0; i < this.flumpMovieLayers.length; i++) {
                    var layer = this.flumpMovieLayers[i];
                    layer.onTick(delta);
                    layer.setFrame(this.frame);
                }
            }
        };
        FlumpMovie.prototype.getSymbol = function (name) {
            var layers = this.flumpMovieLayers;
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                var symbol = layer.getSymbol(name);
                if (symbol != null) {
                    return symbol;
                }
            }
            return null;
        };
        FlumpMovie.prototype.replaceSymbol = function (name, symbol) {
            var layers = this.flumpMovieLayers;
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                if (layer.replaceSymbol(name, symbol)) {
                    return true;
                }
            }
            return false;
        };
        FlumpMovie.prototype.handleFrameCallback = function (fromFrame, toFrame, delta) {
            if (toFrame > fromFrame) {
                for (var index = fromFrame; index < toFrame; index++) {
                    if (this._frameCallback[index]) {
                        this._frameCallback[index].call(this, delta);
                    }
                }
            }
            else if (toFrame < fromFrame) {
                for (var index = fromFrame; index < this.frames; index++) {
                    if (this._frameCallback[index]) {
                        this._frameCallback[index].call(this, delta);
                    }
                }
                for (var index = 0; index < toFrame; index++) {
                    if (this._frameCallback[index]) {
                        this._frameCallback[index].call(this, delta);
                    }
                }
            }
            return this;
        };
        FlumpMovie.prototype.draw = function (ctx, ignoreCache) {
            var layers = this.flumpMovieLayers;
            var length = layers.length;
            var ga = ctx.globalAlpha;
            for (var i = 0; i < length; i++) {
                var layer = layers[i];
                if (layer.visible && layer.enabled) {
                    ctx.save();
                    ctx.globalAlpha = ga * layer.alpha;
                    ctx.transform(layer._storedMtx.a, layer._storedMtx.b, layer._storedMtx.c, layer._storedMtx.d, layer._storedMtx.tx, layer._storedMtx.ty);
                    layer.draw(ctx);
                    ctx.restore();
                }
            }
            return true;
        };
        FlumpMovie.prototype.reset = function () {
            this.frame = 0;
            this._queue.reset();
            for (var i = 0; i < this.flumpMovieLayers.length; i++) {
                var layer = this.flumpMovieLayers[i];
                layer.reset();
                for (var symbol in layer._symbols) {
                    layer._symbols[symbol].reset();
                }
            }
        };
        return FlumpMovie;
    })(DisplayObject_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FlumpMovie;
});
