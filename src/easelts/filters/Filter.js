define(["require", "exports"], function (require, exports) {
    var Filter = (function () {
        function Filter() {
        }
        Filter.prototype.getBounds = function () {
            return null;
        };
        Filter.prototype.applyFilter = function (ctx, x, y, width, height, targetCtx, targetX, targetY) {
            return false;
        };
        Filter.prototype.toString = function () {
            return "[Filter]";
        };
        Filter.prototype.clone = function () {
            return new Filter();
        };
        return Filter;
    })();
    return Filter;
});
