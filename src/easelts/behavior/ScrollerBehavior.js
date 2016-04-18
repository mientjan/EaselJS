var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./AbstractBehavior", "../display/Container", "../../zynga/Scroller"], function (require, exports, AbstractBehavior_1, Container_1, Scroller_1) {
    "use strict";
    var ScrollerBehavior = (function (_super) {
        __extends(ScrollerBehavior, _super);
        function ScrollerBehavior(options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            _super.call(this);
            this._scroller = null;
            this._mousedown = false;
            this.onMouseDown = function (e) {
                _this._scroller.doTouchStart([{
                        pageX: e.stageX,
                        pageY: e.stageY
                    }], e.timeStamp);
                _this._mousedown = true;
            };
            this.onMouseMove = function (e) {
                if (!_this._mousedown) {
                    return;
                }
                _this._scroller.doTouchMove([{
                        pageX: e.stageX,
                        pageY: e.stageY
                    }], e.timeStamp);
                _this._mousedown = true;
            };
            this.onMouseUp = function (e) {
                if (!_this._mousedown) {
                    return;
                }
                _this._scroller.doTouchEnd(e.timeStamp);
                _this._mousedown = false;
            };
            this.options = options;
        }
        ScrollerBehavior.prototype.initialize = function (container) {
            _super.prototype.initialize.call(this, container);
            this.owner.setMouseInteraction(true);
            this.owner.cursor = 'pointer';
            if (this.owner.children.length == 0
                || this.owner.children.length > 1) {
                throw new Error('owner can have only one child that holds all the gallery items');
            }
            this.holder = this.owner.children[0];
            this._scroller = new Scroller_1.default(this.onChange.bind(this), this.options);
            this.owner.addEventListener(Container_1.default.EVENT_MOUSE_DOWN, this.onMouseDown);
            this.owner.addEventListener(Container_1.default.EVENT_PRESS_MOVE, this.onMouseMove);
            this.owner.addEventListener(Container_1.default.EVENT_PRESS_UP, this.onMouseUp);
        };
        ScrollerBehavior.prototype.setDimensions = function (containerWidth, containerHeight, contentWidth, contentHeight) {
            this._scroller.setDimensions(containerWidth, containerHeight, contentWidth, contentHeight);
        };
        ScrollerBehavior.prototype.scrollTo = function (x, y, animate) {
            if (animate === void 0) { animate = true; }
            this._scroller.scrollTo(x, y, animate);
        };
        ScrollerBehavior.prototype.setSnapSize = function (width, height) {
            this._scroller.setSnapSize(width, height);
        };
        ScrollerBehavior.prototype.onChange = function (left, top, zoom) {
            this.holder.x = -left;
            this.holder.y = -top;
        };
        ScrollerBehavior.prototype.destruct = function () {
            this.owner.removeEventListener(Container_1.default.EVENT_MOUSE_DOWN, this.onMouseDown);
            this.owner.removeEventListener(Container_1.default.EVENT_PRESS_UP, this.onMouseUp);
            this.owner.removeEventListener(Container_1.default.EVENT_PRESS_MOVE, this.onMouseMove);
            _super.prototype.destruct.call(this);
        };
        return ScrollerBehavior;
    }(AbstractBehavior_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ScrollerBehavior;
});
