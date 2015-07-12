var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './AbstractBehavior'], function (require, exports, AbstractBehavior) {
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
            this.owner.enableMouseInteraction();
            this.owner.cursor = 'pointer';
        };
        ButtonBehavior.prototype.destruct = function () {
            //if(this._onClickInstance)
            //{
            //	this.owner.removeEventListener(DisplayObject.EVENT_MOUSE_CLICK, this._onClickInstance);
            //}
            //
            //if(this._onPointerOverInstance)
            //{
            //	this.owner.removeEventListener(DisplayObject.EVENT_MOUSE_OVER, this._onPointerOverInstance);
            //}
            //
            //if(this._onPointerOutInstance)
            //{
            //	this.owner.removeEventListener(DisplayObject.EVENT_MOUSE_OUT, this._onPointerOutInstance);
            //}
            this._stage = null;
            this._onClickInstance = null;
            this._onPointerOverInstance = null;
            this._onPointerOutInstance = null;
            _super.prototype.destruct.call(this);
        };
        return ButtonBehavior;
    })(AbstractBehavior);
    return ButtonBehavior;
});
