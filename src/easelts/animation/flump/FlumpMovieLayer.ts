import DisplayObject from '../../display/DisplayObject';
import FlumpLibrary from '../FlumpLibrary';
import FlumpLayerData from './FlumpLayerData';
import FlumpKeyframeData from './FlumpKeyframeData';
import FlumpTexture from './FlumpTexture';
import FlumpMovie from './FlumpMovie';
import FlumpLabelData from './FlumpLabelData';
import IHashMap from "../../interface/IHashMap";
import FlumpMtx = require("./FlumpMtx");
import IFlumpMovie from "./IFlumpMovie";
import DisplayType from "../../enum/DisplayType";

class FlumpMovieLayer extends DisplayObject
{
	public name:string = '';
	private _frame:number = 0;
	public flumpLayerData:FlumpLayerData;

	protected _symbol:IFlumpMovie;
	public _symbols:IHashMap<IFlumpMovie> = {};
	protected _symbolName:any = null;

	// disable layer from code
	public enabled:boolean = true;

	public _storedMtx = new FlumpMtx(1, 0, 0, 1, 0, 0);

	constructor(flumpMove:FlumpMovie, flumpLayerData:FlumpLayerData)
	{
		super();

		this.flumpLayerData = flumpLayerData;
		this.name = flumpLayerData.name;

		var flumpLibrary = flumpMove.flumpLibrary;

		for(var i = 0; i < flumpLayerData.flumpKeyframeDatas.length; i++)
		{
			var keyframe = flumpLayerData.flumpKeyframeDatas[i];

			if(keyframe.label)
			{
				flumpMove['_labels'][keyframe.label] = new FlumpLabelData(keyframe.label, keyframe.index, keyframe.duration);
			}

			if(( ( <any> keyframe.ref) != -1 && ( <any> keyframe.ref) != null) && ( keyframe.ref in this._symbols ) == false)
			{
				this._symbols[keyframe.ref] = flumpMove.flumpLibrary.createSymbol(keyframe.ref, false);

			}
		}

		this.setFrame(0);
	}

	public getSymbol(name:string):FlumpMovie
	{
		var symbols = this._symbols;
		for(var val in symbols)
		{
			var symbol = symbols[val];
			
			if( symbol instanceof FlumpMovie)
			{
				if( symbol.name == name ){
					return symbol;
				} else {
					var data =  symbol.getSymbol(name);

					if( data != null )
					{
						return data;
					}
				}
			}
		}

		return null;
	}

	public replaceSymbol(name:string, item:IFlumpMovie):boolean
	{
		var symbols = this._symbols;
		for(var val in symbols)
		{
			var symbol = symbols[val];

			if( symbol.name == name ){
				this._symbols[val] = <IFlumpMovie> item;
				return true;
			}
			else if( symbol instanceof FlumpMovie && symbol.replaceSymbol(name, item) )
			{
				return true
			}
		}

		return false;
	}



	public onTick(delta:number):void
	{
		if(this._symbol != null && !(this._symbol instanceof FlumpTexture))
		{
			( <FlumpMovie> this._symbol ).onTick(delta);
		}
	}

	public setFrame(frame:number):void
	{
		var keyframe:FlumpKeyframeData = this.flumpLayerData.getKeyframeForFrame(frame | 0);

		if(!(keyframe instanceof FlumpKeyframeData))
		{
			this._symbol = null;
			return;
		}

		if(( <any> keyframe.ref ) != -1 && ( <any> keyframe.ref ) != null)
		{
			if(this._symbol != this._symbols[keyframe.ref])
			{
				this._symbol = this._symbols[keyframe.ref];

				if(this._symbol.type == DisplayType.FLUMPSYMBOL) this._symbol.reset();
			}
		}
		else
		{
			this._symbol = null;
			return;
		}


		var x:number = keyframe.x;
		var y:number = keyframe.y;
		var scaleX:number = keyframe.scaleX;
		var scaleY:number = keyframe.scaleY;
		var skewX:number = keyframe.skewX;
		var skewY:number = keyframe.skewY;
		var pivotX:number = keyframe.pivotX;
		var pivotY:number = keyframe.pivotY;
		var alpha:number = keyframe.alpha;

		var sinX = 0.0;
		var cosX = 1.0;
		var sinY = 0.0;
		var cosY = 1.0;

		if(keyframe.index < frame && keyframe.tweened)
		{
			var nextKeyframe = this.flumpLayerData.getKeyframeAfter(keyframe);

			if(nextKeyframe instanceof FlumpKeyframeData)
			{
				var interped = (frame - keyframe.index) / keyframe.duration;
				var ease = keyframe.ease;

				if(ease != 0)
				{
					var t = 0.0;
					if(ease < 0)
					{
						var inv = 1 - interped;
						t = 1 - inv * inv;
						ease = 0 - ease;
					}
					else
					{
						t = interped * interped;
					}
					interped = ease * t + (1 - ease) * interped;
				}

				x = x + (nextKeyframe.x - x) * interped;
				y = y + (nextKeyframe.y - y) * interped;
				scaleX = scaleX + (nextKeyframe.scaleX - scaleX) * interped;
				scaleY = scaleY + (nextKeyframe.scaleY - scaleY) * interped;
				skewX = skewX + (nextKeyframe.skewX - skewX) * interped;
				skewY = skewY + (nextKeyframe.skewY - skewY) * interped;
				alpha = alpha + (nextKeyframe.alpha - alpha) * interped;
			}
		}

		if(skewX != 0)
		{
			sinX = Math.sin(skewX);
			cosX = Math.cos(skewX);
		}

		if(skewY != 0)
		{
			sinY = Math.sin(skewY);
			cosY = Math.cos(skewY);
		}

		this._storedMtx.a = scaleX * cosY;
		this._storedMtx.b = scaleX * sinY;
		this._storedMtx.c = -scaleY * sinX;
		this._storedMtx.d = scaleY * cosX;

		this._storedMtx.tx = x - (pivotX * this._storedMtx.a + pivotY * this._storedMtx.c);
		this._storedMtx.ty = y - (pivotX * this._storedMtx.b + pivotY * this._storedMtx.d);


		this.alpha = alpha;
		this.visible = keyframe.visible;

		this._frame = frame;
	}

	public reset()
	{
		if(this._symbol && this._symbol.type == DisplayType.FLUMPSYMBOL) this._symbol.reset();
	}

	public draw(ctx:CanvasRenderingContext2D, ignoreCache?:boolean):boolean
	{
		if(this._symbol != null && this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0)
		{
			this._symbol.draw(ctx);
		}
		return true;
	}
}

export default FlumpMovieLayer;