import {IStageOption} from "../interface/IStageOption";
import RGBA from "./RGBA";

export class StageOption implements IStageOption
{
	/**
	 * Indicates whether onResize should be called when the window is resized.
	 * @property triggerResizeOnWindowResize
	 * @type {boolean}
	 * @default false
	 */
	public autoResize:boolean = true;
	public pixelRatio:number = 1;
	public transparent:boolean = true;

	/**
	 * Indicates whether the stage should automatically clear the canvas before each render. You can set this to <code>false</code>
	 * to manually control clearing (for generative art, or when pointing multiple stages at the same canvas for
	 * example).
	 *
	 * <h4>Example</h4>
	 *
	 *      var stage = new Stage("canvasId");
	 *      stage.autoClear = false;
	 *
	 * @property autoClear
	 * @type Boolean
	 * @default true
	 **/
	public autoClear:boolean = true;
	public autoClearColor:string|RGBA = '#000000';

	constructor(option:IStageOption)
	{
		for(var name in option)
		{
			if(this.hasOwnProperty(name))
			{
				var value;
				switch (name)
				{
					case 'pixelRatio':{
						value = option[name]|0;
						break;
					}

					default:{
						value = option[name];
						break;
					}
				}

				this[name] = value;
			}
		}
	}
}