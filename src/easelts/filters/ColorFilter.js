var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Filter'], function (require, exports, Filter) {
    var ColorFilter = (function (_super) {
        __extends(ColorFilter, _super);
        function ColorFilter(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
            _super.call(this);
            this.redMultiplier = 1;
            this.greenMultiplier = 1;
            this.blueMultiplier = 1;
            this.alphaMultiplier = 1;
            this.redOffset = 0;
            this.greenOffset = 0;
            this.blueOffset = 0;
            this.alphaOffset = 0;
            this.redMultiplier = redMultiplier != null ? redMultiplier : 1;
            this.greenMultiplier = greenMultiplier != null ? greenMultiplier : 1;
            this.blueMultiplier = blueMultiplier != null ? blueMultiplier : 1;
            this.alphaMultiplier = alphaMultiplier != null ? alphaMultiplier : 1;
            this.redOffset = redOffset || 0;
            this.greenOffset = greenOffset || 0;
            this.blueOffset = blueOffset || 0;
            this.alphaOffset = alphaOffset || 0;
        }
        ColorFilter.prototype.applyFilter = function (ctx, x, y, width, height, targetCtx, targetX, targetY) {
            targetCtx = targetCtx || ctx;
            if (targetX == null) {
                targetX = x;
            }
            if (targetY == null) {
                targetY = y;
            }
            try {
                var imageData = ctx.getImageData(x, y, width, height);
            }
            catch (e) {
                return false;
            }
            var data = imageData.data;
            var l = data.length;
            for (var i = 0; i < l; i += 4) {
                data[i] = data[i] * this.redMultiplier + this.redOffset;
                data[i + 1] = data[i + 1] * this.greenMultiplier + this.greenOffset;
                data[i + 2] = data[i + 2] * this.blueMultiplier + this.blueOffset;
                data[i + 3] = data[i + 3] * this.alphaMultiplier + this.alphaOffset;
            }
            targetCtx.putImageData(imageData, targetX, targetY);
            return true;
        };
        ColorFilter.prototype.toString = function () {
            return "[ColorFilter]";
        };
        ColorFilter.prototype.clone = function () {
            return new ColorFilter(this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier, this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset);
        };
        return ColorFilter;
    })(Filter);
    return ColorFilter;
});
