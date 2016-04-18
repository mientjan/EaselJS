var CanvasMaskManager = (function () {
    function CanvasMaskManager() {
    }
    CanvasMaskManager.prototype.pushMask = function (maskData, renderer) {
        renderer.context.save();
        var cacheAlpha = maskData.alpha;
        var transform = maskData.worldTransform;
        var resolution = renderer.resolution;
        renderer.context.setTransform(transform.a * resolution, transform.b * resolution, transform.c * resolution, transform.d * resolution, transform.tx * resolution, transform.ty * resolution);
        if (!maskData.texture) {
            renderer.context.clip();
        }
        maskData.worldAlpha = cacheAlpha;
    };
    CanvasMaskManager.prototype.popMask = function (renderer) {
        renderer.context.restore();
    };
    CanvasMaskManager.prototype.destruct = function () { };
    ;
    return CanvasMaskManager;
}());
