define(["require", "exports", "../geom/Bounds", "../geom/Vector2"], function (require, exports, Bounds, Vector2) {
    var SortUtil = (function () {
        function SortUtil() {
        }
        SortUtil.getBounds = function (list) {
            var bounds = new Bounds();
            if (list.length > 0) {
                bounds.x0 = list[0].x;
                bounds.y0 = list[1].y;
            }
            for (var i = 0; i < list.length; i++) {
                bounds.x0 = Math.min(list[i].x, bounds.x0);
                bounds.y0 = Math.min(list[i].y, bounds.y0);
                bounds.x1 = Math.max(list[i].x, bounds.x1);
                bounds.y1 = Math.max(list[i].y, bounds.y1);
            }
            bounds.width = bounds.x1 - bounds.x0;
            bounds.height = bounds.y1 - bounds.y0;
            return bounds;
        };
        SortUtil.random = function (list) {
            var currentIndex = list.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = list[currentIndex];
                list[currentIndex] = list[randomIndex];
                list[randomIndex] = temporaryValue;
            }
        };
        SortUtil.centerOut = function (list) {
            var bounds = this.getBounds(list);
            var point = new Vector2(bounds.width / 2 + bounds.x0, bounds.height / 2 + bounds.y0);
            list.sort(function (a, b) {
                var x0 = (a.x - point.x);
                var y0 = (a.y - point.y);
                var x1 = (b.x - point.x);
                var y1 = (b.y - point.y);
                return (x0 * x0 + y0 * y0) - (x1 * x1 + y1 * y1);
            });
            return point;
        };
        SortUtil.centerIn = function (list) {
            var bounds = this.getBounds(list);
            var point = new Vector2(bounds.width / 2 + bounds.x0, bounds.height / 2 + bounds.y0);
            list.sort(function (a, b) {
                var x0 = (a.x - point.x);
                var y0 = (a.y - point.y);
                var x1 = (b.x - point.x);
                var y1 = (b.y - point.y);
                return (x1 * x1 + y1 * y1) - (x0 * x0 + y0 * y0);
            });
            return point;
        };
        SortUtil.topDown = function (list) {
            var abs = [2000, 2000, 0, 0];
            for (var i = 0; i < list.length; i++) {
                abs[0] = Math.min(list[i].x, abs[0]);
                abs[1] = Math.min(list[i].y, abs[1]);
                abs[2] = Math.max(list[i].x, abs[2]);
                abs[3] = Math.max(list[i].y, abs[3]);
            }
            var point = new Vector2((abs[2] - abs[0]) / 2 + abs[0], (abs[3] - abs[1]) / 2 + abs[1]);
            list.sort(function (a, b) {
                return a.y - b.y;
            });
            return point;
        };
        SortUtil.downTop = function (list) {
            var abs = [2000, 2000, 0, 0];
            for (var i = 0; i < list.length; i++) {
                abs[0] = Math.min(list[i].x, abs[0]);
                abs[1] = Math.min(list[i].y, abs[1]);
                abs[2] = Math.max(list[i].x, abs[2]);
                abs[3] = Math.max(list[i].y, abs[3]);
            }
            var point = new Vector2((abs[2] - abs[0]) / 2 + abs[0], (abs[3] - abs[1]) / 2 + abs[1]);
            list.sort(function (a, b) {
                return b.y - a.y;
            });
            return point;
        };
        SortUtil.rightLeft = function (list) {
            var abs = [2000, 2000, 0, 0];
            for (var i = 0; i < list.length; i++) {
                abs[0] = Math.min(list[i].x, abs[0]);
                abs[1] = Math.min(list[i].y, abs[1]);
                abs[2] = Math.max(list[i].x, abs[2]);
                abs[3] = Math.max(list[i].y, abs[3]);
            }
            var point = new Vector2((abs[2] - abs[0]) / 2 + abs[0], (abs[3] - abs[1]) / 2 + abs[1]);
            list.sort(function (a, b) {
                return a.x - b.x;
            });
            return point;
        };
        SortUtil.leftRight = function (list) {
            var abs = [2000, 2000, 0, 0];
            for (var i = 0; i < list.length; i++) {
                abs[0] = Math.min(list[i].x, abs[0]);
                abs[1] = Math.min(list[i].y, abs[1]);
                abs[2] = Math.max(list[i].x, abs[2]);
                abs[3] = Math.max(list[i].y, abs[3]);
            }
            var point = new Vector2((abs[2] - abs[0]) / 2 + abs[0], (abs[3] - abs[1]) / 2 + abs[1]);
            list.sort(function (a, b) {
                return b.x - a.x;
            });
            return point;
        };
        return SortUtil;
    })();
    return SortUtil;
});
