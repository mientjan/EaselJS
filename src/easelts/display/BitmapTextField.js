var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Container', './Shape', './Graphics', './bitmapfont/VAlign', './bitmapfont/HAlign', '../filters/ColorFilter'], function (require, exports, Container, Shape, Graphics, VAlign, HAlign, ColorFilter) {
    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0, 2), 16);
    }
    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2, 4), 16);
    }
    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4, 6), 16);
    }
    function cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h;
    }
    var BitmapTextField = (function (_super) {
        __extends(BitmapTextField, _super);
        function BitmapTextField(width, height, textDisplay, fontName, fontSize, horizantalLetterSpacing, verticalLetterSpacing, hAlign, vAlign, autoScale) {
            if (horizantalLetterSpacing === void 0) { horizantalLetterSpacing = 1; }
            if (verticalLetterSpacing === void 0) { verticalLetterSpacing = 1; }
            if (hAlign === void 0) { hAlign = HAlign.CENTER; }
            if (vAlign === void 0) { vAlign = VAlign.CENTER; }
            if (autoScale === void 0) { autoScale = false; }
            _super.call(this);
            this.font = null;
            this.hAlign = hAlign;
            this.vAlign = vAlign;
            this.autoScale = autoScale;
            this.color = "";
            this.border = new Shape();
            this.border.graphics.setStrokeStyle(2);
            this.border.graphics.beginStroke(Graphics.getRGB(0, 0, 0));
            this.border.graphics.drawRect(0, 0, width, height);
            this.addChild(this.border);
            this.border.visible = false;
            this.textContainer = new Container();
            this.addChild(this.textContainer);
            this.containerWidth = width;
            this.containerHeight = height;
            this.setWidth(width);
            this.setHeight(height);
            this.fontSize = fontSize;
            this.horizantalLetterSpacing = horizantalLetterSpacing;
            this.verticalLetterSpacing = verticalLetterSpacing;
            if (BitmapTextField.bitmapFonts[fontName]) {
                this.font = BitmapTextField.bitmapFonts[fontName];
                if (textDisplay.length > 0) {
                    this.setText(textDisplay);
                }
            }
            else {
                throw new Error("BitmapTextField: Font is not registered " + fontName);
            }
        }
        BitmapTextField.registerBitmapFont = function (bitmapFont, fontName) {
            if (BitmapTextField.bitmapFonts[fontName] == null) {
                BitmapTextField.bitmapFonts[fontName] = bitmapFont;
                return fontName;
            }
            else {
            }
            return null;
        };
        BitmapTextField.prototype.setText = function (textDisplay) {
            this.textContainer.uncache();
            this.textContainer.removeAllChildren();
            var container = this.font.createSprite(this.containerWidth, this.containerHeight, textDisplay, this.fontSize, this.horizantalLetterSpacing, this.verticalLetterSpacing, this.hAlign, this.vAlign, this.autoScale, true);
            this.textContainer.addChild(container);
            if (this.color != "") {
                this.setColor(this.color);
            }
            this.actualWidth = this.font.getWidth();
            this.dispatchEvent(BitmapTextField.EVENT_TEXT_CHANGE);
        };
        BitmapTextField.prototype.getWidth = function () {
            return this.containerWidth;
        };
        BitmapTextField.prototype.getHeight = function () {
            return this.containerHeight;
        };
        BitmapTextField.prototype.getActualWidth = function () {
            return this.actualWidth;
        };
        BitmapTextField.prototype.showBorder = function (visible) {
            if (visible == null) {
                visible = true;
            }
            this.border.visible = visible;
        };
        BitmapTextField.prototype.setColor = function (color) {
            var R = hexToR(color);
            var G = hexToG(color);
            var B = hexToB(color);
            if (color != this.color) {
                this.colorFilter = new ColorFilter(0, 0, 0, 1, R, G, B, 0);
            }
            this.textContainer.filters = [this.colorFilter];
            this.textContainer.cache(0, 0, this.containerWidth, this.containerHeight);
            this.color = color;
        };
        BitmapTextField.EVENT_TEXT_CHANGE = 'text_change';
        BitmapTextField.bitmapFonts = [];
        return BitmapTextField;
    })(Container);
    return BitmapTextField;
});
