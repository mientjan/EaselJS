// var utils = require('../utils'),
//     math = require('../math'),
//     CONST = require('../const'),
//     Container = require('../display/Container'),
//     RenderTexture = require('../textures/RenderTexture'),
//     EventEmitter = require('eventemitter3'),
//     tempMatrix = new math.Matrix();

import {Container} from "../../display/Container";
import {RenderType} from "../../enum/RenderType";

export class SystemRenderer
{

	/**
	 * The type of the renderer.
	 *
	 * @member {number}
	 * @default PIXI.RENDERER_TYPE.UNKNOWN
	 * @see PIXI.RENDERER_TYPE
	 */
	public type:RenderType = RenderType.UNKNOWN;

	/**
	 * The width of the canvas view
	 *
	 * @member {number}
	 * @default 800
	 */
	public width:number = 800;

	/**
	 * The height of the canvas view
	 *
	 * @member {number}
	 * @default 600
	 */
	public height = 600;

	/**
	 * The canvas element that everything is drawn to
	 *
	 * @member {HTMLCanvasElement}
	 */
	public view:HTMLCanvasElement;

	/**
	 * The resolution of the renderer
	 *
	 * @member {number}
	 * @default 1
	 */
	public resolution:number = 1;

	/**
	 * Whether the render view is transparent
	 *
	 * @member {boolean}
	 */
	public transparent:boolean;

	/**
	 * Whether the render view should be resized automatically
	 *
	 * @member {boolean}
	 */
	public autoResize:number;

	/**
	 * Tracks the blend modes useful for this renderer.
	 *
	 * @member {object<string, mixed>}
	 */
	public blendModes = null;

	/**
	 * The value of the preserveDrawingBuffer flag affects whether or not the contents of the stencil buffer is retained after rendering.
	 *
	 * @member {boolean}
	 */
	public preserveDrawingBuffer:boolean;

	/**
	 * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
	 * If the scene is NOT transparent Pixi will use a canvas sized fillRect operation every frame to set the canvas background color.
	 * If the scene is transparent Pixi will use clearRect to clear the canvas every frame.
	 * Disable this by setting this to false. For example if your game has a canvas filling background image you often don't need this set.
	 *
	 * @member {boolean}
	 * @default
	 */
	public clearBeforeRender:boolean;

	/**
	 * If true Pixi will Math.floor() x/y values when rendering, stopping pixel interpolation.
	 * Handy for crisp pixel art and speed on legacy devices.
	 *
	 * @member {boolean}
	 */
	public roundPixels:boolean;

	/**
	 * The background color as a number.
	 *
	 * @member {number}
	 * @private
	 */
	public _backgroundColor = 0x000000;

	/**
	 * The background color as an [R, G, B] array.
	 *
	 * @member {number[]}
	 * @private
	 */
	public _backgroundColorRgba = [0, 0, 0, 0];

	/**
	 * The background color as a string.
	 *
	 * @member {string}
	 * @private
	 */
	public _backgroundColorString = '#000000';

	/**
	 * This temporary display object used as the parent of the currently being rendered item
	 *
	 * @member {PIXI.DisplayObject}
	 * @private
	 */
	protected _tempDisplayObjectParent = new Container();

	/**
	 * The last root object that the renderer tried to render.
	 *
	 * @member {PIXI.DisplayObject}
	 * @private
	 */
	protected _lastObjectRendered = this._tempDisplayObjectParent;

	constructor(system:string, width:number, height:number, options:any = {})
	{
		// // prepare options
		// if (options) {
		//     for (var i in CONST.DEFAULT_RENDER_OPTIONS) {
		//         if (typeof options[i] === 'undefined') {
		//             options[i] = CONST.DEFAULT_RENDER_OPTIONS[i];
		//         }
		//     }
		// }
		// else {
		//     options = CONST.DEFAULT_RENDER_OPTIONS;
		// }

		this.view = options.view || document.createElement('canvas');

		this.preserveDrawingBuffer = options.preserveDrawingBuffer;
		this.clearBeforeRender = options.clearBeforeRender;
		this.roundPixels = options.roundPixels;

		this.resolution = options.resolution || 1;

		this.transparent = options.transparent;
		this.backgroundColor = options.backgroundColor || 0x000000

		this.autoResize = options.autoResize || false;
	}

	/**
	 * The background color to fill if not transparent
	 *
	 * @member {number}
	 * @memberof PIXI.SystemRenderer#
	 */
	get backgroundColor()
	{
		return this._backgroundColor;
	}

	set backgroundColor(val)
	{
		this._backgroundColor = val;
		// this._backgroundColorString = utils.hex2string(val);
		// utils.hex2rgb(val, this._backgroundColorRgba);
	}

	/**
	 * Resizes the canvas view to the specified width and height
	 *
	 * @param width {number} the new width of the canvas view
	 * @param height {number} the new height of the canvas view
	 */
	public resize(width, height)
	{
		this.width = width * this.resolution;
		this.height = height * this.resolution;

		this.view.width = this.width;
		this.view.height = this.height;

		if(this.autoResize)
		{
			this.view.style.width = this.width / this.resolution + 'px';
			this.view.style.height = this.height / this.resolution + 'px';
		}
	}

	/**
	 * Useful function that returns a texture of the display object that can then be used to create sprites
	 * This can be quite useful if your displayObject is complicated and needs to be reused multiple times.
	 *
	 * @param displayObject {number} The displayObject the object will be generated from
	 * @param scaleMode {number} Should be one of the scaleMode consts
	 * @param resolution {number} The resolution of the texture being generated
	 * @return {PIXI.Texture} a texture of the graphics object
	 */
	public generateTexture(displayObject, scaleMode, resolution)
	{

		var bounds = displayObject.getLocalBounds();

		var renderTexture = RenderTexture.create(bounds.width | 0, bounds.height | 0, scaleMode, resolution);

		tempMatrix.tx = -bounds.x;
		tempMatrix.ty = -bounds.y;

		this.render(displayObject, renderTexture, false, tempMatrix, true);

		return renderTexture;
	}

	/**
	 * Removes everything from the renderer and optionally removes the Canvas DOM element.
	 *
	 * @param [removeView=false] {boolean} Removes the Canvas element from the DOM.
	 */
	public destroy(removeView)
	{
		if(removeView && this.view.parentNode)
		{
			this.view.parentNode.removeChild(this.view);
		}

		this.type = RenderType.UNKNOWN;

		this.width = 0;
		this.height = 0;

		this.view = null;

		this.resolution = 0;

		this.transparent = false;

		this.autoResize = false;

		this.blendModes = null;

		this.preserveDrawingBuffer = false;
		this.clearBeforeRender = false;

		this.roundPixels = false;

		this._backgroundColor = 0;
		this._backgroundColorRgba = null;
		this._backgroundColorString = null;

		this.backgroundColor = 0;
		this._tempDisplayObjectParent = null;
		this._lastObjectRendered = null;
	}
}
