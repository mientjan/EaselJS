var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Bitmap', '../geom/Rectangle', '../geom/Vector2'], function (require, exports, Bitmap, Rectangle, Vector2) {
    var BitmapProjective = (function (_super) {
        __extends(BitmapProjective, _super);
        function BitmapProjective(imageOrUri, points, x, y, regX, regY) {
            _super.call(this, imageOrUri, 0, 0, x, y, regX, regY);
            this.options = {
                subdivisionLimit: 5,
                patchSize: 8,
                wireframe: false
            };
            this._willUpdateRender = false;
            this.setPoints(points);
        }
        BitmapProjective.prototype.setPoints = function (points) {
            if (points.length == 4) {
                var v2 = [];
                for (var i = 0; i < points.length; i++) {
                    var v = new Vector2(points[i][0], points[i][1]);
                    v2.push(v);
                }
                for (var i = 0; i < v2.length; i++) {
                    var v = v2[i];
                }
                this._points = points;
                var rect = this.getPointsRectangle(this._points);
                if (this.loaded) {
                    this.cache(rect.x, rect.y, rect.width, rect.height);
                }
            }
            else {
                throw new Error('points have to be 4 long');
            }
        };
        BitmapProjective.prototype.uncache = function () {
            throw new Error('can not remove cache from this Bitmap');
        };
        BitmapProjective.prototype.onLoad = function () {
            _super.prototype.onLoad.call(this);
            if (this._points) {
                var rect = this.getPointsRectangle(this._points);
                this.cache(rect.x, rect.x, rect.width, rect.height);
            }
        };
        BitmapProjective.prototype.draw = function (ctx, ignoreCache) {
            if (_super.prototype.DisplayObject_draw.call(this, ctx, ignoreCache)) {
                return true;
            }
            ctx.save();
            this.updatePoints(ctx);
            ctx.restore();
            return true;
        };
        BitmapProjective.prototype.getPointsRectangle = function (points) {
            if (!points || !points.length) {
                console.log(points);
                debugger;
                return;
            }
            var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                minX = Math.min(minX, Math.floor(point[0]));
                maxX = Math.max(maxX, Math.ceil(point[0]));
                minY = Math.min(minY, Math.floor(point[1]));
                maxY = Math.max(maxY, Math.ceil(point[1]));
            }
            return new Rectangle(minX, minY, maxX - minX, maxY - minY);
        };
        BitmapProjective.prototype.updatePoints = function (ctx) {
            var points = this._points;
            if (points.length == 4) {
                var rect = this.getPointsRectangle(points);
                var width = rect.width;
                var height = rect.height;
                var imageWidth = this.image.width;
                var imageHeight = this.image.height;
                var transform = this.getProjectiveTransform(points);
                var ptl = transform.transformProjectiveVector([0, 0, 1]);
                var ptr = transform.transformProjectiveVector([1, 0, 1]);
                var pbl = transform.transformProjectiveVector([0, 1, 1]);
                var pbr = transform.transformProjectiveVector([1, 1, 1]);
                ctx.beginPath();
                ctx.moveTo(ptl[0], ptl[1]);
                ctx.lineTo(ptr[0], ptr[1]);
                ctx.lineTo(pbr[0], pbr[1]);
                ctx.lineTo(pbl[0], pbl[1]);
                ctx.closePath();
                ctx.clip();
                this.divide(ctx, transform, imageWidth, imageHeight, 0, 0, 1, 1, ptl, ptr, pbl, pbr, this.options.subdivisionLimit);
                if (this.options.wireframe) {
                    ctx.beginPath();
                    ctx.moveTo(ptl[0], ptl[1]);
                    ctx.lineTo(ptr[0], ptr[1]);
                    ctx.lineTo(pbr[0], pbr[1]);
                    ctx.lineTo(pbl[0], pbl[1]);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
            else {
                debugger;
            }
        };
        BitmapProjective.prototype.getProjectiveTransform = function (points) {
            var m = new Matrix(9, 8, [
                [1, 1, 1, 0, 0, 0, -points[3][0], -points[3][0], -points[3][0]],
                [0, 1, 1, 0, 0, 0, 0, -points[2][0], -points[2][0]],
                [1, 0, 1, 0, 0, 0, -points[1][0], 0, -points[1][0]],
                [0, 0, 1, 0, 0, 0, 0, 0, -points[0][0]],
                [0, 0, 0, -1, -1, -1, points[3][1], points[3][1], points[3][1]],
                [0, 0, 0, 0, -1, -1, 0, points[2][1], points[2][1]],
                [0, 0, 0, -1, 0, -1, points[1][1], 0, points[1][1]],
                [0, 0, 0, 0, 0, -1, 0, 0, points[0][1]]
            ]);
            var kernel = m.rowEchelon().values;
            var transform = new Matrix(3, 3, [
                [-kernel[0][8], -kernel[1][8], -kernel[2][8]],
                [-kernel[3][8], -kernel[4][8], -kernel[5][8]],
                [-kernel[6][8], -kernel[7][8], 1]
            ]);
            return transform;
        };
        BitmapProjective.prototype.divide = function (ctx, transform, width, height, u1, v1, u4, v4, p1, p2, p3, p4, limit) {
            if (limit) {
                var d1 = [p2[0] + p3[0] - 2 * p1[0], p2[1] + p3[1] - 2 * p1[1]];
                var d2 = [p2[0] + p3[0] - 2 * p4[0], p2[1] + p3[1] - 2 * p4[1]];
                var d3 = [d1[0] + d2[0], d1[1] + d2[1]];
                var r = Math.abs((d3[0] * d3[0] + d3[1] * d3[1]) / (d1[0] * d2[0] + d1[1] * d2[1]));
                d1 = [p2[0] - p1[0] + p4[0] - p3[0], p2[1] - p1[1] + p4[1] - p3[1]];
                d2 = [p3[0] - p1[0] + p4[0] - p2[0], p3[1] - p1[1] + p4[1] - p2[1]];
                var area = Math.abs(d1[0] * d2[1] - d1[1] * d2[0]);
                if ((u1 == 0 && u4 == 1) || ((.25 + r * 5) * area > (this.options.patchSize * this.options.patchSize))) {
                    var umid = (u1 + u4) / 2;
                    var vmid = (v1 + v4) / 2;
                    var pmid = transform.transformProjectiveVector([umid, vmid, 1]);
                    var pt = transform.transformProjectiveVector([umid, v1, 1]);
                    var pb = transform.transformProjectiveVector([umid, v4, 1]);
                    var pl = transform.transformProjectiveVector([u1, vmid, 1]);
                    var pr = transform.transformProjectiveVector([u4, vmid, 1]);
                    limit--;
                    this.divide(ctx, transform, width, height, u1, v1, umid, vmid, p1, pt, pl, pmid, limit);
                    this.divide(ctx, transform, width, height, umid, v1, u4, vmid, pt, p2, pmid, pr, limit);
                    this.divide(ctx, transform, width, height, u1, vmid, umid, v4, pl, pmid, p3, pb, limit);
                    this.divide(ctx, transform, width, height, umid, vmid, u4, v4, pmid, pr, pb, p4, limit);
                    if (this.options.wireframe) {
                        ctx.beginPath();
                        ctx.moveTo(pt[0], pt[1]);
                        ctx.lineTo(pb[0], pb[1]);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(pl[0], pl[1]);
                        ctx.lineTo(pr[0], pr[1]);
                        ctx.stroke();
                    }
                    return;
                }
            }
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.lineTo(p4[0], p4[1]);
            ctx.lineTo(p3[0], p3[1]);
            ctx.closePath();
            var d12 = [p2[0] - p1[0], p2[1] - p1[1]];
            var d24 = [p4[0] - p2[0], p4[1] - p2[1]];
            var d43 = [p3[0] - p4[0], p3[1] - p4[1]];
            var d31 = [p1[0] - p3[0], p1[1] - p3[1]];
            var a1 = Math.abs(d12[0] * d31[1] - d12[1] * d31[0]);
            var a2 = Math.abs(d24[0] * d12[1] - d24[1] * d12[0]);
            var a4 = Math.abs(d43[0] * d24[1] - d43[1] * d24[0]);
            var a3 = Math.abs(d31[0] * d43[1] - d31[1] * d43[0]);
            var amax = Math.max(Math.max(a1, a2), Math.max(a3, a4));
            var dx = 0, dy = 0, padx = 0, pady = 0;
            switch (amax) {
                case a1:
                    {
                        ctx.transform(d12[0], d12[1], -d31[0], -d31[1], p1[0], p1[1]);
                        if (u4 != 1)
                            padx = 1.05 / Math.sqrt(d12[0] * d12[0] + d12[1] * d12[1]);
                        if (v4 != 1)
                            pady = 1.05 / Math.sqrt(d31[0] * d31[0] + d31[1] * d31[1]);
                        break;
                    }
                case a2:
                    {
                        ctx.transform(d12[0], d12[1], d24[0], d24[1], p2[0], p2[1]);
                        if (u4 != 1)
                            padx = 1.05 / Math.sqrt(d12[0] * d12[0] + d12[1] * d12[1]);
                        if (v4 != 1)
                            pady = 1.05 / Math.sqrt(d24[0] * d24[0] + d24[1] * d24[1]);
                        dx = -1;
                        break;
                    }
                case a4:
                    {
                        ctx.transform(-d43[0], -d43[1], d24[0], d24[1], p4[0], p4[1]);
                        if (u4 != 1)
                            padx = 1.05 / Math.sqrt(d43[0] * d43[0] + d43[1] * d43[1]);
                        if (v4 != 1)
                            pady = 1.05 / Math.sqrt(d24[0] * d24[0] + d24[1] * d24[1]);
                        dx = -1;
                        dy = -1;
                        break;
                    }
                case a3:
                    {
                        ctx.transform(-d43[0], -d43[1], -d31[0], -d31[1], p3[0], p3[1]);
                        if (u4 != 1) {
                            padx = 1.05 / Math.sqrt(d43[0] * d43[0] + d43[1] * d43[1]);
                        }
                        if (v4 != 1) {
                            pady = 1.05 / Math.sqrt(d31[0] * d31[0] + d31[1] * d31[1]);
                        }
                        dy = -1;
                        break;
                    }
            }
            var du = (u4 - u1);
            var dv = (v4 - v1);
            var padu = padx * du;
            var padv = pady * dv;
            ctx.drawImage(this.image, u1 * width, v1 * height, Math.min(u4 - u1 + padu, 1) * width, Math.min(v4 - v1 + padv, 1) * height, dx, dy, 1 + padx, 1 + pady);
            ctx.restore();
        };
        BitmapProjective.prototype.toString = function () {
            return "[BitmapProjective (name=" + this.name + ")]";
        };
        BitmapProjective.prototype.destruct = function () {
            this.image = null;
            this.sourceRect = null;
            this.destinationRect = null;
            this._imageNaturalWidth = null;
            this._imageNaturalHeight = null;
            _super.prototype.destruct.call(this);
        };
        return BitmapProjective;
    })(Bitmap);
    var Matrix = (function () {
        function Matrix(w, h, values) {
            this.w = w;
            this.h = h;
            this.values = values || Matrix.allocate(w, h);
        }
        Matrix.allocate = function (w, h) {
            var values = [];
            for (var i = 0; i < h; ++i) {
                values[i] = [];
                for (var j = 0; j < w; ++j) {
                    values[i][j] = 0;
                }
            }
            return values;
        };
        Matrix.cloneValues = function (values) {
            var clone = [];
            for (var i = 0; i < values.length; ++i) {
                clone[i] = [].concat(values[i]);
            }
            return clone;
        };
        Matrix.prototype.add = function (operand) {
            if (operand.w != this.w || operand.h != this.h) {
                throw "Matrix add size mismatch";
            }
            var values = Matrix.allocate(this.w, this.h);
            for (var y = 0; y < this.h; ++y) {
                for (var x = 0; x < this.w; ++x) {
                    values[y][x] = this.values[y][x] + operand.values[y][x];
                }
            }
            return new Matrix(this.w, this.h, values);
        };
        Matrix.prototype.transformProjectiveVector = function (operand) {
            var out = [];
            for (var y = 0; y < this.h; ++y) {
                out[y] = 0;
                for (var x = 0; x < this.w; ++x) {
                    out[y] += this.values[y][x] * operand[x];
                }
            }
            var iz = 1 / (out[out.length - 1]);
            for (var y = 0; y < this.h; ++y) {
                out[y] *= iz;
            }
            return out;
        };
        Matrix.prototype.multiply = function (operand) {
            if (+operand !== operand) {
                if (operand.h != this.w) {
                    throw "Matrix mult size mismatch";
                }
                var values = Matrix.allocate(this.w, this.h);
                for (var y = 0; y < this.h; ++y) {
                    for (var x = 0; x < operand.w; ++x) {
                        var accum = 0;
                        for (var s = 0; s < this.w; s++) {
                            accum += this.values[y][s] * operand.values[s][x];
                        }
                        values[y][x] = accum;
                    }
                }
                return new Matrix(operand.w, this.h, values);
            }
            else {
                var values = Matrix.allocate(this.w, this.h);
                for (var y = 0; y < this.h; ++y) {
                    for (var x = 0; x < this.w; ++x) {
                        values[y][x] = this.values[y][x] * operand;
                    }
                }
                return new Matrix(this.w, this.h, values);
            }
        };
        Matrix.prototype.rowEchelon = function () {
            if (this.w <= this.h) {
                throw "Matrix rowEchelon size mismatch";
            }
            var temp = Matrix.cloneValues(this.values);
            for (var yp = 0; yp < this.h; ++yp) {
                var pivot = temp[yp][yp];
                while (pivot == 0) {
                    for (var ys = yp + 1; ys < this.h; ++ys) {
                        if (temp[ys][yp] != 0) {
                            var tmpRow = temp[ys];
                            temp[ys] = temp[yp];
                            temp[yp] = tmpRow;
                            break;
                        }
                    }
                    if (ys == this.h) {
                        return new Matrix(this.w, this.h, temp);
                    }
                    else {
                        pivot = temp[yp][yp];
                    }
                }
                ;
                var scale = 1 / pivot;
                for (var x = yp; x < this.w; ++x) {
                    temp[yp][x] *= scale;
                }
                for (var y = 0; y < this.h; ++y) {
                    if (y == yp)
                        continue;
                    var factor = temp[y][yp];
                    temp[y][yp] = 0;
                    for (var x = yp + 1; x < this.w; ++x) {
                        temp[y][x] -= factor * temp[yp][x];
                    }
                }
            }
            return new Matrix(this.w, this.h, temp);
        };
        Matrix.prototype.invert = function () {
            if (this.w != this.h) {
                throw "Matrix invert size mismatch";
            }
            var tempArray = Matrix.allocate(this.w * 2, this.h);
            for (var y = 0; y < this.h; ++y) {
                for (var x = 0; x < this.w; ++x) {
                    tempArray[y][x] = this.values[y][x];
                    tempArray[y][x + this.w] = (x == y) ? 1 : 0;
                }
            }
            var tempMtx = new Matrix(this.w * 2, this.h, tempArray);
            tempMtx = tempMtx.rowEchelon();
            var values = Matrix.allocate(this.w, this.h);
            for (var y = 0; y < this.w; ++y) {
                for (var x = 0; x < this.w; ++x) {
                    values[y][x] = tempMtx.values[y][x + this.w];
                }
            }
            return new Matrix(this.w, this.h, values);
        };
        return Matrix;
    })();
    return BitmapProjective;
});
