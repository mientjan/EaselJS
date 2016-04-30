
import {FlumpLibrary} from "../FlumpLibrary";
import {FlumpLayerData} from "./FlumpLayerData";
import {IMovie} from "./IFlumpLibrary";

export class FlumpMovieData {

	public id:string;
	public flumpLibrary;
	public flumpLayerDatas:Array<FlumpLayerData>;

	public frames:number = 0;

	constructor(flumpLibrary:FlumpLibrary, json:IMovie)
	{
		this.flumpLibrary = flumpLibrary;
		this.id = json.id;

		var layers = json.layers;
		this.flumpLayerDatas = new Array(layers.length);
		for(var i = 0; i < layers.length; i++)
		{
			var layer = new FlumpLayerData(layers[i]);
			this.flumpLayerDatas[i] = layer;
			this.frames = Math.max(this.frames, layer.frames)
		}
	}
}

