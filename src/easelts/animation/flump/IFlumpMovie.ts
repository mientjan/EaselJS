import {DisplayType} from "../../enum/DisplayType";

/**
 * @author Mient-jan Stelling
 */
export interface IFlumpMovie
{
	type:DisplayType;
	name:string;
	onTick(delta:number, accumulated:number):void;
	draw(ctx:CanvasRenderingContext2D):boolean;
	reset():void;
}


