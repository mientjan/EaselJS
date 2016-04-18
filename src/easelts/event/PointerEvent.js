var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../core/event/Event"], function (require, exports, Event_1) {
    "use strict";
    var MouseEvent = (function (_super) {
        __extends(MouseEvent, _super);
        function MouseEvent(type, bubbles, cancelable, stageX, stageY, nativeEvent, pointerID, primary, rawX, rawY) {
            _super.call(this, type, bubbles, cancelable);
            this.stageX = 0;
            this.stageY = 0;
            this.rawX = 0;
            this.rawY = 0;
            this.nativeEvent = null;
            this.pointerID = 0;
            this.primary = false;
            this.getLocalX = this._get_localX;
            this.getLocalY = this._get_localY;
            this.stageX = stageX;
            this.stageY = stageY;
            this.nativeEvent = nativeEvent;
            this.pointerID = pointerID;
            this.primary = primary;
            this.rawX = (rawX == null) ? stageX : rawX;
            this.rawY = (rawY == null) ? stageY : rawY;
        }
        MouseEvent.prototype._get_localX = function () {
            return this.currentTarget.globalToLocal(this.rawX, this.rawY).x;
        };
        MouseEvent.prototype._get_localY = function () {
            return this.currentTarget.globalToLocal(this.rawX, this.rawY).y;
        };
        MouseEvent.prototype.clone = function () {
            var m = new MouseEvent(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY);
            m.target = this.target;
            return m;
        };
        MouseEvent.prototype.toString = function () {
            return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]";
        };
        return MouseEvent;
    }(Event_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MouseEvent;
});
