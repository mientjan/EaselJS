var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../display/Bitmap', '../util/Methods'], function (require, exports, Bitmap, Methods) {
    /**
     * @class ImageSequence
     */
    var ImageSequence = (function (_super) {
        __extends(ImageSequence, _super);
        /**
         *
         * @param {string[]} images
         * @param {number} fps
         * @param {string|number} width
         * @param {string|number} height
         * @param {string|number} x
         * @param {string|number} y
         * @param {string|number} regX
         * @param {string|number} regY
         */
        function ImageSequence(images, fps, width, height, x, y, regX, regY) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this, images[0], width, height, x, y, regX, regY);
            this._playing = false;
            this._timeIndex = -1;
            this._frame = -1;
            this._fps = 0;
            this._length = 0;
            this._images = [];
            this._onComplete = null;
            this._times = 1;
            this.imageBackup0 = Methods.createImage();
            this.imageBackup1 = Methods.createImage();
            this.imageBackup2 = Methods.createImage();
            for (var i = 0; i < images.length; i++) {
                this._images.push(images[i]);
            }
            this._fps = 1000 / fps;
            this._length = images.length;
        }
        ImageSequence.prototype.draw = function (ctx, ignoreCache) {
            var image = this.image;
            if (!image.complete) {
                if (this.imageBackup0 && this.imageBackup0.complete) {
                    image = this.imageBackup0;
                }
                else if (this.imageBackup1 && this.imageBackup1.complete) {
                    image = this.imageBackup1;
                }
                else if (this.imageBackup2 && this.imageBackup2.complete) {
                    image = this.imageBackup2;
                }
            }
            ctx.drawImage(image, 0, 0);
            return true;
        };
        ImageSequence.prototype.play = function (times, onComplete) {
            if (times === void 0) { times = 1; }
            if (onComplete === void 0) { onComplete = null; }
            this._frame = 0;
            this._times = times;
            this._onComplete = onComplete;
            this._playing = true;
        };
        ImageSequence.prototype.stop = function () {
            this._playing = false;
            this._timeIndex = -1;
            this._frame = -1;
            if (this._onComplete) {
                this._onComplete.call(null);
            }
        };
        ImageSequence.prototype.onTick = function (delta) {
            var playing = this._playing;
            if (playing) {
                if (this._timeIndex < 0) {
                    this._timeIndex = 0;
                }
                var time = this._timeIndex += delta;
                var fps = this._fps;
                var length = this._length;
                var times = this._times;
                var frame = Math.floor(time / fps);
                var currentFrame = this._frame;
                if (times > -1 && !(times - Math.floor(frame / length))) {
                    this.stop();
                }
                else {
                    frame %= length;
                    if (currentFrame != frame) {
                        this._frame = frame;
                        this.imageBackup2.src = this.imageBackup1.src;
                        this.imageBackup1.src = this.imageBackup0.src;
                        this.imageBackup0.src = this.image.src;
                        this.image.src = this._images[frame];
                    }
                }
            }
        };
        return ImageSequence;
    })(Bitmap);
    return ImageSequence;
});
