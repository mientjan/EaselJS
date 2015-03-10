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
        function MouseOverBehavior(hitArea) {
            _super.call(this);
            this._rectangle = null;
            this._circle = null;
            this._circleRadiusPow = 0.0;
            this._hasMouseOver = false;
            this._tickerSignalConnection = null;
            if (hitArea !== void 0) {
                if (hitArea.hasOwnProperty("x") && hitArea.hasOwnProperty("y") && hitArea.hasOwnProperty("radius")) {
                    this._circle = hitArea;
                    this._circleRadiusPow = hitArea.radius * hitArea.radius;
                }
                else if (hitArea.hasOwnProperty("x") && hitArea.hasOwnProperty("y") && hitArea.hasOwnProperty("width") && hitArea.hasOwnProperty("height")) {
                    this._rectangle = hitArea;
                }
                else {
                    throw new Error("hitArea is of invalid type");
                }
            }
        }
        MouseOverBehavior.prototype.initialize = function (owner) {
            _super.prototype.initialize.call(this, owner);
            this.owner.cursor = 'pointer';
            this._tickerSignalConnection = Ticker.getInstance().tickSignal.connect(this.update.bind(this));
        };
        MouseOverBehavior.prototype.update = function (delta) {
            var stage = this.owner.stage;
            if (stage && stage.mouseEnabled && stage.mouseChildren && this.owner.mouseEnabled) {
                this.checkMouseOver();
            }
            else {
                if (this._hasMouseOver) {
                    this.changeMouseOverState(false);
                }
            }
        };
        MouseOverBehavior.prototype.checkMouseOver = function () {
            var isWithin = false;
            var mousePosition = this.owner.globalToLocal(this.owner.stage.mouseX, this.owner.stage.mouseY);
            if (this._circle) {
                mousePosition.x -= this._circle.x;
                mousePosition.y -= this._circle.y;
                isWithin = (mousePosition.x * mousePosition.x + mousePosition.y * mousePosition.y < this._circleRadiusPow);
            }
            else if (this._rectangle) {
                isWithin = (mousePosition.x > this._rectangle.x && mousePosition.x < this._rectangle.x + this._rectangle.width) && (mousePosition.y > this._rectangle.y && mousePosition.y < this._rectangle.y + this._rectangle.height);
            }
            else {
                isWithin = (mousePosition.x > 0 && mousePosition.x < this.owner.width) && (mousePosition.y > 0 && mousePosition.y < this.owner.height);
            }
            if (!this._hasMouseOver && isWithin) {
                this.changeMouseOverState(true);
            }
            else if (this._hasMouseOver && !isWithin) {
                this.changeMouseOverState(false);
            }
        };
        MouseOverBehavior.prototype.changeMouseOverState = function (hasMouseOver) {
            this._hasMouseOver = hasMouseOver;
            var stageMouseX;
            var stageMouseY;
            var stage = this.owner.stage;
            if (stage) {
                stageMouseX = stage.mouseX;
                stageMouseY = stage.mouseY;
                stage.canvas.style.cursor = hasMouseOver ? this.owner.cursor : "";
            }
            var eventType = hasMouseOver ? DisplayObject.EVENT_MOUSE_OVER : DisplayObject.EVENT_MOUSE_OUT;
            this.owner.dispatchEvent(new PointerEvent(eventType, true, false, stageMouseX, stageMouseY, null, -1, true, stageMouseX, stageMouseY));
        };
        MouseOverBehavior.prototype.destruct = function () {
            if (this._hasMouseOver) {
                this.changeMouseOverState(false);
            }
            if (this._tickerSignalConnection) {
                this._tickerSignalConnection.dispose();
                this._tickerSignalConnection = null;
            }
            this._circle = null;
            this._rectangle = null;
            _super.prototype.destruct.call(this);
        };
        return MouseOverBehavior;
    })(AbstractBehavior);
    return MouseOverBehavior;
});
