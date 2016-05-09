// var GLTexture = require('pixi-gl-core').GLTexture,
//     CONST = require('../../const'),
//     RenderTarget = require('./utils/RenderTarget'),
// 	utils = require('../../utils');

import {WebGLRenderer} from "./WebGLRenderer";
import {BaseTexture} from "../../../display/BaseTexture";
import {Texture} from "../../../display/Texture";
/**
 * Helper class to create a webGL Texture
 *
 * @class
 * @memberof PIXI
 * @param renderer {PIXI.WebGLRenderer}
 */
export class TextureManager
{
	/**
	 * A reference to the current renderer
	 *
	 * @member {PIXI.WebGLRenderer}
	 */
	public renderer:WebGLRenderer;

	/**
	 * The current WebGL rendering context
	 *
	 * @member {WebGLRenderingContext}
	 */
	public gl:WebGLRenderingContext = renderer.gl;

	/**
	 * Track textures in the renderer so we can no longer listen to them on destruction.
	 *
	 * @member {array}
	 * @private
	 */
	private _managedTextures = [];
	
	constructor(renderer:WebGLRenderer)
	{
		this.renderer = renderer;
		this.gl = renderer.gl;
	}

	public bindTexture()
	{
	}

	public getTexture()
	{
	}

	/**
	 * Updates and/or Creates a WebGL texture for the renderer's context.
	 *
	 * @param texture {PIXI.BaseTexture|PIXI.Texture} the texture to update
	 */
	public updateTexture(texture:BaseTexture|Texture)
	{
		texture = texture.baseTexture || texture;

		var isRenderTexture = !!texture._glRenderTargets;

		if(!texture.hasLoaded)
		{
			return;
		}

		var glTexture = texture._glTextures[this.renderer.CONTEXT_UID];

		if(!glTexture)
		{
			if(isRenderTexture)
			{
				var renderTarget = new RenderTarget(this.gl, texture.width, texture.height, texture.scaleMode, texture.resolution);
				renderTarget.resize(texture.width, texture.height);
				texture._glRenderTargets[this.renderer.CONTEXT_UID] = renderTarget;
				glTexture = renderTarget.texture;
			}
			else
			{
				glTexture = new GLTexture(this.gl);
				glTexture.premultiplyAlpha = true;
				glTexture.upload(texture.source);
			}

			texture._glTextures[this.renderer.CONTEXT_UID] = glTexture;

			texture.on('update', this.updateTexture, this);
			texture.on('dispose', this.destroyTexture, this);

			this._managedTextures.push(texture);

			if(texture.isPowerOfTwo)
			{
				if(texture.mipmap)
				{
					glTexture.enableMipmap();
				}

				if(texture.wrapMode === CONST.WRAP_MODES.CLAMP)
				{
					glTexture.enableWrapClamp();
				}
				else if(texture.wrapMode === CONST.WRAP_MODES.REPEAT)
				{
					glTexture.enableWrapRepeat();
				}
				else
				{
					glTexture.enableWrapMirrorRepeat();
				}
			}
			else
			{
				glTexture.enableWrapClamp();
			}

			if(texture.scaleMode === CONST.SCALE_MODES.NEAREST)
			{
				glTexture.enableNearestScaling();
			}
			else
			{
				glTexture.enableLinearScaling();
			}
		}
		else
		{
			// the textur ealrady exists so we only need to update it..
			if(isRenderTexture)
			{
				texture._glRenderTargets[this.renderer.CONTEXT_UID].resize(texture.width, texture.height);
			}
			else
			{
				glTexture.upload(texture.source);
			}
		}

		return glTexture;
	}

	/**
	 * Deletes the texture from WebGL
	 *
	 * @param texture {PIXI.BaseTexture|PIXI.Texture} the texture to destroy
	 */
	public destroyTexture(texture, _skipRemove)
	{
		texture = texture.baseTexture || texture;

		if(!texture.hasLoaded)
		{
			return;
		}

		if(texture._glTextures[this.renderer.CONTEXT_UID])
		{
			texture._glTextures[this.renderer.CONTEXT_UID].destroy();
			texture.off('update', this.updateTexture, this);
			texture.off('dispose', this.destroyTexture, this);


			delete texture._glTextures[this.renderer.CONTEXT_UID];

			if(!_skipRemove)
			{
				var i = this._managedTextures.indexOf(texture);
				if(i !== -1)
				{
					utils.removeItems(this._managedTextures, i, 1);
				}
			}
		}
	}

	/**
	 * Deletes all the textures from WebGL
	 */
	public removeAll()
	{
		// empty all the old gl textures as they are useless now
		for(var i = 0; i < this._managedTextures.length; ++i)
		{
			var texture = this._managedTextures[i];
			if(texture._glTextures[this.renderer.CONTEXT_UID])
			{
				delete texture._glTextures[this.renderer.CONTEXT_UID];
			}
		}
	}

	/**
	 * Destroys this manager and removes all its textures
	 */
	public destroy()
	{
		// destroy managed textures
		for(var i = 0; i < this._managedTextures.length; ++i)
		{
			var texture = this._managedTextures[i];
			this.destroyTexture(texture, true);
			texture.off('update', this.updateTexture, this);
			texture.off('dispose', this.destroyTexture, this);
		}

		this._managedTextures = null;
	}
	
}