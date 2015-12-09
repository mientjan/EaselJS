
import RGBA from "../data/RGBA";
interface IBuffer
{
	context:WebGLRenderingContext|CanvasRenderingContext2D;
	width:number;
	height:number;

	draw(ctx:CanvasRenderingContext2D|WebGLRenderingContext):void
	clear():void;
	setSize(width:number, height:number):void
	destruct():void;
}

export default IBuffer;