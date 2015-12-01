import DisplayType from "../../enum/DisplayType";

/**
 * @author Mient-jan Stelling
 */
interface IFlumpMovie
{
	type:DisplayType;
	name:string;
	onTick(delta:number):void;
	draw(ctx:CanvasRenderingContext2D):boolean;
	reset():void;
}

export default IFlumpMovie;
