var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './DisplayObject', '../geom/Rectangle', '../util/Methods'], function (require, exports, DisplayObject, Rectangle, Methods) {
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(text, font, color, width, height, x, y, regX, regY) {
            if (font === void 0) { font = '10px sans-serif'; }
            if (color === void 0) { color = '#000000'; }
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            _super.call(this, width, height, x, y, regX, regY);
            this.isDebugMode = false;
            this._text = "";
            this.font = null;
            this.color = null;
            this.textAlign = Text.TEXT_ALIGN_LEFT;
            this.textBaseline = Text.TEXT_BASELINE_TOP;
            this.maxWidth = null;
            this.outline = 0;
            this.lineHeight = 0;
            this.lineWidth = null;
            this._autoWidth = false;
            this._autoHeight = false;
            if (text.length == 0) {
                text = " ";
            }
            this.text = text;
            this.font = font;
            this.color = color;
        }
        Object.defineProperty(Text.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                value = value.replace(/\s+\n|\n\s+/g, "\n");
                if (this._text != value) {
                    this._text = value;
                    if (this._autoWidth) {
                        this.setWidth('auto');
                    }
                    if (this._autoHeight) {
                        this.setHeight('auto');
                    }
                }
                this.dispatchEvent(Text.EVENT_ON_TEXT_CHANGE);
            },
            enumerable: true,
            configurable: true
        });
        Text.prototype.setWidth = function (value) {
            if (value == 'auto') {
                this._autoWidth = true;
                _super.prototype.setWidth.call(this, this.getBounds().width);
            }
            else {
                this._autoWidth = false;
                _super.prototype.setWidth.call(this, value);
            }
        };
        Text.prototype.setHeight = function (value) {
            if (value == 'auto') {
                this._autoHeight = true;
                _super.prototype.setHeight.call(this, this.getMeasuredHeight());
            }
            else {
                this._autoHeight = false;
                _super.prototype.setHeight.call(this, value);
            }
        };
        Text.prototype.isVisible = function () {
            var hasContent = this.cacheCanvas || (this.text != null && this.text !== "");
            return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        Text.prototype.draw = function (ctx, ignoreCache) {
            if (_super.prototype.draw.call(this, ctx, ignoreCache)) {
                return true;
            }
            var col = this.color || "#000";
            if (this.outline) {
                ctx.strokeStyle = col;
                ctx.lineWidth = this.outline * 1;
            }
            else {
                ctx.fillStyle = col;
            }
            this._drawText(this._prepContext(ctx));
            ctx.save();
            if (this.isDebugMode) {
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#FFF';
                ctx.rect(0, 0, this.width, this.height);
                ctx.stroke();
            }
            ctx.restore();
            return true;
        };
        Text.prototype.getMeasuredWidth = function () {
            return this._drawText(null, {}).width;
        };
        Text.prototype.getExactSize = function () {
            var width = Math.ceil(this.getMeasuredWidth());
            var height = Math.ceil(this.getMeasuredHeight() * 1.4);
            var rowHeight = Math.ceil(this._getMeasuredWidth('M') * 2);
            var cacheArguments = null;
            var color = this.color;
            this.color = '#00000';
            var y = 0;
            var x = 0;
            switch (this.textAlign) {
                case Text.TEXT_ALIGN_CENTER:
                    {
                        x = -width / 2;
                        break;
                    }
                case Text.TEXT_ALIGN_END:
                case Text.TEXT_ALIGN_RIGHT:
                    {
                        x = -width;
                        break;
                    }
            }
            switch (this.textBaseline) {
                case Text.TEXT_BASELINE_ALPHABETIC:
                    {
                        y = -rowHeight;
                        break;
                    }
                case Text.TEXT_BASELINE_BOTTOM:
                    {
                        y = -rowHeight;
                        break;
                    }
                case Text.TEXT_BASELINE_TOP:
                case Text.TEXT_BASELINE_HANGING:
                    {
                        break;
                    }
                case Text.TEXT_BASELINE_IDEOGRAPHIC:
                    {
                        y = -rowHeight;
                        break;
                    }
                case Text.TEXT_BASELINE_MIDDLE:
                    {
                        y = -rowHeight / 2;
                        break;
                    }
            }
            if (this.cacheCanvas) {
                cacheArguments = [this._cacheX, this._cacheY, this._cacheWidth, this._cacheHeight, this._cacheScale];
            }
            this.cache(x, y, width, height, 1);
            var ctx = this.cacheCanvas.getContext('2d');
            var img = ctx.getImageData(0, 0, width, height);
            if (cacheArguments) {
                this.cache.apply(this, cacheArguments);
            }
            else {
                this.uncache();
            }
            var data = img.data, x0 = width, y0 = height, x1 = 0, y1 = 0;
            for (var i = 3, l = data.length, p = 0; i < l; i += 4, ++p) {
                var px = p % width;
                var py = Math.floor(p / width);
                if (data[i - 3] > 0 || data[i - 2] > 0 || data[i - 1] > 0 || data[i] > 0) {
                    x0 = Math.min(x0, px);
                    y0 = Math.min(y0, py);
                    x1 = Math.max(x1, px);
                    y1 = Math.max(y1, py);
                }
            }
            this.color = color;
            x0 += x;
            y0 += y;
            x1 += x;
            y1 += y;
            return new Rectangle(x0, y0, x1 - x0, y1 - y0);
        };
        Text.prototype.getMeasuredLineHeight = function () {
            return this._getMeasuredWidth("M") * 1.2;
        };
        Text.prototype.getMeasuredHeight = function () {
            return this._drawText(null, {}).height;
        };
        Text.prototype.getBounds = function () {
            var rect = _super.prototype.getBounds.call(this);
            if (rect) {
                return rect;
            }
            if (this.text == null || this.text == "") {
                return null;
            }
            var o = this._drawText(null, {});
            var w = (this.maxWidth && this.maxWidth < o.width) ? this.maxWidth : o.width;
            var x = w * Text.H_OFFSETS[this.textAlign];
            var lineHeight = this.lineHeight || this.getMeasuredLineHeight();
            var y = lineHeight * Text.V_OFFSETS[this.textBaseline];
            return this._rectangle.setProperies(x, y, w, o.height);
        };
        Text.prototype.getMetrics = function () {
            var o = { lines: [] };
            o.lineHeight = this.lineHeight || this.getMeasuredLineHeight();
            o.vOffset = o.lineHeight * Text.V_OFFSETS[this.textBaseline];
            return this._drawText(null, o, o.lines);
        };
        Text.prototype.clone = function () {
            var o = new Text(this.text, this.font, this.color);
            this.cloneProps(o);
            return o;
        };
        Text.prototype.toString = function () {
            return "[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]";
        };
        Text.prototype.cloneProps = function (o) {
            _super.prototype.cloneProps.call(this, o);
            o.textAlign = this.textAlign;
            o.textBaseline = this.textBaseline;
            o.maxWidth = this.maxWidth;
            o.outline = this.outline;
            o.lineHeight = this.lineHeight;
            o.lineWidth = this.lineWidth;
        };
        Text.prototype._prepContext = function (ctx) {
            ctx.font = this.font;
            ctx.textAlign = this.textAlign;
            ctx.textBaseline = this.textBaseline;
            return ctx;
        };
        Text.prototype._drawText = function (ctx, o, lines) {
            var paint = !!ctx;
            if (!paint) {
                ctx = Text._workingContext;
                ctx.save();
                this._prepContext(ctx);
            }
            var lineHeight = this.lineHeight || this.getMeasuredLineHeight();
            var maxW = 0, count = 0;
            var hardLines = String(this._text).split(/(?:\r\n|\r|\n)/);
            for (var i = 0, l = hardLines.length; i < l; i++) {
                var str = hardLines[i];
                var w = null;
                if (this.lineWidth != null && (w = ctx.measureText(str).width) > this.lineWidth) {
                    var words = str.split(/(\s)/);
                    str = words[0];
                    w = ctx.measureText(str).width;
                    for (var j = 1, jl = words.length; j < jl; j += 2) {
                        var wordW = ctx.measureText(words[j] + words[j + 1]).width;
                        if (w + wordW > this.lineWidth) {
                            if (paint) {
                                this._drawTextLine(ctx, str, count * lineHeight);
                            }
                            if (lines) {
                                lines.push(str);
                            }
                            if (w > maxW) {
                                maxW = w;
                            }
                            str = words[j + 1];
                            w = ctx.measureText(str).width;
                            count++;
                        }
                        else {
                            str += words[j] + words[j + 1];
                            w += wordW;
                        }
                    }
                }
                if (paint) {
                    this._drawTextLine(ctx, str, count * lineHeight);
                }
                if (lines) {
                    lines.push(str);
                }
                if (o && w == null) {
                    w = ctx.measureText(str).width;
                }
                if (w > maxW) {
                    maxW = w;
                }
                count++;
            }
            if (o) {
                o.width = maxW;
                o.height = count * lineHeight;
            }
            if (!paint) {
                ctx.restore();
            }
            return o;
        };
        Text.prototype._drawTextLine = function (ctx, text, y) {
            if (this.outline) {
                ctx.strokeText(text, 0, y, this.maxWidth || 0xFFFF);
            }
            else {
                ctx.fillText(text, 0, y, this.maxWidth || 0xFFFF);
            }
        };
        Text.prototype._getMeasuredWidth = function (text) {
            var ctx = Text._workingContext;
            ctx.save();
            var w = this._prepContext(ctx).measureText(text).width;
            ctx.restore();
            return w;
        };
        Text.EVENT_ON_TEXT_CHANGE = 'onTextChange';
        Text.TEXT_BASELINE_TOP = 'top';
        Text.TEXT_BASELINE_HANGING = 'hanging';
        Text.TEXT_BASELINE_MIDDLE = 'middle';
        Text.TEXT_BASELINE_ALPHABETIC = 'alphabetic';
        Text.TEXT_BASELINE_IDEOGRAPHIC = 'ideographic';
        Text.TEXT_BASELINE_BOTTOM = 'bottom';
        Text.TEXT_ALIGN_START = 'start';
        Text.TEXT_ALIGN_END = 'end';
        Text.TEXT_ALIGN_LEFT = 'left';
        Text.TEXT_ALIGN_RIGHT = 'right';
        Text.TEXT_ALIGN_CENTER = 'center';
        Text.TEXT_ALIGN_BOTTOM = 'bottom';
        Text.H_OFFSETS = { start: 0, left: 0, center: -0.5, end: -1, right: -1 };
        Text.V_OFFSETS = { top: 0, hanging: -0.01, middle: -0.4, alphabetic: -0.8, ideographic: -0.85, bottom: -1 };
        return Text;
    })(DisplayObject);
    var canvas = Methods.createCanvas();
    if (canvas.getContext) {
        Text._workingContext = canvas.getContext("2d");
        canvas.width = canvas.height = 1;
    }
    return Text;
});
