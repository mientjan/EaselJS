define(["require", "exports", "../../geom/Rectangle", "../../geom/Size", "../../display/Texture", "../../display/TexturePosition"], function (require, exports, Rectangle_1, Size_1, Texture_1, TexturePosition_1) {
    "use strict";
    var NinePatch = (function () {
        function NinePatch(texture, rectangle) {
            var _this = this;
            this._prevWidth = -1;
            this._prevHeight = -1;
            this._textures = [];
            this._isLoaded = false;
            if (typeof texture == 'string') {
                this.texture = Texture_1.default.createFromString(texture);
            }
            else {
                this.texture = texture;
            }
            if (!(rectangle instanceof Rectangle_1.default)) {
                this.rectangle = new Rectangle_1.default(rectangle[0], rectangle[1], rectangle[2], rectangle[3]);
            }
            else {
                this.rectangle = rectangle;
            }
            if (!this.texture.hasLoaded()) {
                this.texture.load().then(function () { return _this.onLoad(); });
            }
            else {
                this.onLoad();
            }
        }
        NinePatch.prototype.onLoad = function () {
            if (!this._isLoaded) {
                var source = new Rectangle_1.default(0, 0, 10, 10);
                var dest = new Rectangle_1.default(0, 0, 10, 10);
                var texture = this.texture;
                this._textures.push(new TexturePosition_1.default(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
                this._textures.push(new TexturePosition_1.default(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
                this._textures.push(new TexturePosition_1.default(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
                this._textures.push(new TexturePosition_1.default(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
                this._textures.push(new TexturePosition_1.default(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
                this._textures.push(new TexturePosition_1.default(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
                this._textures.push(new TexturePosition_1.default(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
                this._textures.push(new TexturePosition_1.default(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
                this._textures.push(new TexturePosition_1.default(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
                this._isLoaded = true;
            }
        };
        NinePatch.prototype.getTextures = function (width, height) {
            if (width != this._prevWidth || height != this._prevHeight && this._textures.length == 9) {
                this._prevWidth = width;
                this._prevHeight = height;
                var size = new Size_1.default(this.texture.width, this.texture.height);
                var iw = size.width;
                var ih = size.height;
                var rx = this.rectangle.x;
                var ry = this.rectangle.y;
                var rw = this.rectangle.width;
                var rh = this.rectangle.height;
                var sourceRow = [
                    0, ry, ry + rh, ih
                ];
                var sourceColumn = [
                    0, rx, rx + rw, iw
                ];
                var destRow = [
                    0, ry, height - (sourceRow[3] - sourceRow[2]), height
                ];
                var destColumn = [
                    0, rx, width - (sourceColumn[3] - sourceColumn[2]), width
                ];
                this._textures[0].setPosition(sourceColumn[0], sourceRow[0], sourceColumn[1], sourceRow[1], destColumn[0], destRow[0], destColumn[1], destRow[1]);
                this._textures[1].setPosition(sourceColumn[1], sourceRow[0], sourceColumn[2] - sourceColumn[1], sourceRow[1], destColumn[1], destRow[0], destColumn[2] - destColumn[1], destRow[1]);
                this._textures[2].setPosition(sourceColumn[2], sourceRow[0], sourceColumn[3] - sourceColumn[2], sourceRow[1], destColumn[2], destRow[0], destColumn[3] - destColumn[2], destRow[1]);
                this._textures[3].setPosition(sourceColumn[0], sourceRow[1], sourceColumn[1], sourceRow[2] - sourceRow[1], destColumn[0], destRow[1], destColumn[1], destRow[2] - destRow[1]);
                this._textures[4].setPosition(sourceColumn[1], sourceRow[1], sourceColumn[2] - sourceColumn[1], sourceRow[2] - sourceRow[1], destColumn[1], destRow[1], destColumn[2] - destColumn[1], destRow[2] - destRow[1]);
                this._textures[5].setPosition(sourceColumn[2], sourceRow[1], sourceColumn[3] - sourceColumn[2], sourceRow[2] - sourceRow[1], destColumn[2], destRow[1], destColumn[3] - destColumn[2], destRow[2] - destRow[1]);
                this._textures[6].setPosition(sourceColumn[0], sourceRow[2], sourceColumn[1], sourceRow[3] - sourceRow[2], destColumn[0], destRow[2], destColumn[1], destRow[3] - destRow[2]);
                this._textures[7].setPosition(sourceColumn[1], sourceRow[2], sourceColumn[2] - destColumn[1], sourceRow[3] - sourceRow[2], destColumn[1], destRow[2], destColumn[2] - destColumn[1], destRow[3] - destRow[2]);
                this._textures[8].setPosition(sourceColumn[2], sourceRow[2], sourceColumn[3] - destColumn[2], sourceRow[3] - sourceRow[2], destColumn[2], destRow[2], destColumn[3] - destColumn[2], destRow[3] - destRow[2]);
            }
            return this._textures;
        };
        NinePatch.prototype.isLoaded = function () {
            return this._isLoaded;
        };
        return NinePatch;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NinePatch;
});
