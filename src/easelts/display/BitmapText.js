var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Container', './Sprite'], function (require, exports, Container, Sprite) {
    var BitmapTextProperties = (function () {
        function BitmapTextProperties() {
            this.text = '';
            this.spriteSheet = null;
            this.lineHeight = 0;
            this.letterSpacing = 0;
            this.spaceWidth = 0;
        }
        return BitmapTextProperties;
    })();
    var BitmapText = (function (_super) {
        __extends(BitmapText, _super);
        function BitmapText(text, spriteSheet) {
            _super.call(this);
            this.text = "";
            this.spriteSheet = null;
            this.lineHeight = 0;
            this.letterSpacing = 0;
            this.spaceWidth = 0;
            this._oldProps = new BitmapTextProperties();
            this.text = text;
            this.spriteSheet = spriteSheet;
        }
        BitmapText.prototype.draw = function (ctx, ignoreCache) {
            this._updateText();
            _super.prototype.draw.call(this, ctx, ignoreCache);
            return true;
        };
        BitmapText.prototype.getBounds = function () {
            this._updateText();
            return _super.prototype.getBounds.call(this);
        };
        BitmapText.prototype.isVisible = function () {
            var hasContent = this.cacheCanvas || (this.spriteSheet && this.spriteSheet.complete && this.text);
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        BitmapText.prototype._getFrameIndex = function (character, spriteSheet) {
            var c, o = spriteSheet.getAnimation(character);
            if (!o) {
                (character != (c = character.toUpperCase())) || (character != (c = character.toLowerCase())) || (c = null);
                if (c) {
                    o = spriteSheet.getAnimation(c);
                }
            }
            return o && o.frames[0];
        };
        BitmapText.prototype._getFrame = function (character, spriteSheet) {
            var index = this._getFrameIndex(character, spriteSheet);
            return index == null ? index : spriteSheet.getFrame(index);
        };
        BitmapText.prototype._getLineHeight = function (ss) {
            var frame = this._getFrame("1", ss) || this._getFrame("T", ss) || this._getFrame("L", ss) || ss.getFrame(0);
            return frame ? frame.rect.height : 1;
        };
        BitmapText.prototype._getSpaceWidth = function (ss) {
            var frame = this._getFrame("1", ss) || this._getFrame("l", ss) || this._getFrame("e", ss) || this._getFrame("a", ss) || ss.getFrame(0);
            return frame ? frame.rect.width : 1;
        };
        BitmapText.prototype._updateText = function () {
            var x = 0, y = 0, oldProperties = this._oldProps, change = false, spaceW = this.spaceWidth, lineH = this.lineHeight, ss = this.spriteSheet;
            var pool = BitmapText._spritePool, kids = this.children, childIndex = 0, numKids = kids.length, sprite;
            for (var n in oldProperties) {
                if (oldProperties[n] != this[n]) {
                    oldProperties[n] = this[n];
                    change = true;
                }
            }
            if (!change) {
                return;
            }
            var hasSpace = !!this._getFrame(" ", ss);
            if (!hasSpace && spaceW == 0) {
                spaceW = this._getSpaceWidth(ss);
            }
            if (lineH == 0) {
                lineH = this._getLineHeight(ss);
            }
            for (var i = 0, l = this.text.length; i < l; i++) {
                var character = this.text.charAt(i);
                if (character == " " && !hasSpace) {
                    x += spaceW;
                    continue;
                }
                else if (character == "\n" || character == "\r") {
                    if (character == "\r" && this.text.charAt(i + 1) == "\n") {
                        i++;
                    }
                    x = 0;
                    y += lineH;
                    continue;
                }
                var index = this._getFrameIndex(character, ss);
                if (index == null) {
                    continue;
                }
                if (childIndex < numKids) {
                    sprite = kids[childIndex];
                }
                else {
                    sprite = this.addChild(pool.length ? pool.pop() : new Sprite(ss));
                    numKids++;
                }
                sprite.spriteSheet = ss;
                sprite.gotoAndStop(index);
                sprite.x = x;
                sprite.y = y;
                childIndex++;
                x += sprite.getBounds().width + this.letterSpacing;
            }
            while (numKids > childIndex) {
                pool.push(sprite = kids.pop());
                sprite.parent = null;
                numKids--;
            }
            if (pool.length > BitmapText.maxPoolSize) {
                pool.length = BitmapText.maxPoolSize;
            }
        };
        BitmapText.maxPoolSize = 100;
        BitmapText._spritePool = [];
        return BitmapText;
    })(Container);
    return BitmapText;
});
