/*
 * MouseEvent
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
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
define(["require", "exports", '../../createts/event/Event'], function (require, exports, Event) {
    var MouseEvent = (function (_super) {
        __extends(MouseEvent, _super);
        function MouseEvent(type, bubbles, cancelable, stageX, stageY, nativeEvent, pointerID, primary, rawX, rawY) {
            _super.call(this, type, bubbles, cancelable);
            this.stageX = 0;
            this.stageY = 0;
            this.rawX = 0;
            this.rawY = 0;
            this.nativeEvent = null;
            this.pointerID = 0;
            this.primary = false;
            this.getLocalX = this._get_localX;
            this.getLocalY = this._get_localY;
            this.stageX = stageX;
            this.stageY = stageY;
            this.nativeEvent = nativeEvent;
            this.pointerID = pointerID;
            this.primary = primary;
            this.rawX = (rawX == null) ? stageX : rawX;
            this.rawY = (rawY == null) ? stageY : rawY;
        }
        MouseEvent.prototype._get_localX = function () {
            return this.currentTarget.globalToLocal(this.rawX, this.rawY).x;
        };
        MouseEvent.prototype._get_localY = function () {
            return this.currentTarget.globalToLocal(this.rawX, this.rawY).y;
        };
        MouseEvent.prototype.clone = function () {
            var m = new MouseEvent(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY);
            m.target = this.target;
            return m;
        };
        MouseEvent.prototype.toString = function () {
            return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]";
        };
        return MouseEvent;
    })(Event);
    return MouseEvent;
});
