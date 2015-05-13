var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Filter'], function (require, exports, Filter) {
    var ColorMatrixFilter = (function (_super) {
        __extends(ColorMatrixFilter, _super);
        function ColorMatrixFilter(matrix) {
            _super.call(this);
            this.matrix = matrix;
        }
        ColorMatrixFilter.prototype.applyFilter = function (ctx, x, y, width, height, targetCtx, targetX, targetY) {
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
            var r, g, b, a;
            var mtx = this.matrix;
            var m0 = mtx[0], m1 = mtx[1], m2 = mtx[2], m3 = mtx[3], m4 = mtx[4];
            var m5 = mtx[5], m6 = mtx[6], m7 = mtx[7], m8 = mtx[8], m9 = mtx[9];
            var m10 = mtx[10], m11 = mtx[11], m12 = mtx[12], m13 = mtx[13], m14 = mtx[14];
            var m15 = mtx[15], m16 = mtx[16], m17 = mtx[17], m18 = mtx[18], m19 = mtx[19];
            for (var i = 0; i < l; i += 4) {
                r = data[i];
                g = data[i + 1];
                b = data[i + 2];
                a = data[i + 3];
                data[i] = r * m0 + g * m1 + b * m2 + a * m3 + m4;
                data[i + 1] = r * m5 + g * m6 + b * m7 + a * m8 + m9;
                data[i + 2] = r * m10 + g * m11 + b * m12 + a * m13 + m14;
                data[i + 3] = r * m15 + g * m16 + b * m17 + a * m18 + m19;
            }
            targetCtx.putImageData(imageData, targetX, targetY);
            return true;
        };
        ColorMatrixFilter.prototype.toString = function () {
            return "[ColorMatrixFilter]";
        };
        ColorMatrixFilter.prototype.clone = function () {
            return new ColorMatrixFilter(this.matrix);
        };
        return ColorMatrixFilter;
    })(Filter);
    return ColorMatrixFilter;
});
