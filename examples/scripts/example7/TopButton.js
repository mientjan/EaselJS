var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../../../src/easelts/display/Container', '../../../src/easelts/display/Text', '../../../src/easelts/component/BitmapNinePatch', '../../../src/easelts/component/bitmapninepatch/NinePatch', '../../../src/easelts/geom/Rectangle', '../../../src/easelts/behavior/ButtonBehavior'], function (require, exports, Container, Text, BitmapNinePatch, NinePatch, Rectangle, ButtonBehavior) {
    var TopButton = (function (_super) {
        __extends(TopButton, _super);
        function TopButton() {
            _super.call(this, 10, 10, '50%', '0%', '50%', '0%');
            this._ninepatch = new NinePatch('assets/image/ninepatch_blue.png', new Rectangle(5, 12, 139, 8));
            this._bg = new BitmapNinePatch(this._ninepatch);
            this._text = new Text('top');
            this.addBehavior(new ButtonBehavior);
            this.hitArea = this._bg;
            this.addChild(this._bg);
            this.addChild(this._text);
        }
        return TopButton;
    })(Container);
    return TopButton;
});
