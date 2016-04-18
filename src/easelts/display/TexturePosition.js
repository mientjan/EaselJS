define(["require", "exports", "../geom/Rectangle"], function (require, exports, Rectangle_1) {
    "use strict";
    var TexturePosition = (function () {
        function TexturePosition(texture, x, y, width, height, destX, destY, destWidth, destHeight) {
            if (destX === void 0) { destX = 0; }
            if (destY === void 0) { destY = 0; }
            this.texture = texture;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.destX = destX;
            this.destY = destY;
            this.destWidth = destWidth || width;
            this.destHeight = destHeight || height;
        }
        TexturePosition.prototype.setPosition = function (x, y, w, h, dx, dy, dw, dh) {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            this.destX = dx;
            this.destY = dy;
            this.destWidth = dw;
            this.destHeight = dh;
        };
        TexturePosition.prototype.getSourceRectangle = function () {
            return new Rectangle_1.default(this.x, this.y, this.width, this.height);
        };
        TexturePosition.prototype.getDestinationRectangle = function () {
            return new Rectangle_1.default(this.destX, this.destY, this.destWidth, this.destHeight);
        };
        TexturePosition.prototype.draw = function (ctx) {
            this.texture.draw(ctx, this.x, this.y, this.width, this.height, this.destX, this.destY, this.destWidth, this.destHeight);
            return true;
        };
        TexturePosition.prototype.drawWebGL = function (ctx) {
            this.texture.drawWebGL(ctx, this.x, this.y, this.width, this.height, this.destX, this.destY, this.destWidth, this.destHeight);
            return true;
        };
        return TexturePosition;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TexturePosition;
});
