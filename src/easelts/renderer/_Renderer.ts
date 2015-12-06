import IHashMap from "../../core/interface/IHashMap";
import RenderType from "../enum/RenderType";
import RendererOptions from "./RendererOptions";

/**
 * The CanvasRenderer draws the scene and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.
 * Don't forget to add the CanvasRenderer.view to your DOM or you will not see anything :)
 *
 * @class
 * @memberof PIXI
 * @param system {string} The name of the system this renderer is for.
 * @param [width=800] {number} the width of the canvas view
 * @param [height=600] {number} the height of the canvas view
 * @param [options] {object} The optional renderer parameters
 * @param [options.view] {HTMLCanvasElement} the canvas to use as a view, optional
 * @param [options.transparent=false] {boolean} If the render view is transparent, default false
 * @param [options.autoResize=false] {boolean} If the render view is automatically resized, default false
 * @param [options.antialias=false] {boolean} sets antialias (only applicable in chrome at the moment)
 * @param [options.resolution=1] {number} the resolution of the renderer retina would be 2
 * @param [options.clearBeforeRender=true] {boolean} This sets if the CanvasRenderer will clear the canvas or
 *      not before the new render pass.
 * @param [options.backgroundColor=0x000000] {number} The background color of the rendered area (shown if not transparent).
 * @param [options.roundPixels=false] {boolean} If true Pixi will Math.floor() x/y values when rendering, stopping pixel interpolation.
 */
class Renderer {

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
	public width = 800;

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
	public view = null;

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
	public transparent:boolean = false;

	/**
	 * Whether the render view should be resized automatically
	 *
	 * @member {boolean}
	 */
	public autoResize:boolean = false;

	/**
	 * Tracks the blend modes useful for this renderer.
	 *
	 * @member {object<string, mixed>}
	 */
	public blendModes:IHashMap<any> = {};

	/**
	 * The value of the preserveDrawingBuffer flag affects whether or not the contents of the stencil buffer is retained after rendering.
	 *
	 * @member {boolean}
	 */
	public preserveDrawingBuffer:boolean = false;

	/**
	 * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
	 * If the scene is NOT transparent Pixi will use a canvas sized fillRect operation every frame to set the canvas background color.
	 * If the scene is transparent Pixi will use clearRect to clear the canvas every frame.
	 * Disable this by setting this to false. For example if your game has a canvas filling background image you often don't need this set.
	 *
	 * @member {boolean}
	 * @default
	 */
	public clearBeforeRender = false;

	/**
	 * If true Pixi will Math.floor() x/y values when rendering, stopping pixel interpolation.
	 * Handy for crisp pixel art and speed on legacy devices.
	 *
	 * @member {boolean}
	 */
	public roundPixels = false;

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
	public _backgroundColorRgb = [0, 0, 0];

	/**
	 * The background color as a string.
	 *
	 * @member {string}
	 * @private
	 */
	public _backgroundColorString = '#000000';

	public backgroundColor = this._backgroundColor; // run bg color setter

	/**
	 * This temporary display object used as the parent of the currently being rendered item
	 *
	 * @member {PIXI.DisplayObject}
	 * @private
	 */
	public _tempDisplayObjectParent = {worldTransform:null, worldAlpha:1, children:[]};

	/**
	 * The last root object that the renderer tried to render.
	 *
	 * @member {PIXI.DisplayObject}
	 * @private
	 */
	public _lastObjectRendered = this._tempDisplayObjectParent;

	constructor( width:number, height:number, options:RendererOptions)
	{
		this.view = options.view;
		this.transparent = options.transparent;
		this.autoResize = options.autoResize;
		// this.antialias = options.antialias;
		this.resolution = options.resolution;
		this.clearBeforeRender = options.clearBeforeRender;
		this.roundPixels = options.roundPixels;


		//EventEmitter.call(this);
		//
		//utils.sayHello(system);

		// prepare options
		//if (options)
		//{
		//	for (var i in CONST.DEFAULT_RENDER_OPTIONS)
		//	{
		//		if (typeof options[i] === 'undefined')
		//		{
		//			options[i] = CONST.DEFAULT_RENDER_OPTIONS[i];
		//		}
		//	}
		//}
		//else
		//{
		//	options = CONST.DEFAULT_RENDER_OPTIONS;
		//}


	}

	/**
	 * Resizes the canvas view to the specified width and height
	 *
	 * @param width {number} the new width of the canvas view
	 * @param height {number} the new height of the canvas view
	 */
	public resize(width:number, height:number)
	{
		this.width = width * this.resolution;
		this.height = height * this.resolution;

		this.view.width = this.width;
		this.view.height = this.height;

		if (this.autoResize)
		{
			this.view.style.width = this.width / this.resolution + 'px';
			this.view.style.height = this.height / this.resolution + 'px';
		}
	}

	/**
	 * Removes everything from the renderer and optionally removes the Canvas DOM element.
	 *
	 * @param [removeView=false] {boolean} Removes the Canvas element from the DOM.
	 */
	public destruct (removeView:boolean)
	{
		if (removeView && this.view.parentNode)
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
		this._backgroundColorRgb = null;
		this._backgroundColorString = null;
	}
}

export default Renderer;