var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './AbstractBehavior', '../display/DisplayObject', '../event/PointerEvent', '../../createts/util/Ticker'], function (require, exports, AbstractBehavior, DisplayObject, PointerEvent, Ticker) {
    /**
     * Created by pieters on 10-Mar-15.
     */
    var MouseOverBehavior = (function (_super) {
        __extends(MouseOverBehavior, _super);
        function MouseOverBehavior(area) {
            var _this = this;
            _super.call(this);
            this._rectangle = null;
            this._radiusPow = 0.0;
            this._hasMouseOver = false;
            this._tickerSignalConnection = null;
            this.update = function (delta) {
                _this.checkMouseOver();
            };
            if (area !== void 0) {
                if (typeof area == "number") {
                    this._radiusPow = area * area;
                }
                else if (area.hasOwnProperty("x") && area.hasOwnProperty("y") && area.hasOwnProperty("width") && area.hasOwnProperty("height")) {
                    this._rectangle = area;
                }
                else {
                    throw new Error("Invalid type area");
                }
            }
        }
        MouseOverBehavior.prototype.initialize = function (owner) {
            _super.prototype.initialize.call(this, owner);
            this.owner.cursor = 'pointer';
            this._tickerSignalConnection = Ticker.getInstance().tickSignal.connect(this.update);
        };
        MouseOverBehavior.prototype.checkMouseOver = function () {
            var isWithin = false;
            if (this.owner.stage) {
                this._stage = this.owner.stage;
            }
            if (!this._stage || !this.owner.mouseEnabled) {
                isWithin = false;
            }
            else {
                var mousePosition = this.owner.globalToLocal(this._stage.mouseX, this._stage.mouseY);
                if (this._radiusPow) {
                    isWithin = (mousePosition.x * mousePosition.x + mousePosition.y * mousePosition.y < this._radiusPow);
                }
                else if (this._rectangle) {
                    isWithin = (mousePosition.x > this._rectangle.x && mousePosition.x < this._rectangle.x + this._rectangle.width) && (mousePosition.y > this._rectangle.y && mousePosition.y < this._rectangle.y + this._rectangle.height);
                }
                else {
                    isWithin = (mousePosition.x > 0 && mousePosition.x < this.owner.width) && (mousePosition.y > 0 && mousePosition.y < this.owner.height);
                }
            }
            if (!this._hasMouseOver && isWithin) {
                this.owner.dispatchEvent(new PointerEvent(DisplayObject.EVENT_MOUSE_OVER, true, false, this._stage.mouseX, this._stage.mouseY, null, -1, true, this._stage.mouseX, this._stage.mouseY));
                this._hasMouseOver = true;
                if (this.owner.stage) {
                    this.owner.stage.canvas.style.cursor = this.owner.cursor;
                }
            }
            else if (this._hasMouseOver && !isWithin) {
                this.owner.dispatchEvent(new PointerEvent(DisplayObject.EVENT_MOUSE_OUT, true, false, this._stage.mouseX, this._stage.mouseY, null, -1, true, this._stage.mouseX, this._stage.mouseY));
                this._hasMouseOver = false;
                if (this.owner.stage) {
                    this.owner.stage.canvas.style.cursor = "";
                }
            }
        };
        MouseOverBehavior.prototype.destruct = function () {
            if (this._tickerSignalConnection) {
                this._tickerSignalConnection.dispose();
                this._tickerSignalConnection = null;
            }
            this._rectangle = null;
        };
        return MouseOverBehavior;
    })(AbstractBehavior);
    return MouseOverBehavior;
});
