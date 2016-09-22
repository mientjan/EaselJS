var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./TextureManager", "../SystemRenderer", "./TextureGarbageCollector", "./WebGLState"], function (require, exports, TextureManager_1, SystemRenderer_1, TextureGarbageCollector_1, WebGLState_1) {
    "use strict";
    var CONTEXT_UID = 0;
    var WebGLRenderer = (function (_super) {
        __extends(WebGLRenderer, _super);
        function WebGLRenderer(width, height, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            _super.call(this, 'WebGL', width, height, options);
            this.CONTEXT_UID = CONTEXT_UID++;
            this.type = 2;
            this.maskManager = new MaskManager(this);
            this.stencilManager = new StencilManager(this);
            this.emptyRenderer = new ObjectRenderer(this);
            this.currentRenderer = this.emptyRenderer;
            this._activeShader = null;
            this._activeRenderTarget = null;
            this._activeTextureLocation = 999;
            this._activeTexture = null;
            this.bindProjection = function (worldProjection) {
                var aRT = this._activeRenderTarget;
                var aS = this._activeShader;
                if (aRT && aRT.checkWorldProjection(worldProjection)) {
                    aRT.setWorldProjection(worldProjection);
                    if (aS) {
                        aS.uniforms.projectionMatrix = aRT.projectionMatrix.toArray(true);
                    }
                    return true;
                }
                return false;
            };
            this.handleContextLost = function (event) {
                event.preventDefault();
            };
            this.handleContextRestored = function () {
                _this._initContext();
                _this.textureManager.removeAll();
            };
            this.view.addEventListener('webglcontextlost', this.handleContextLost, false);
            this.view.addEventListener('webglcontextrestored', this.handleContextRestored, false);
            this._contextOptions = {
                alpha: this.transparent,
                antialias: options.antialias,
                premultipliedAlpha: this.transparent && this.transparent !== 'notMultiplied',
                stencil: true,
                preserveDrawingBuffer: options.preserveDrawingBuffer
            };
            this._backgroundColorRgba[3] = this.transparent ? 0 : 1;
            this.initPlugins();
            this.gl = options.context || createContext(this.view, this._contextOptions);
            this.state = new WebGLState_1.WebGLState(this.gl);
            this.renderingToScreen = true;
            this._initContext();
            this.filterManager = new FilterManager(this);
            this.drawModes = mapWebGLDrawModesToPixi(this.gl);
            this.setBlendMode(0);
        }
        WebGLRenderer.prototype._initContext = function () {
            var gl = this.gl;
            this.textureManager = new TextureManager_1.TextureManager(this);
            this.textureGarbageCollector = new TextureGarbageCollector_1.TextureGarbageCollector(this);
            this.state.resetToDefault();
            this.rootRenderTarget = new RenderTarget(gl, this.width, this.height, null, this.resolution, true);
            this.rootRenderTarget.clearColor = this._backgroundColorRgba;
            this.bindRenderTarget(this.rootRenderTarget);
            this.emit('context', gl);
            this.resize(this.width, this.height);
        };
        ;
        WebGLRenderer.prototype.render = function (displayObject, renderTexture, clear, transform, skipUpdateTransform) {
            this.renderingToScreen = !renderTexture;
            this.emit('prerender');
            if (!this.gl || this.gl.isContextLost()) {
                return;
            }
            this._lastObjectRendered = displayObject;
            if (!skipUpdateTransform) {
                utils.resetUpdateOrder();
                var cacheParent = displayObject.parent;
                displayObject.parent = this._tempDisplayObjectParent;
                displayObject.updateTransform();
                displayObject.parent = cacheParent;
            }
            this.bindRenderTexture(renderTexture, transform);
            this.currentRenderer.start();
            if (clear || this.clearBeforeRender) {
                this._activeRenderTarget.clear();
            }
            utils.resetDisplayOrder();
            displayObject.renderWebGL(this);
            this.currentRenderer.flush();
            this.textureGC.update();
            this.emit('postrender');
        };
        ;
        WebGLRenderer.prototype.setObjectRenderer = function (objectRenderer) {
            if (this.currentRenderer === objectRenderer) {
                return;
            }
            this.currentRenderer.stop();
            this.currentRenderer = objectRenderer;
            this.currentRenderer.start();
        };
        ;
        WebGLRenderer.prototype.flush = function () {
            this.setObjectRenderer(this.emptyRenderer);
        };
        ;
        WebGLRenderer.prototype.resize = function (width, height) {
            SystemRenderer_1.SystemRenderer.prototype.resize.call(this, width, height);
            this.rootRenderTarget.resize(width, height);
            if (this._activeRenderTarget === this.rootRenderTarget) {
                this.rootRenderTarget.activate();
                if (this._activeShader) {
                    this._activeShader.uniforms.projectionMatrix = this.rootRenderTarget.projectionMatrix.toArray(true);
                }
            }
        };
        ;
        WebGLRenderer.prototype.setBlendMode = function (blendMode) {
            this.state.setBlendMode(blendMode);
        };
        ;
        WebGLRenderer.prototype.clear = function (clearColor) {
            this._activeRenderTarget.clear(clearColor);
        };
        ;
        WebGLRenderer.prototype.setTransform = function (matrix) {
            this._activeRenderTarget.transform = matrix;
        };
        ;
        WebGLRenderer.prototype.bindRenderTexture = function (renderTexture, transform) {
            var renderTarget;
            if (renderTexture) {
                var baseTexture = renderTexture.baseTexture;
                var gl = this.gl;
                if (!baseTexture._glRenderTargets[this.CONTEXT_UID]) {
                    this.textureManager.updateTexture(baseTexture);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                }
                else {
                    this._activeTextureLocation = baseTexture._id;
                    gl.activeTexture(gl.TEXTURE0 + baseTexture._id);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                }
                renderTarget = baseTexture._glRenderTargets[this.CONTEXT_UID];
                renderTarget.setFrame(renderTexture.frame);
            }
            else {
                renderTarget = this.rootRenderTarget;
            }
            renderTarget.transform = transform;
            this.bindRenderTarget(renderTarget);
            return this;
        };
        ;
        WebGLRenderer.prototype.bindRenderTarget = function (renderTarget) {
            if (renderTarget !== this._activeRenderTarget) {
                this._activeRenderTarget = renderTarget;
                renderTarget.activate();
                if (this._activeShader) {
                    this._activeShader.uniforms.projectionMatrix = renderTarget.projectionMatrix.toArray(true);
                }
                this.stencilManager.setMaskStack(renderTarget.stencilMaskStack);
            }
            return this;
        };
        ;
        WebGLRenderer.prototype.bindShader = function (shader) {
            if (this._activeShader !== shader) {
                this._activeShader = shader;
                shader.bind();
                shader.uniforms.projectionMatrix = this._activeRenderTarget.projectionMatrix.toArray(true);
            }
            return this;
        };
        ;
        WebGLRenderer.prototype.bindTexture = function (texture, location) {
            texture = texture.baseTexture || texture;
            var gl = this.gl;
            location = location || 0;
            if (this._activeTextureLocation !== location) {
                this._activeTextureLocation = location;
                gl.activeTexture(gl.TEXTURE0 + location);
            }
            this._activeTexture = texture;
            if (!texture._glTextures[this.CONTEXT_UID]) {
                this.textureManager.updateTexture(texture);
            }
            else {
                texture.touched = this.textureGC.count;
                texture._glTextures[this.CONTEXT_UID].bind();
            }
            return this;
        };
        ;
        WebGLRenderer.prototype.createVao = function () {
            return new glCore.VertexArrayObject(this.gl, this.state.attribState);
        };
        ;
        WebGLRenderer.prototype.reset = function () {
            this.currentRenderer.stop();
            this._activeShader = null;
            this._activeRenderTarget = null;
            this._activeTextureLocation = 999;
            this._activeTexture = null;
            this.rootRenderTarget.activate();
            this.state.resetToDefault();
            return this;
        };
        WebGLRenderer.prototype.destroy = function (removeView) {
            this.destroyPlugins();
            this.view.removeEventListener('webglcontextlost', this.handleContextLost);
            this.view.removeEventListener('webglcontextrestored', this.handleContextRestored);
            this.textureManager.destroy();
            SystemRenderer_1.SystemRenderer.prototype.destroy.call(this, removeView);
            this.uid = 0;
            this.maskManager.destroy();
            this.stencilManager.destroy();
            this.filterManager.destroy();
            this.maskManager = null;
            this.filterManager = null;
            this.textureManager = null;
            this.currentRenderer = null;
            this.handleContextLost = null;
            this.handleContextRestored = null;
            this._contextOptions = null;
            this.gl.useProgram(null);
            if (this.gl.getExtension('WEBGL_lose_context')) {
                this.gl.getExtension('WEBGL_lose_context').loseContext();
            }
            this.gl = null;
        };
        return WebGLRenderer;
    }(SystemRenderer_1.SystemRenderer));
    exports.WebGLRenderer = WebGLRenderer;
});
