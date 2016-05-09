import {WebGLRenderer} from "../WebGLRenderer";

/**
 * @class
 * @memberof PIXI
 * @param renderer {PIXI.WebGLRenderer} The renderer this manager works for.
 */
export class WebGLManager
{
	/**
	 * The renderer this manager works for.
	 *
	 * @member {PIXI.WebGLRenderer}
	 */
	public renderer:WebGLRenderer;

	constructor(renderer:WebGLRenderer)
	{
		this.renderer = renderer;
		this.renderer.on('context', this.onContextChange, this);
	}

	/**
	 * Generic method called when there is a WebGL context change.
	 *
	 */
	public onContextChange()
	{
		// do some codes init!
	}

	/**
	 * Generic destroy methods to be overridden by the subclass
	 *
	 */
	public destroy()
	{
		this.renderer.off('context', this.onContextChange, this);
		this.renderer = null;
	}
}
