import RGBA from "../data/RGBA";

export interface IStageOption
{
	autoResize?:boolean;
	autoClear?:boolean;
	autoClearColor?:string|RGBA;
	transparent?:boolean;
	pixelRatio?:number;
}