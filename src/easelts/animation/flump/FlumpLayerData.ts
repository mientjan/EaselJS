import {FlumpKeyframeData} from "./FlumpKeyframeData";
import {ILayer} from "./IFlumpLibrary";

export class FlumpLayerData {

	public name:string;
	public flipbook:boolean;
	public flumpKeyframeDatas:Array<FlumpKeyframeData> = [];

	public frames:number;

	constructor(json:ILayer)
	{
		this.name = json.name;
		this.flipbook = 'flipbook' in json ? !!json.flipbook : false;
		
		var keyframes = json.keyframes;
		var keyFrameData:FlumpKeyframeData = null;
		
		for(var i = 0; i < keyframes.length; i++)
		{
			var keyframe = keyframes[i];
			keyFrameData = new FlumpKeyframeData(keyframe);
			this.flumpKeyframeDatas.push( keyFrameData );
		}

		this.frames = keyFrameData.index + keyFrameData.duration;
	}

	public getKeyframeForFrame(frame:number):FlumpKeyframeData
	{
		var datas = this.flumpKeyframeDatas;
		for(var i = 1; i < datas.length; i++)
		{
			if (datas[i].index > frame) {
				return datas[i - 1];
			}
		}

		return datas[datas.length - 1];
	}

	public getKeyframeAfter( flumpKeyframeData:FlumpKeyframeData):FlumpKeyframeData
	{
		for(var i = 0; i < this.flumpKeyframeDatas.length - 1; i++) {
			if (this.flumpKeyframeDatas[i] === flumpKeyframeData)
			{
				return this.flumpKeyframeDatas[i + 1];
			}
		}
		return null;
	}
}

