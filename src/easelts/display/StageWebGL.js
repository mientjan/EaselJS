/*
 * StageWebGL
 *
 * Copyright (c) 2010 gskinner.com, inc.
 * Copyright (c) 2015 Mient-jan Stelling.
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Stage", "../data/StageOption", "../data/RGBA"], function (require, exports, Stage_1, StageOption_1, RGBA_1) {
    var StageWebGL = (function (_super) {
        __extends(StageWebGL, _super);
        function StageWebGL(canvas, preserveDrawingBuffer, antialias) {
            if (antialias === void 0) { antialias = true; }
            _super.call(this, canvas, new StageOption_1.StageOption({}));
            this._preserveDrawingBuffer = false;
            this._antialias = false;
            this._viewportWidth = 0;
            this._viewportHeight = 0;
            this._projectionMatrix = null;
            this._webGLContext = null;
            this._webGLErrorDetected = false;
            this._clearColor = null;
            this._maxTexturesPerDraw = 1;
            this._maxBoxesPointsPerDraw = null;
            this._maxBoxesPerDraw = null;
            this._maxIndicesPerDraw = null;
            this._shaderProgram = null;
            this._vertices = null;
            this._verticesBuffer = null;
            this._indices = null;
            this._indicesBuffer = null;
            this._currentBoxIndex = -1;
            this._drawTexture = null;
            this._antialias = antialias;
            this._preserveDrawingBuffer = preserveDrawingBuffer;
            this._initializeWebGL();
        }
        StageWebGL.prototype.getContext = function () {
            return this.canvas.getContext('2d');
        };
        Object.defineProperty(StageWebGL.prototype, "isWebGL", {
            get: function () {
                return !!this._webGLContext;
            },
            enumerable: true,
            configurable: true
        });
        StageWebGL.prototype.addChild = function (child) {
            if (child == null) {
                return child;
            }
            if (arguments.length > 1) {
                return this.addChildAt.apply(this, Array.prototype.slice.call(arguments).concat([this.children.length]));
            }
            else {
                return this.addChildAt(child, this.children.length);
            }
        };
        ;
        StageWebGL.prototype.addChildAt = function (child, index) {
            var l = arguments.length;
            var indx = arguments[l - 1];
            if (indx < 0 || indx > this.children.length) {
                return arguments[l - 2];
            }
            if (l > 2) {
                for (var i = 0; i < l - 1; i++) {
                    this.addChildAt(arguments[i], indx + i);
                }
                return arguments[l - 2];
            }
            if (child.type != 16) {
            }
            else {
                console && console.log("Error: You can only add children of type SpriteContainer, Sprite, Bitmap, BitmapText, or DOMElement. [" + child.toString() + "]");
                return child;
            }
            if (!child.image && !child.spriteSheet && child.type != 8) {
                console && console.log("Error: You can only add children that have an image or spriteSheet defined on them. [" + child.toString() + "]");
                return child;
            }
            if (child.parent) {
                child.parent.removeChild(child);
            }
            child.parent = this;
            this.children.splice(index, 0, child);
            return child;
        };
        ;
        StageWebGL.prototype.update = function (delta) {
            if (!this.canvas) {
                return;
            }
            if (this.tickOnUpdate) {
                this.onTick(delta);
            }
            this.dispatchEvent("drawstart");
            if (this._option.autoClear) {
                this.clear();
            }
            var ctx = this._setWebGLContext();
            if (ctx) {
                this.draw(ctx, false);
            }
            else {
                var ctx2d = this.canvas.getContext("2d");
                ctx2d.save();
                this.updateContext(ctx2d);
                this.draw(ctx2d, false);
                ctx2d.restore();
            }
            this.dispatchEvent("drawend");
        };
        ;
        StageWebGL.prototype.clear = function () {
            if (!this.canvas) {
                return;
            }
            var ctx = this._setWebGLContext();
            if (ctx) {
                ctx.clear(ctx.COLOR_BUFFER_BIT);
            }
            else {
                var ctx2d = this.canvas.getContext("2d");
                ctx2d.setTransform(1, 0, 0, 1, 0, 0);
                ctx2d.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
            }
        };
        ;
        StageWebGL.prototype.draw = function (ctx, ignoreCache) {
            if (typeof WebGLRenderingContext !== 'undefined' && (ctx === this._webGLContext || ctx instanceof WebGLRenderingContext)) {
                this._drawWebGLKids(this.children, ctx);
                return true;
            }
            else {
                return _super.prototype.draw.call(this, ctx, ignoreCache);
            }
        };
        ;
        StageWebGL.prototype.updateViewport = function (width, height) {
            this._viewportWidth = width;
            this._viewportHeight = height;
            if (this._webGLContext) {
                this._webGLContext.viewport(0, 0, this._viewportWidth, this._viewportHeight);
                if (!this._projectionMatrix) {
                    this._projectionMatrix = new Float32Array([0, 0, 0, 0, 0, 1, -1, 1, 1]);
                }
                this._projectionMatrix[0] = 2 / width;
                this._projectionMatrix[4] = -2 / height;
            }
        };
        ;
        StageWebGL.prototype.clearImageTexture = function (image) {
            image.__easeljs_texture = null;
        };
        ;
        StageWebGL.prototype.toString = function () {
            return "[StageWebGL (name=" + this.name + ")]";
        };
        ;
        StageWebGL.prototype._initializeWebGL = function () {
            this._option.autoClearColor = new RGBA_1.default();
            this._setWebGLContext();
        };
        ;
        StageWebGL.prototype._setWebGLContext = function () {
            if (this.canvas) {
                if (!this._webGLContext || this._webGLContext.canvas !== this.canvas) {
                    this._initializeWebGLContext();
                }
            }
            else {
                this._webGLContext = null;
            }
            return this._webGLContext;
        };
        ;
        StageWebGL.prototype._initializeWebGLContext = function () {
            var options = {
                depth: false,
                alpha: true,
                preserveDrawingBuffer: this._preserveDrawingBuffer,
                antialias: this._antialias,
                premultipliedAlpha: true
            };
            var autoClearColor = this._option.autoClearColor;
            this._webGLContext = this.canvas.getContext("webgl", options) || this.canvas.getContext("experimental-webgl", options);
            var ctx = this._webGLContext;
            if (!ctx) {
                return;
            }
            this._maxTexturesPerDraw = 1;
            this._setClearColor(autoClearColor.r, autoClearColor.g, autoClearColor.b, autoClearColor.a);
            ctx.enable(ctx.BLEND);
            ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
            ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
            this._createShaderProgram(ctx);
            if (this._webGLErrorDetected) {
                this._webGLContext = null;
                return;
            }
            this._createBuffers(ctx);
            this.updateViewport(this._viewportWidth || this.canvas.width || 0, this._viewportHeight || this.canvas.height || 0);
        };
        ;
        StageWebGL.prototype._setClearColor = function (r, g, b, a) {
            this._option.autoClearColor.r = r;
            this._option.autoClearColor.g = g;
            this._option.autoClearColor.b = b;
            this._option.autoClearColor.a = a;
            if (this._webGLContext) {
                this._webGLContext.clearColor(r, g, b, a);
            }
        };
        ;
        StageWebGL.prototype._createShaderProgram = function (ctx) {
            var fragmentShader = this._createShader(ctx, ctx.FRAGMENT_SHADER, "precision mediump float;" +
                "uniform sampler2D uSampler0;" +
                "varying vec3 vTextureCoord;" +
                "void main(void) {" +
                "vec4 color = texture2D(uSampler0, vTextureCoord.st);" +
                "gl_FragColor = vec4(color.rgb, color.a * vTextureCoord.z);" +
                "}");
            var vertexShader = this._createShader(ctx, ctx.VERTEX_SHADER, "attribute vec2 aVertexPosition;" +
                "attribute vec3 aTextureCoord;" +
                "uniform mat3 uPMatrix;" +
                "varying vec3 vTextureCoord;" +
                "void main(void) {" +
                "vTextureCoord = aTextureCoord;" +
                "gl_Position = vec4((uPMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);" +
                "}");
            if (this._webGLErrorDetected || !fragmentShader || !vertexShader) {
                return;
            }
            var program = ctx.createProgram();
            ctx.attachShader(program, fragmentShader);
            ctx.attachShader(program, vertexShader);
            ctx.linkProgram(program);
            if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
                this._webGLErrorDetected = true;
                return;
            }
            program.vertexPositionAttribute = ctx.getAttribLocation(program, "aVertexPosition");
            program.textureCoordAttribute = ctx.getAttribLocation(program, "aTextureCoord");
            program.sampler0uniform = ctx.getUniformLocation(program, "uSampler0");
            ctx.enableVertexAttribArray(program.vertexPositionAttribute);
            ctx.enableVertexAttribArray(program.textureCoordAttribute);
            program.pMatrixUniform = ctx.getUniformLocation(program, "uPMatrix");
            ctx.useProgram(program);
            this._shaderProgram = program;
        };
        StageWebGL.prototype._createShader = function (ctx, type, str) {
            var shader = ctx.createShader(type);
            ctx.shaderSource(shader, str);
            ctx.compileShader(shader);
            if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
                this._webGLErrorDetected = true;
                return null;
            }
            return shader;
        };
        ;
        StageWebGL.prototype._createBuffers = function (ctx) {
            this._verticesBuffer = ctx.createBuffer();
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this._verticesBuffer);
            var byteCount = StageWebGL.NUM_VERTEX_PROPERTIES * 4;
            ctx.vertexAttribPointer(this._shaderProgram.vertexPositionAttribute, 2, ctx.FLOAT, ctx.FALSE, byteCount, 0);
            ctx.vertexAttribPointer(this._shaderProgram.textureCoordAttribute, 3, ctx.FLOAT, ctx.FALSE, byteCount, 2 * 4);
            this._indicesBuffer = ctx.createBuffer();
            this._setMaxBoxesPoints(ctx, StageWebGL.MAX_BOXES_POINTS_INCREMENT);
        };
        ;
        StageWebGL.prototype._setMaxBoxesPoints = function (ctx, value) {
            this._maxBoxesPointsPerDraw = value;
            this._maxBoxesPerDraw = (this._maxBoxesPointsPerDraw / StageWebGL.POINTS_PER_BOX) | 0;
            this._maxIndicesPerDraw = this._maxBoxesPerDraw * StageWebGL.INDICES_PER_BOX;
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this._verticesBuffer);
            this._vertices = new Float32Array(this._maxBoxesPerDraw * StageWebGL.NUM_VERTEX_PROPERTIES_PER_BOX);
            ctx.bufferData(ctx.ARRAY_BUFFER, this._vertices, ctx.DYNAMIC_DRAW);
            this._indices = new Uint16Array(this._maxIndicesPerDraw);
            for (var i = 0, l = this._indices.length; i < l; i += StageWebGL.INDICES_PER_BOX) {
                var j = i * StageWebGL.POINTS_PER_BOX / StageWebGL.INDICES_PER_BOX;
                this._indices[i] = j;
                this._indices[i + 1] = j + 1;
                this._indices[i + 2] = j + 2;
                this._indices[i + 3] = j;
                this._indices[i + 4] = j + 2;
                this._indices[i + 5] = j + 3;
            }
            ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this._indicesBuffer);
            ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, this._indices, ctx.STATIC_DRAW);
        };
        ;
        StageWebGL.prototype._setupImageTexture = function (ctx, image) {
            if (image && (image.naturalWidth || image.getContext || image.readyState >= 2)) {
                var texture = image.__easeljs_texture;
                if (!texture) {
                    texture = image.__easeljs_texture = ctx.createTexture();
                    ctx.bindTexture(ctx.TEXTURE_2D, texture);
                    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                }
                return texture;
            }
        };
        ;
        StageWebGL.prototype._drawWebGLKids = function (kids, ctx, parentMVMatrix) {
            var kid, mtx, snapToPixelEnabled = this.snapToPixelEnabled, image = null, leftSide = 0, topSide = 0, rightSide = 0, bottomSide = 0, vertices = this._vertices, numVertexPropertiesPerBox = StageWebGL.NUM_VERTEX_PROPERTIES_PER_BOX, maxIndexSize = StageWebGL.MAX_INDEX_SIZE, maxBoxIndex = this._maxBoxesPerDraw - 1;
            for (var i = 0, l = kids.length; i < l; i++) {
                kid = kids[i];
                if (!kid.isVisible()) {
                    continue;
                }
                var image = kid.image || (kid.spriteSheet && kid.spriteSheet._images[0]), texture = image.__easeljs_texture;
                if (!texture && !(texture = this._setupImageTexture(ctx, image))) {
                    continue;
                }
                mtx = kid._matrix;
                mtx = (parentMVMatrix ? mtx.copy(parentMVMatrix) : mtx.identity()).appendTransform(kid.x, kid.y, kid.scaleX, kid.scaleY, kid.rotation, kid.skewX, kid.skewY, kid.regX, kid.regY);
                var uStart = 0, uEnd = 1, vStart = 0, vEnd = 1;
                if (kid.type === 32) {
                    leftSide = 0;
                    topSide = 0;
                    rightSide = image.width;
                    bottomSide = image.height;
                }
                else if (kid.type === 128) {
                    var frame = kid.spriteSheet.getFrame(kid.currentFrame), rect = frame.rect;
                    leftSide = -frame.regX;
                    topSide = -frame.regY;
                    rightSide = leftSide + rect.width;
                    bottomSide = topSide + rect.height;
                    uStart = rect.x / image.width;
                    vStart = rect.y / image.height;
                    uEnd = uStart + (rect.width / image.width);
                    vEnd = vStart + (rect.height / image.height);
                }
                else {
                    image = null;
                    if (kid.type === 512) {
                        kid._updateText();
                    }
                }
                if (!parentMVMatrix && (kid.type == 32 || kid.type == 8 || kid.type == 128) && texture !== this._drawTexture) {
                    this._drawToGPU(ctx);
                    this._drawTexture = texture;
                }
                if (image !== null) {
                    var offset = ++this._currentBoxIndex * numVertexPropertiesPerBox, a = mtx.a, b = mtx.b, c = mtx.c, d = mtx.d, tx = mtx.tx, ty = mtx.ty;
                    if (snapToPixelEnabled && kid.snapToPixel) {
                        tx = tx + (tx < 0 ? -0.5 : 0.5) | 0;
                        ty = ty + (ty < 0 ? -0.5 : 0.5) | 0;
                    }
                    vertices[offset] = leftSide * a + topSide * c + tx;
                    vertices[offset + 1] = leftSide * b + topSide * d + ty;
                    vertices[offset + 5] = leftSide * a + bottomSide * c + tx;
                    vertices[offset + 6] = leftSide * b + bottomSide * d + ty;
                    vertices[offset + 10] = rightSide * a + bottomSide * c + tx;
                    vertices[offset + 11] = rightSide * b + bottomSide * d + ty;
                    vertices[offset + 15] = rightSide * a + topSide * c + tx;
                    vertices[offset + 16] = rightSide * b + topSide * d + ty;
                    vertices[offset + 2] = vertices[offset + 7] = uStart;
                    vertices[offset + 12] = vertices[offset + 17] = uEnd;
                    vertices[offset + 3] = vertices[offset + 18] = vStart;
                    vertices[offset + 8] = vertices[offset + 13] = vEnd;
                    vertices[offset + 4] = vertices[offset + 9] = vertices[offset + 14] = vertices[offset + 19] = kid.alpha;
                    if (this._currentBoxIndex === maxBoxIndex) {
                        this._drawToGPU(ctx);
                        this._drawTexture = texture;
                        if (this._maxBoxesPointsPerDraw < maxIndexSize) {
                            this._setMaxBoxesPoints(ctx, this._maxBoxesPointsPerDraw + StageWebGL.MAX_BOXES_POINTS_INCREMENT);
                            maxBoxIndex = this._maxBoxesPerDraw - 1;
                        }
                    }
                }
                if (kid.children) {
                    this._drawWebGLKids(kid.children, ctx, mtx);
                    maxBoxIndex = this._maxBoxesPerDraw - 1;
                }
            }
            if (!parentMVMatrix) {
                this._drawToGPU(ctx);
            }
        };
        ;
        StageWebGL.prototype._drawToGPU = function (ctx) {
            if (!this._drawTexture) {
                return;
            }
            var numBoxes = this._currentBoxIndex + 1;
            ctx.activeTexture(ctx.TEXTURE0);
            ctx.bindTexture(ctx.TEXTURE_2D, this._drawTexture);
            ctx.uniform1i(this._shaderProgram.sampler0uniform, 0);
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this._verticesBuffer);
            ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this._indicesBuffer);
            ctx.uniformMatrix3fv(this._shaderProgram.pMatrixUniform, false, this._projectionMatrix);
            ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this._vertices);
            ctx.drawElements(ctx.TRIANGLES, numBoxes * StageWebGL.INDICES_PER_BOX, ctx.UNSIGNED_SHORT, 0);
            this._currentBoxIndex = -1;
            this._drawTexture = null;
        };
        StageWebGL.COMPATIBLE = [
            8,
            32,
            1024
        ];
        StageWebGL.NUM_VERTEX_PROPERTIES = 5;
        StageWebGL.POINTS_PER_BOX = 4;
        StageWebGL.NUM_VERTEX_PROPERTIES_PER_BOX = StageWebGL.POINTS_PER_BOX * StageWebGL.NUM_VERTEX_PROPERTIES;
        StageWebGL.INDICES_PER_BOX = 6;
        StageWebGL.MAX_INDEX_SIZE = Math.pow(2, 16);
        StageWebGL.MAX_BOXES_POINTS_INCREMENT = StageWebGL.MAX_INDEX_SIZE / 4;
        return StageWebGL;
    })(Stage_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = StageWebGL;
});
