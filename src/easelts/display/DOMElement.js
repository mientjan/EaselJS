/*
 * DOMElement
 *
 * Copyright (c) 2010 gskinner.com, inc.
 * Copyright (c) 2015 Mient-jan Stelling
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './DisplayObject'], function (require, exports, DisplayObject) {
    var DOMElement = (function (_super) {
        __extends(DOMElement, _super);
        /**
         * Initialization method.
         * @method initialize
         * @param {HTMLElement} htmlElement A reference or id for the DOM element to manage.
         * @protected
         */
        function DOMElement(htmlElement) {
            _super.call(this);
            // public properties:
            /**
             * The DOM object to manage.
             * @property htmlElement
             * @type HTMLElement
             */
            this.htmlElement = null;
            // private properties:
            /**
             * @property _oldMtx
             * @type Matrix2D
             * @protected
             */
            this._oldMtx = null;
            /**
             * @property _visible
             * @type Boolean
             * @protected
             */
            this._visible = false;
            this._drawEndConnection = null;
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
            // this relies on the _tick method because draw isn't called if a parent is not visible.
            style.position = "absolute";
            style.transformOrigin = style['WebkitTransformOrigin'] = style['msTransformOrigin'] = style['MozTransformOrigin'] = style['OTransformOrigin'] = "0% 0%";
        }
        // public methods:
        /**
         * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
         * This does not account for whether it would be visible within the boundaries of the stage.
         * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
         * @method isVisible
         * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
         */
        DOMElement.prototype.isVisible = function () {
            return this.htmlElement != null;
        };
        /**
         * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
         * Returns true if the draw was handled (useful for overriding functionality).
         * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
         * @method draw
         * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
         * @param {Boolean} ignoreCache Indicates whether the draw operation should ignore any current cache.
         * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
         * into itself).
         * @return {Boolean}
         */
        DOMElement.prototype.draw = function (ctx, ignoreCache) {
            // this relies on the _tick method because draw isn't called if a parent is not visible.
            // the actual update happens in _handleDrawEnd
            return true;
        };
        /**
         * Not applicable to DOMElement.
         * @method cache
         */
        DOMElement.prototype.cache = function () {
        };
        /**
         * Not applicable to DOMElement.
         * @method uncache
         */
        DOMElement.prototype.uncache = function () {
        };
        /**
         * Not applicable to DOMElement.
         * @method updateCache
         */
        DOMElement.prototype.updateCache = function () {
        };
        /**
         * Not applicable to DOMElement.
         * @method hitTest
         */
        DOMElement.prototype.hitTest = function (x, y) {
            throw 'hitTest Not applicable to DOMElement.';
        };
        /**
         * Not applicable to DOMElement.
         * @method localToGlobal
         */
        DOMElement.prototype.localToGlobal = function (x, y) {
            throw 'localToGlobal Not applicable to DOMElement.';
        };
        /**
         * Not applicable to DOMElement.
         * @method globalToLocal
         */
        DOMElement.prototype.globalToLocal = function (x, y) {
            throw 'globalToLocal Not applicable to DOMElement.';
        };
        /**
         * Not applicable to DOMElement.
         * @method localToLocal
         */
        DOMElement.prototype.localToLocal = function (x, y) {
            throw 'localToLocal Not applicable to DOMElement.';
        };
        /**
         * DOMElement cannot be cloned. Throws an error.
         * @method clone
         */
        DOMElement.prototype.clone = function () {
            throw ("DOMElement cannot be cloned.");
        };
        /**
         * Returns a string representation of this object.
         * @method toString
         * @return {String} a string representation of the instance.
         */
        DOMElement.prototype.toString = function () {
            return "[DOMElement (name=" + this.name + ")]";
        };
        /**
         * @method _tick
         * @param {Object} props Properties to copy to the DisplayObject {{#crossLink "DisplayObject/tick"}}{{/crossLink}} event object.
         * function.
         * @protected
         */
        DOMElement.prototype.onTick = function (delta) {
            // Do nothing, prevent super class from having onTick called
        };
        DOMElement.prototype.onStageSet = function () {
            this._drawEndConnection = this.stage.drawendSignal.connect(this._handleDrawEnd.bind(this));
        };
        /**
         * @method _handleDrawEnd
         * @param {Event} evt
         * @protected
         */
        DOMElement.prototype._handleDrawEnd = function () {
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
            var n = 10000; // precision
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
            if (this._drawEndConnection) {
                this._drawEndConnection.dispose();
                this._drawEndConnection = null;
            }
        };
        return DOMElement;
    })(DisplayObject);
    return DOMElement;
});
