define(["require", "exports"], function (require, exports) {
    "use strict";
    var CanvasMaskManager = (function () {
        function CanvasMaskManager(renderer) {
            this.renderer = renderer;
        }
        CanvasMaskManager.prototype.pushMask = function (maskData) {
            var renderer = this.renderer;
            renderer.context.save();
            var cacheAlpha = maskData.alpha;
            var transform = maskData.projectionMatrix2d;
            var resolution = renderer.resolution;
            renderer.context.setTransform(transform.a * resolution, transform.b * resolution, transform.c * resolution, transform.d * resolution, transform.tx * resolution, transform.ty * resolution);
            if (!maskData._texture) {
                this.renderGraphicsShape(maskData);
                renderer.context.clip();
            }
            maskData.worldAlpha = cacheAlpha;
        };
        CanvasMaskManager.prototype.renderGraphicsShape = function (graphics) {
            var context = this.renderer.context;
            var len = graphics.graphicsData.length;
            if (len === 0) {
                return;
            }
            context.beginPath();
            for (var i = 0; i < len; i++) {
                var data = graphics.graphicsData[i];
                var shape = data.shape;
                if (data.type === CONST.SHAPES.POLY) {
                    var points = shape.points;
                    context.moveTo(points[0], points[1]);
                    for (var j = 1; j < points.length / 2; j++) {
                        context.lineTo(points[j * 2], points[j * 2 + 1]);
                    }
                    if (points[0] === points[points.length - 2] && points[1] === points[points.length - 1]) {
                        context.closePath();
                    }
                }
                else if (data.type === CONST.SHAPES.RECT) {
                    context.rect(shape.x, shape.y, shape.width, shape.height);
                    context.closePath();
                }
                else if (data.type === CONST.SHAPES.CIRC) {
                    context.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                    context.closePath();
                }
                else if (data.type === CONST.SHAPES.ELIP) {
                    var w = shape.width * 2;
                    var h = shape.height * 2;
                    var x = shape.x - w / 2;
                    var y = shape.y - h / 2;
                    var kappa = 0.5522848, ox = (w / 2) * kappa, oy = (h / 2) * kappa, xe = x + w, ye = y + h, xm = x + w / 2, ym = y + h / 2;
                    context.moveTo(x, ym);
                    context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                    context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                    context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                    context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
                    context.closePath();
                }
                else if (data.type === CONST.SHAPES.RREC) {
                    var rx = shape.x;
                    var ry = shape.y;
                    var width = shape.width;
                    var height = shape.height;
                    var radius = shape.radius;
                    var maxRadius = Math.min(width, height) / 2 | 0;
                    radius = radius > maxRadius ? maxRadius : radius;
                    context.moveTo(rx, ry + radius);
                    context.lineTo(rx, ry + height - radius);
                    context.quadraticCurveTo(rx, ry + height, rx + radius, ry + height);
                    context.lineTo(rx + width - radius, ry + height);
                    context.quadraticCurveTo(rx + width, ry + height, rx + width, ry + height - radius);
                    context.lineTo(rx + width, ry + radius);
                    context.quadraticCurveTo(rx + width, ry, rx + width - radius, ry);
                    context.lineTo(rx + radius, ry);
                    context.quadraticCurveTo(rx, ry, rx, ry + radius);
                    context.closePath();
                }
            }
        };
        CanvasMaskManager.prototype.popMask = function (renderer) {
            renderer.context.restore();
        };
        CanvasMaskManager.prototype.destroy = function () {
        };
        return CanvasMaskManager;
    }());
    exports.CanvasMaskManager = CanvasMaskManager;
});
