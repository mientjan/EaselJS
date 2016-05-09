define(["require", "exports"], function (require, exports) {
    "use strict";
    var TextureManager = (function () {
        function TextureManager(renderer) {
            this.gl = renderer.gl;
            this._managedTextures = [];
            this.renderer = renderer;
            this.gl = renderer.gl;
        }
        TextureManager.prototype.bindTexture = function () {
        };
        TextureManager.prototype.getTexture = function () {
        };
        TextureManager.prototype.updateTexture = function (texture) {
            texture = texture.baseTexture || texture;
            var isRenderTexture = !!texture._glRenderTargets;
            if (!texture.hasLoaded) {
                return;
            }
            var glTexture = texture._glTextures[this.renderer.CONTEXT_UID];
            if (!glTexture) {
                if (isRenderTexture) {
                    var renderTarget = new RenderTarget(this.gl, texture.width, texture.height, texture.scaleMode, texture.resolution);
                    renderTarget.resize(texture.width, texture.height);
                    texture._glRenderTargets[this.renderer.CONTEXT_UID] = renderTarget;
                    glTexture = renderTarget.texture;
                }
                else {
                    glTexture = new GLTexture(this.gl);
                    glTexture.premultiplyAlpha = true;
                    glTexture.upload(texture.source);
                }
                texture._glTextures[this.renderer.CONTEXT_UID] = glTexture;
                texture.on('update', this.updateTexture, this);
                texture.on('dispose', this.destroyTexture, this);
                this._managedTextures.push(texture);
                if (texture.isPowerOfTwo) {
                    if (texture.mipmap) {
                        glTexture.enableMipmap();
                    }
                    if (texture.wrapMode === CONST.WRAP_MODES.CLAMP) {
                        glTexture.enableWrapClamp();
                    }
                    else if (texture.wrapMode === CONST.WRAP_MODES.REPEAT) {
                        glTexture.enableWrapRepeat();
                    }
                    else {
                        glTexture.enableWrapMirrorRepeat();
                    }
                }
                else {
                    glTexture.enableWrapClamp();
                }
                if (texture.scaleMode === CONST.SCALE_MODES.NEAREST) {
                    glTexture.enableNearestScaling();
                }
                else {
                    glTexture.enableLinearScaling();
                }
            }
            else {
                if (isRenderTexture) {
                    texture._glRenderTargets[this.renderer.CONTEXT_UID].resize(texture.width, texture.height);
                }
                else {
                    glTexture.upload(texture.source);
                }
            }
            return glTexture;
        };
        TextureManager.prototype.destroyTexture = function (texture, _skipRemove) {
            texture = texture.baseTexture || texture;
            if (!texture.hasLoaded) {
                return;
            }
            if (texture._glTextures[this.renderer.CONTEXT_UID]) {
                texture._glTextures[this.renderer.CONTEXT_UID].destroy();
                texture.off('update', this.updateTexture, this);
                texture.off('dispose', this.destroyTexture, this);
                delete texture._glTextures[this.renderer.CONTEXT_UID];
                if (!_skipRemove) {
                    var i = this._managedTextures.indexOf(texture);
                    if (i !== -1) {
                        utils.removeItems(this._managedTextures, i, 1);
                    }
                }
            }
        };
        TextureManager.prototype.removeAll = function () {
            for (var i = 0; i < this._managedTextures.length; ++i) {
                var texture = this._managedTextures[i];
                if (texture._glTextures[this.renderer.CONTEXT_UID]) {
                    delete texture._glTextures[this.renderer.CONTEXT_UID];
                }
            }
        };
        TextureManager.prototype.destroy = function () {
            for (var i = 0; i < this._managedTextures.length; ++i) {
                var texture = this._managedTextures[i];
                this.destroyTexture(texture, true);
                texture.off('update', this.updateTexture, this);
                texture.off('dispose', this.destroyTexture, this);
            }
            this._managedTextures = null;
        };
        return TextureManager;
    }());
    exports.TextureManager = TextureManager;
});
