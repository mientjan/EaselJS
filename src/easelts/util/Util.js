define(["require", "exports"], function (require, exports) {
    "use strict";
    var Util = (function () {
        function Util() {
        }
        Util.createCanvas = function () {
            return document.createElement('canvas');
        };
        Util.createImage = function (src, onLoad) {
            if (src === void 0) { src = null; }
            if (onLoad === void 0) { onLoad = null; }
            var img = document.createElement('img');
            if (onLoad) {
                img.onload = onLoad;
            }
            if (src) {
                img.src = src;
            }
            return img;
        };
        Util.tryCatch = function (fn, context, args) {
            try {
                return fn.apply(context, args);
            }
            catch (e) {
                var errorObject = {};
                errorObject.value = e;
                return errorObject;
            }
        };
        Util.prototype.getContextSmoothProperty = function (context) {
            if (context === void 0) { context = Util.createCanvas().getContext('2d'); }
            var smoothProperty = 'imageSmoothingEnabled';
            if (!context['imageSmoothingEnabled']) {
                if (context['webkitImageSmoothingEnabled']) {
                    smoothProperty = 'webkitImageSmoothingEnabled';
                }
                else if (context['mozImageSmoothingEnabled']) {
                    smoothProperty = 'mozImageSmoothingEnabled';
                }
                else if (context['oImageSmoothingEnabled']) {
                    smoothProperty = 'oImageSmoothingEnabled';
                }
                else if (context['msImageSmoothingEnabled']) {
                    smoothProperty = 'msImageSmoothingEnabled';
                }
            }
            return smoothProperty;
        };
        return Util;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Util;
});
