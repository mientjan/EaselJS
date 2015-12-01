var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./AbstractBehavior", "../display/DisplayObject", "../geom/Point"], function (require, exports, AbstractBehavior_1, DisplayObject_1, Point_1) {
    var DragBehavior = (function (_super) {
        __extends(DragBehavior, _super);
        function DragBehavior() {
            _super.call(this);
        }
        DragBehavior.prototype.initialize = function (owner) {
            var _this = this;
            _super.prototype.initialize.call(this, owner);
            this.owner.setMouseInteraction(true);
            var first = null;
            this.owner.addEventListener(DisplayObject_1.default.EVENT_MOUSE_DOWN, function (e) {
                if (e.nativeEvent)
                    e.nativeEvent.stopPropagation();
            });
            this.owner.addEventListener(DisplayObject_1.default.EVENT_PRESS_MOVE, function (e) {
                var x = e.stageX;
                var y = e.stageY;
                _this.setDragging(true);
                if (!first) {
                    first = new Point_1.default(x, y);
                }
                else {
                    _this.y += y - first.y;
                    _this.x += x - first.x;
                    first.x = x;
                    first.y = y;
                }
            });
            this.owner.addEventListener(DisplayObject_1.default.EVENT_PRESS_MOVE, function (e) {
                if (e.nativeEvent)
                    e.nativeEvent.stopPropagation();
                var x = e.stageX;
                var y = e.stageY;
                _this.isDragging = true;
                if (!first) {
                    first = new Point_1.default(x, y);
                    _this.drag.setDragging(true);
                }
                else {
                    _this.drag.y += y - first.y;
                    _this.drag.x += x - first.x;
                    first.x = x;
                    first.y = y;
                }
            });
            this.owner.addEventListener(DisplayObject_1.default.EVENT_PRESS_UP, function (e) {
                first = null;
                _this.setDragging(false);
            });
        };
        return DragBehavior;
    })(AbstractBehavior_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DragBehavior;
});
