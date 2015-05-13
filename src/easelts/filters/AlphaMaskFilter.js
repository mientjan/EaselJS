var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Filter'], function (require, exports, Filter) {
    var AlphaMaskFilter = (function (_super) {
        __extends(AlphaMaskFilter, _super);
        function AlphaMaskFilter(mask) {
            _super.call(this);
            this.mask = null;
            this.mask = mask;
        }
        AlphaMaskFilter.prototype.applyFilter = function (ctx, x, y, width, height, targetCtx, targetX, targetY) {
            if (!this.mask) {
                return true;
            }
            targetCtx = targetCtx || ctx;
            if (targetX == null) {
                targetX = x;
            }
            if (targetY == null) {
                targetY = y;
            }
            targetCtx.save();
            if (ctx != targetCtx) {
            }
            targetCtx.globalCompositeOperation = "destination-in";
            targetCtx.drawImage(this.mask, targetX, targetY);
            targetCtx.restore();
            return true;
        };
        AlphaMaskFilter.prototype.clone = function () {
            return new AlphaMaskFilter(this.mask);
        };
        AlphaMaskFilter.prototype.toString = function () {
            return "[AlphaMaskFilter]";
        };
        return AlphaMaskFilter;
    })(Filter);
    return AlphaMaskFilter;
});
