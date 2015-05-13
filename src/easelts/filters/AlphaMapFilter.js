var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../util/Methods', './Filter'], function (require, exports, Methods, Filter) {
    var AlphaMapFilter = (function (_super) {
        __extends(AlphaMapFilter, _super);
        function AlphaMapFilter(alphaMap) {
            _super.call(this);
            this.alphaMap = null;
            this._alphaMap = null;
            this._mapData = null;
            this.alphaMap = alphaMap;
        }
        AlphaMapFilter.prototype.applyFilter = function (ctx, x, y, width, height, targetCtx, targetX, targetY) {
            if (!this.alphaMap) {
                return true;
            }
            if (!this._prepAlphaMap()) {
                return false;
            }
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
            var map = this._mapData;
            var l = data.length;
            for (var i = 0; i < l; i += 4) {
                data[i + 3] = map[i] || 0;
            }
            targetCtx.putImageData(imageData, targetX, targetY);
            return true;
        };
        AlphaMapFilter.prototype.clone = function () {
            return new AlphaMapFilter(this.alphaMap);
        };
        AlphaMapFilter.prototype.toString = function () {
            return "[AlphaMapFilter]";
        };
        AlphaMapFilter.prototype._prepAlphaMap = function () {
            if (!this.alphaMap) {
                return false;
            }
            if (this.alphaMap == this._alphaMap && this._mapData) {
                return true;
            }
            this._mapData = null;
            var map = this._alphaMap;
            var canvas = map;
            var ctx;
            if (map instanceof HTMLCanvasElement) {
                ctx = canvas.getContext("2d");
            }
            else {
                canvas = Methods.createCanvas ? Methods.createCanvas() : document.createElement("canvas");
                canvas.width = map.width;
                canvas.height = map.height;
                ctx = canvas.getContext("2d");
                ctx.drawImage(map, 0, 0);
            }
            try {
                var imgData = ctx.getImageData(0, 0, map.width, map.height);
                this._mapData = imgData.data;
                return true;
            }
            catch (e) {
                return false;
            }
        };
        return AlphaMapFilter;
    })(Filter);
    return AlphaMapFilter;
});
