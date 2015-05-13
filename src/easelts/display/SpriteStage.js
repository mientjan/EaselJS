var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Stage'], function (require, exports, Stage) {
    var SpriteStage = (function (_super) {
        __extends(SpriteStage, _super);
        function SpriteStage(canvas, preserveDrawingBuffer, antialias) {
            var _this = this;
            _super.call(this, canvas);
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
            this.update = function (params) {
                if (!_this.canvas) {
                    return;
                }
                if (_this.tickOnUpdate) {
                    _this.tickstartSignal.emit();
                    _this.onTick(params);
                    _this.tickendSignal.emit();
                }
                _this.drawstartSignal.emit();
                if (_this.autoClear) {
                    _this.clear();
                }
                var gl = _this._setWebGLContext();
                if (gl) {
                    _this.draw(gl, false);
                }
                else {
                    var ctx = _this.canvas.getContext("2d");
                    ctx.save();
                    _this.updateContext(ctx);
                    _this.draw(ctx, false);
                    ctx.restore();
                }
                _this.drawendSignal.emit();
            };
            this._preserveDrawingBuffer = preserveDrawingBuffer !== undefined ? preserveDrawingBuffer : this._preserveDrawingBuffer;
            this._antialias = antialias !== undefined ? antialias : this._antialias;
            this._initializeWebGL();
        }
        SpriteStage.prototype._get_isWebGL = function () {
            return !!this._webGLContext;
        };
        Object.defineProperty(SpriteStage.prototype, "isWebGL", {
            get: function () {
                return this._get_isWebGL();
            },
            enumerable: true,
            configurable: true
        });
        SpriteStage.prototype.addChild = function (child) {
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
        SpriteStage.prototype.addChildAt = function (child, index) {
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
            if (child._spritestage_compatibility >= 1) {
            }
            else {
                console && console.log("Error: You can only add children of type SpriteContainer, Sprite, Bitmap, BitmapText, or DOMElement. [" + child.toString() + "]");
                return child;
            }
            if (!child.image && !child.spriteSheet && child._spritestage_compatibility <= 4) {
                console && console.log("Error: You can only add children that have an image or spriteSheet defined on them. [" + child.toString() + "]");
                return child;
            }
            if (child.parent) {
                child.parent.removeChild(child);
            }
            child.parent = this;
            this.children.splice(index, 0, child);
            this._setUpKidTexture(this._webGLContext, child);
            return child;
        };
        SpriteStage.prototype.clear = function () {
            if (!this.canvas) {
                return;
            }
            var gl = this._setWebGLContext();
            if (gl) {
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            else {
                var ctx = this.canvas.getContext("2d");
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
            }
        };
        SpriteStage.prototype.draw = function (ctxOrGl, ignoreCache) {
            if (ctxOrGl === this._webGLContext || ctxOrGl instanceof WebGLRenderingContext) {
                this._drawWebGLKids(this.children, ctxOrGl);
                if (this._drawTexture) {
                    this._drawToGPU(ctxOrGl);
                }
                return true;
            }
            else {
                return _super.prototype.draw.call(this, ctxOrGl, ignoreCache);
            }
        };
        SpriteStage.prototype.updateViewport = function (width, height) {
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
        SpriteStage.prototype.clearImageTexture = function (image) {
            image['__easeljs_texture'] = null;
        };
        SpriteStage.prototype.toString = function () {
            return "[SpriteStage (name=" + this.name + ")]";
        };
        SpriteStage.prototype._initializeWebGL = function () {
            this._clearColor = { r: 0.0, g: 0.0, b: 0.0, a: 0.0 };
            this._setWebGLContext();
        };
        SpriteStage.prototype._setWebGLContext = function () {
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
        SpriteStage.prototype._initializeWebGLContext = function () {
            var options = {
                depth: false,
                alpha: true,
                preserveDrawingBuffer: this._preserveDrawingBuffer,
                antialias: this._antialias,
                premultipliedAlpha: true
            };
            var ctx = this._webGLContext = this.canvas.getContext("webgl", options) || this.canvas.getContext("experimental-webgl", options);
            if (!ctx) {
                return;
            }
            this._maxTexturesPerDraw = 1;
            this._setClearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearColor.a);
            ctx.enable(ctx.BLEND);
            ctx.blendFuncSeparate(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA, ctx.ONE, ctx.ONE_MINUS_SRC_ALPHA);
            ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
            this._createShaderProgram(ctx);
            if (this._webGLErrorDetected) {
                this._webGLContext = null;
                return;
            }
            this._createBuffers(ctx);
            this.updateViewport(this._viewportWidth || this.canvas.width || 0, this._viewportHeight || this.canvas.height || 0);
        };
        SpriteStage.prototype._setClearColor = function (r, g, b, a) {
            this._clearColor.r = r;
            this._clearColor.g = g;
            this._clearColor.b = b;
            this._clearColor.a = a;
            if (this._webGLContext) {
                this._webGLContext.clearColor(r, g, b, a);
            }
        };
        SpriteStage.prototype._createShaderProgram = function (ctx) {
            var fragmentShader = this._createShader(ctx, ctx.FRAGMENT_SHADER, "precision mediump float;" + "uniform sampler2D uSampler0;" + "varying vec3 vTextureCoord;" + "void main(void) {" + "vec4 color = texture2D(uSampler0, vTextureCoord.st);" + "gl_FragColor = vec4(color.rgb, color.a * vTextureCoord.z);" + "}");
            var vertexShader = this._createShader(ctx, ctx.VERTEX_SHADER, "attribute vec2 aVertexPosition;" + "attribute vec3 aTextureCoord;" + "uniform mat3 uPMatrix;" + "varying vec3 vTextureCoord;" + "void main(void) {" + "vTextureCoord = aTextureCoord;" + "gl_Position = vec4((uPMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);" + "}");
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
        SpriteStage.prototype._createShader = function (ctx, type, str) {
            var shader = ctx.createShader(type);
            ctx.shaderSource(shader, str);
            ctx.compileShader(shader);
            if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
                this._webGLErrorDetected = true;
                return null;
            }
            return shader;
        };
        SpriteStage.prototype._createBuffers = function (ctx) {
            this._verticesBuffer = ctx.createBuffer();
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this._verticesBuffer);
            var byteCount = SpriteStage.NUM_VERTEX_PROPERTIES * 4;
            ctx.vertexAttribPointer(this._shaderProgram.vertexPositionAttribute, 2, ctx.FLOAT, ctx.FALSE, byteCount, 0);
            ctx.vertexAttribPointer(this._shaderProgram.textureCoordAttribute, 3, ctx.FLOAT, ctx.FALSE, byteCount, 2 * 4);
            this._indicesBuffer = ctx.createBuffer();
            this._setMaxBoxesPoints(ctx, SpriteStage.MAX_BOXES_POINTS_INCREMENT);
        };
        SpriteStage.prototype._setMaxBoxesPoints = function (ctx, value) {
            this._maxBoxesPointsPerDraw = value;
            this._maxBoxesPerDraw = (this._maxBoxesPointsPerDraw / SpriteStage.POINTS_PER_BOX) | 0;
            this._maxIndicesPerDraw = this._maxBoxesPerDraw * SpriteStage.INDICES_PER_BOX;
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this._verticesBuffer);
            this._vertices = new Float32Array(this._maxBoxesPerDraw * SpriteStage.NUM_VERTEX_PROPERTIES_PER_BOX);
            ctx.bufferData(ctx.ARRAY_BUFFER, this._vertices, ctx.DYNAMIC_DRAW);
            this._indices = new Uint16Array(this._maxIndicesPerDraw);
            for (var i = 0, l = this._indices.length; i < l; i += SpriteStage.INDICES_PER_BOX) {
                var j = i * SpriteStage.POINTS_PER_BOX / SpriteStage.INDICES_PER_BOX;
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
        SpriteStage.prototype._setUpKidTexture = function (ctx, kid) {
            if (!ctx) {
                return null;
            }
            var image, texture = null;
            if (kid._spritestage_compatibility === 4) {
                image = kid.image;
            }
            else if (kid._spritestage_compatibility <= 3 && kid.spriteSheet && kid.spriteSheet._images) {
                image = kid.spriteSheet._images[0];
            }
            if (image) {
                texture = image.__easeljs_texture;
                if (!texture) {
                    texture = image.__easeljs_texture = ctx.createTexture();
                    ctx.bindTexture(ctx.TEXTURE_2D, texture);
                    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                }
            }
            return texture;
        };
        SpriteStage.prototype._drawWebGLKids = function (kids, ctx, parentMVMatrix) {
            var kid, mtx, snapToPixelEnabled = this.snapToPixelEnabled, image = null, leftSide = 0, topSide = 0, rightSide = 0, bottomSide = 0, vertices = this._vertices, numVertexPropertiesPerBox = SpriteStage.NUM_VERTEX_PROPERTIES_PER_BOX, maxIndexSize = SpriteStage.MAX_INDEX_SIZE, maxBoxIndex = this._maxBoxesPerDraw - 1;
            for (var i = 0, l = kids.length; i < l; i++) {
                kid = kids[i];
                if (!kid.isVisible()) {
                    continue;
                }
                mtx = kid._matrix;
                mtx = (parentMVMatrix ? mtx.copy(parentMVMatrix) : mtx.identity()).appendTransform(kid.x, kid.y, kid.scaleX, kid.scaleY, kid.rotation, kid.skewX, kid.skewY, kid.regX, kid.regY);
                var uStart = 0, uEnd = 1, vStart = 0, vEnd = 1;
                if (kid._spritestage_compatibility === 4) {
                    image = kid.image;
                    leftSide = 0;
                    topSide = 0;
                    rightSide = image.width;
                    bottomSide = image.height;
                }
                else if (kid._spritestage_compatibility === 2) {
                    var frame = kid.spriteSheet.getFrame(kid.currentFrame), rect = frame.rect;
                    image = frame.image;
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
                    if (kid._spritestage_compatibility === 3) {
                        kid._updateText();
                    }
                }
                if (!parentMVMatrix && kid._spritestage_compatibility <= 4) {
                    var texture = (image || kid.spriteSheet._images[0]).__easeljs_texture;
                    if (texture !== this._drawTexture) {
                        if (this._drawTexture) {
                            this._drawToGPU(ctx);
                        }
                        this._drawTexture = texture;
                        ctx.activeTexture(ctx.TEXTURE0);
                        ctx.bindTexture(ctx.TEXTURE_2D, texture);
                        ctx.uniform1i(this._shaderProgram.sampler0uniform, 0);
                    }
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
                        this._drawTexture = image.__easeljs_texture;
                        ctx.activeTexture(ctx.TEXTURE0);
                        ctx.bindTexture(ctx.TEXTURE_2D, this._drawTexture);
                        ctx.uniform1i(this._shaderProgram.sampler0uniform, 0);
                        if (this._maxBoxesPointsPerDraw < maxIndexSize) {
                            this._setMaxBoxesPoints(ctx, this._maxBoxesPointsPerDraw + SpriteStage.MAX_BOXES_POINTS_INCREMENT);
                            maxBoxIndex = this._maxBoxesPerDraw - 1;
                        }
                    }
                }
                if (kid.children) {
                    this._drawWebGLKids(kid.children, ctx, mtx);
                    maxBoxIndex = this._maxBoxesPerDraw - 1;
                }
            }
        };
        SpriteStage.prototype._drawToGPU = function (ctx) {
            var numBoxes = this._currentBoxIndex + 1;
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this._verticesBuffer);
            ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this._indicesBuffer);
            ctx.uniformMatrix3fv(this._shaderProgram.pMatrixUniform, false, this._projectionMatrix);
            ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this._vertices);
            ctx.drawElements(ctx.TRIANGLES, numBoxes * SpriteStage.INDICES_PER_BOX, ctx.UNSIGNED_SHORT, 0);
            this._currentBoxIndex = -1;
            this._drawTexture = null;
        };
        SpriteStage.NUM_VERTEX_PROPERTIES = 5;
        SpriteStage.POINTS_PER_BOX = 4;
        SpriteStage.NUM_VERTEX_PROPERTIES_PER_BOX = SpriteStage.POINTS_PER_BOX * SpriteStage.NUM_VERTEX_PROPERTIES;
        SpriteStage.INDICES_PER_BOX = 6;
        SpriteStage.MAX_INDEX_SIZE = Math.pow(2, 16);
        SpriteStage.MAX_BOXES_POINTS_INCREMENT = SpriteStage.MAX_INDEX_SIZE / 4;
        return SpriteStage;
    })(Stage);
    return SpriteStage;
});
