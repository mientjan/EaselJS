import IBuffer from "../../interface/IBuffer";
import RGBA from "../../data/RGBA";

/**
 * Creates a Canvas element of the given size.
 *
 * @class CanvasBuffer
 * @param width {number} the width for the newly created canvas
 * @param height {number} the height for the newly created canvas
 */
class WebGLBuffer implements IBuffer
{

	/**
	 * The Canvas object that belongs to this CanvasBuffer.
	 *
	 * @member {HTMLCanvasElement}
	 */
	public element:HTMLCanvasElement;
	public context:WebGLRenderingContext;
	public transparent:boolean = true;
	public background:RGBA = null;

	constructor(width:number, height:number, element:HTMLCanvasElement = document.createElement('canvas'))
	{
		this.element = element;
		this.context = <WebGLRenderingContext> this.element.getContext('webgl');

		this.element.width = width;
		this.element.height = height;
	}

	set width(value:number)
	{
		this.element.width = value;
	}

	get width():number
	{
		return this.element.width;
	}

	set height(value:number)
	{
		this.element.height = value;
	}

	get height():number
	{
		return this.element.height;
	}

	public draw(ctx:WebGLRenderingContext):void
	{
		//ctx.drawImage(this.element, 0, 0, this.element.width, this.element.height, 0, 0, this.element.width, this.element.height);
	}

	public clear():void
	{
		this.context.clear(this.context.COLOR_BUFFER_BIT);
	}

	public setSize(width:number, height:number):void
	{
		this.element.width = width;
		this.element.height = height;
	}

	public destruct():void
	{
		this.context = null;
		this.element = null;
	}
}

export default WebGLBuffer;