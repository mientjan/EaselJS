import {CanvasElement} from "./CanvasElement";

/**
 * Creates a Canvas element of the given size.
 *
 * @class CanvasElement
 * @param width {number} the width for the newly created canvas
 * @param height {number} the height for the newly created canvas
 */
export class CanvasWebGLElement extends CanvasElement
{
	protected _context:WebGLRenderingContext;

	constructor(width:number, height:number, domElement?:HTMLCanvasElement)
	{
		super(width, height, domElement)
		this._context = <WebGLRenderingContext> this._domElement.getContext('webgl');
	}

	public getContext():WebGLRenderingContext
	{
		return this._context;
	}

	public clear():void
	{
		this._context.clear(this._context.COLOR_BUFFER_BIT);
	} 
}