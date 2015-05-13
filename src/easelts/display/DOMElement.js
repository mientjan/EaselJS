var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './DisplayObject'], function (require, exports, DisplayObject) {
    var DOMElement = (function (_super) {
        __extends(DOMElement, _super);
        function DOMElement(htmlElement) {
            _super.call(this);
            this.htmlElement = null;
            this._oldMtx = null;
            this._visible = false;
            var htmlDomElement;
            if (typeof htmlElement == 'string') {
                htmlDomElement = document.getElementById(htmlElement);
            }
            else {
                htmlDomElement = htmlElement;
            }
            this.mouseEnabled = false;
            this.htmlElement = htmlDomElement;
            var style = htmlDomElement.style;
            style.position = "absolute";
            style.transformOrigin = style['WebkitTransformOrigin'] = style['msTransformOrigin'] = style['MozTransformOrigin'] = style['OTransformOrigin'] = "0% 0%";
        }
        DOMElement.prototype.isVisible = function () {
            return this.htmlElement != null;
        };
        DOMElement.prototype.draw = function (ctx, ignoreCache) {
            var o = this.htmlElement;
            if (!o) {
                return;
            }
            var style = o.style;
            var mtx = this.getConcatenatedMatrix(this._matrix);
            var visibility = mtx.visible ? "visible" : "hidden";
            if (visibility != style.visibility) {
                style.visibility = visibility;
            }
            if (!mtx.visible) {
                return;
            }
            var oMtx = this._oldMtx;
            var n = 10000;
            if (!oMtx || oMtx.alpha != mtx.alpha) {
                style.opacity = "" + (mtx.alpha * n | 0) / n;
                if (oMtx) {
                    oMtx.alpha = mtx.alpha;
                }
            }
            if (!oMtx || oMtx.tx != mtx.tx || oMtx.ty != mtx.ty || oMtx.a != mtx.a || oMtx.b != mtx.b || oMtx.c != mtx.c || oMtx.d != mtx.d) {
                var str = "matrix(" + (mtx.a * n | 0) / n + "," + (mtx.b * n | 0) / n + "," + (mtx.c * n | 0) / n + "," + (mtx.d * n | 0) / n + "," + (mtx.tx + 0.5 | 0);
                style.transform = style['WebkitTransform'] = style['OTransform'] = style['msTransform'] = str + "," + (mtx.ty + 0.5 | 0) + ")";
                style['MozTransform'] = str + "px," + (mtx.ty + 0.5 | 0) + "px)";
                this._oldMtx = oMtx ? oMtx.copy(mtx) : mtx.clone();
            }
            return true;
        };
        DOMElement.prototype.cache = function () {
        };
        DOMElement.prototype.uncache = function () {
        };
        DOMElement.prototype.updateCache = function () {
        };
        DOMElement.prototype.hitTest = function (x, y) {
            throw 'hitTest Not applicable to DOMElement.';
        };
        DOMElement.prototype.localToGlobal = function (x, y) {
            throw 'localToGlobal Not applicable to DOMElement.';
        };
        DOMElement.prototype.globalToLocal = function (x, y) {
            throw 'globalToLocal Not applicable to DOMElement.';
        };
        DOMElement.prototype.localToLocal = function (x, y) {
            throw 'localToLocal Not applicable to DOMElement.';
        };
        DOMElement.prototype.clone = function () {
            throw ("DOMElement cannot be cloned.");
        };
        DOMElement.prototype.toString = function () {
            return "[DOMElement (name=" + this.name + ")]";
        };
        DOMElement.prototype.onTick = function (delta) {
        };
        return DOMElement;
    })(DisplayObject);
    return DOMElement;
});
