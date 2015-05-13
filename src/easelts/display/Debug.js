var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "./Container", "./Shape", "./Graphics", "./Text"], function (require, exports, Container, Shape, Graphics, Text) {
    var Debug = (function (_super) {
        __extends(Debug, _super);
        function Debug(name, width, height, x, y, regX, regY) {
            if (name === void 0) { name = 'unknown'; }
            if (width === void 0) { width = '100%'; }
            if (height === void 0) { height = '100%'; }
            if (x === void 0) { x = '50%'; }
            if (y === void 0) { y = '50%'; }
            if (regX === void 0) { regX = '50%'; }
            if (regY === void 0) { regY = '50%'; }
            _super.call(this);
            this.name = name;
            this._shape = new Shape();
            this._text = new Text('', 'bold 16px Arial', '#FFF');
            this.setWidth(width);
            this.setHeight(height);
            this.setRegX(regX);
            this.setRegY(regY);
            this.setX(x);
            this.setY(y);
            this._text.textAlign = 'center';
            this._text.textBaseline = 'center';
            this.addChild(this._shape);
            this.addChild(this._text);
            this.mouseEnabled = false;
            this.tickChildren = false;
            this.update();
        }
        Debug.prototype.update = function () {
            if (this.width > 0 && this.height > 0) {
                this._text.text = (this.name.length > 0 ? this.name + '\n' : '') + Math.round(this.width) + ' x ' + Math.round(this.height);
                this._text.x = this.width / 2;
                this._text.y = this.height / 2;
                if (this.width < 100 || this.height < 100) {
                    this._text.visible = false;
                }
                this._shape.graphics.clear().beginStroke(Graphics.getRGB(0, 0, 0)).setStrokeStyle(1).drawRect(0, 0, this.width, this.height).setStrokeStyle(1).moveTo(10, 10).lineTo(this.width - 10, this.height - 10).moveTo(this.width - 10, 10).lineTo(10, this.height - 10);
                if (this.width > 150 && this.height > 150) {
                    var w = this._text.getMeasuredWidth();
                    var h = this._text.getMeasuredHeight();
                    this._shape.graphics.beginFill(Graphics.getRGB(0, 0, 0)).drawRect(this.width - w >> 1, this.height - h >> 1, w, h);
                }
            }
        };
        Debug.prototype.onResize = function (width, height) {
            _super.prototype.onResize.call(this, width, height);
            this.update();
        };
        return Debug;
    })(Container);
    return Debug;
});
