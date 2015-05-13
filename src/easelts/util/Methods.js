define(["require", "exports"], function (require, exports) {
    function createCanvas() {
        return document.createElement('canvas');
    }
    exports.createCanvas = createCanvas;
    function createImage(src, onLoad) {
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
    }
    exports.createImage = createImage;
    function tryCatch(fn, context, args) {
        try {
            return fn.apply(context, args);
        }
        catch (e) {
            var errorObject = {};
            errorObject.value = e;
            return errorObject;
        }
    }
    exports.tryCatch = tryCatch;
});
