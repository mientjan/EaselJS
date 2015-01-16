var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../display/Container', '../display/Text', '../display/Shape', '../behavior/ButtonBehavior'], function (require, exports, Container, Text, Shape, ButtonBehavior) {
    /**
     * @class BasicButton
     */
    var BasicButton = (function (_super) {
        __extends(BasicButton, _super);
        /**
         *
         * @param {string} color
         * @param {string|number} width
         * @param {string|number} height
         * @param {string|number} x
         * @param {string|number} y
         * @param {string|number} regX
         * @param {string|number} regY
         */
        function BasicButton(text, font, color, backgroundColor, border, x, y, regX, regY) {
            if (backgroundColor === void 0) { backgroundColor = null; }
            if (border === void 0) { border = null; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this, 100, 100, x, y, regX, regY);
            this._text = 'BasicButton';
            this._font = '10px Arial';
            this._color = '#FFF';
            this._backgroundColor = '#000';
            this._border = '#FFF';
            this._margin = [2, 2, 2, 2];
            this._shape = new Shape();
            this.hitArea = new Shape();
            this.addBehavior(new ButtonBehavior);
            this._text = text;
            this._font = font;
            this._backgroundColor = backgroundColor;
            this._border = border;
            this._textElement = new Text(text, font, color);
            this.addChild(this._shape);
            this.addChild(this._textElement);
        }
        Object.defineProperty(BasicButton.prototype, "backgroundColor", {
            get: function () {
                return this._backgroundColor;
            },
            set: function (value) {
                this._backgroundColor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BasicButton.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                this._text = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BasicButton.prototype, "margin", {
            get: function () {
                return this._margin.join(' ');
            },
            set: function (value) {
                var marginArray = value.split(' ').map(function (value) {
                    return parseInt(value);
                });
                switch (marginArray.length) {
                    case 1:
                        {
                            marginArray.push(marginArray[0], marginArray[0], marginArray[0]);
                            break;
                        }
                    case 2:
                        {
                            marginArray.push(marginArray[0], marginArray[1]);
                            break;
                        }
                    case 3:
                        {
                            marginArray.push(marginArray[1]);
                            break;
                        }
                }
                marginArray.length = 4;
                this._margin = marginArray;
            },
            enumerable: true,
            configurable: true
        });
        BasicButton.prototype.onResize = function (e) {
            _super.prototype.onResize.call(this, e);
            this._shape.graphics.clear().beginFill(this._backgroundColor).drawRect(0, 0, this.width, this.height);
            if (this._border) {
                this._shape.graphics.clear().beginStroke(this._border).drawRect(0, 0, this.width, this.height);
            }
            this.hitArea.graphics.clear().beginFill(this._backgroundColor).drawRect(0, 0, this.width, this.height);
        };
        return BasicButton;
    })(Container);
    return BasicButton;
});
