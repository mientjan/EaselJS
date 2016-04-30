var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./AbstractBehavior", "../display/DisplayObject"], function (require, exports, AbstractBehavior_1, DisplayObject_1) {
    "use strict";
    var ButtonBehavior = (function (_super) {
        __extends(ButtonBehavior, _super);
        function ButtonBehavior() {
            _super.apply(this, arguments);
            this._onClickInstance = null;
            this._onPointerOverInstance = null;
            this._onPointerOutInstance = null;
        }
        ButtonBehavior.prototype.initialize = function (displayObject) {
            _super.prototype.initialize.call(this, displayObject);
            this.owner.setMouseInteraction(true);
            this.owner.cursor = 'pointer';
            if (typeof (this.owner['onClick']) == 'function') {
                this._onClickInstance = this.owner['onClick'].bind(this.owner);
                this.owner.addEventListener(DisplayObject_1.DisplayObject.EVENT_MOUSE_CLICK, this._onClickInstance);
            }
            if (typeof (this.owner['onPointerOver']) == 'function') {
                this._onPointerOverInstance = this.owner['onPointerOver'].bind(this.owner);
                this.owner.addEventListener(DisplayObject_1.DisplayObject.EVENT_MOUSE_OVER, this._onPointerOverInstance);
            }
            if (typeof (this.owner['onPointerOut']) == 'function') {
                this._onPointerOutInstance = this.owner['onPointerOut'].bind(this.owner);
                this.owner.addEventListener(DisplayObject_1.DisplayObject.EVENT_MOUSE_OUT, this._onPointerOutInstance);
            }
        };
        ButtonBehavior.prototype.destruct = function () {
            if (this._onClickInstance) {
                this.owner.removeEventListener(DisplayObject_1.DisplayObject.EVENT_MOUSE_CLICK, this._onClickInstance);
            }
            if (this._onPointerOverInstance) {
                this.owner.removeEventListener(DisplayObject_1.DisplayObject.EVENT_MOUSE_OVER, this._onPointerOverInstance);
            }
            if (this._onPointerOutInstance) {
                this.owner.removeEventListener(DisplayObject_1.DisplayObject.EVENT_MOUSE_OUT, this._onPointerOutInstance);
            }
            this._stage = null;
            this._onClickInstance = null;
            this._onPointerOverInstance = null;
            this._onPointerOutInstance = null;
            _super.prototype.destruct.call(this);
        };
        return ButtonBehavior;
    }(AbstractBehavior_1.AbstractBehavior));
    exports.ButtonBehavior = ButtonBehavior;
});
