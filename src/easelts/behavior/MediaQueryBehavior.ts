/**
 * Created by pieters on 12-Mar-15.
 */
import AbstractBehavior from "./AbstractBehavior";
import DisplayObject from "../display/DisplayObject";
import * as IMediaQuery from "../interface/IMediaQuery";
import Point from "../geom/Point";
import Size from "../geom/Size";
import SignalConnection from "../../core/event/SignalConnection";

class MediaQueryBehavior extends AbstractBehavior
{
	private _data:IMediaQuery.IMediaQuery = {};
	private _restore:IMediaQuery.IMediaQuery = {};

	private _resizeSignalConnection:SignalConnection;
	private _matchLast:boolean;

	constructor(matchLast:boolean = false)
	{
		super();

		this._matchLast = matchLast;
	}

	public initialize(owner:DisplayObject):void
	{
		super.initialize(owner);

		if(this._matchLast){
			this._resizeSignalConnection = this.owner.resizeSignal.connect(this.onResizeMatchLast);
		}
		else
		{
			this._resizeSignalConnection = this.owner.resizeSignal.connect(this.onResizeMatchAll);
		}

		for(var query in this._data)
		{
			this.storeData(owner, this._restore, this._data[query] );
		}
	}

	public addQuery(query:string, data:any):MediaQueryBehavior
	{
		if(this.owner){
			throw new Error('can not add new queries when behavior is initialized');
		}

		this._data[query] = data;
		return this;
	}

	public addQueries(data:any):MediaQueryBehavior
	{
		if(this.owner){
			throw new Error('can not add new queries when behavior is initialized');
		}

		for(var query in data)
		{
			this.addQuery(query, data[query]);
		}

		return this;
	}

	private onResizeMatchAll = ():void =>
	{
		var matchFound:boolean = false;
		for(var mediaQuery in this._data)
		{
			if(window.matchMedia(mediaQuery).matches)
			{
				matchFound = true;
				var data = this._data[mediaQuery];
				this.setData(this.owner, data);
			}
		}

		if(!matchFound){
			this.setData(this.owner, this._restore);
		}
	}

	private onResizeMatchLast = ():void =>
	{
		var data = null;
		for(var mediaQuery in this._data)
		{
			if(window.matchMedia(mediaQuery).matches)
			{
				data = this._data[mediaQuery];
			}
		}

		this.setData(this.owner, data || this._restore);

	}

	private storeData(owner:DisplayObject, storeData:any, data:any):void
	{
		if(!owner)
		{
			throw new Error('owner is unknown ')
		}

		for(var property in data)
		{
			var value:number|string|any = data[property];

			switch(property)
			{
				case 'x':
				{
					storeData.x = owner.x;
					break;
				}

				case 'y':
				{
					storeData.y = owner.x;
					break;
				}

				case 'width':
				{
					storeData.width = owner.width;
					break;
				}

				case 'height':
				{
					storeData.height = owner.height;
					break;
				}

				case 'regX':
				{
					storeData.regX = owner.regX;
					break;
				}

				case 'regY':
				{
					storeData.regY = owner.regY;
					break;
				}

				case 'scaleX':
				{
					storeData.scaleX = owner.scaleX;
					break;
				}

				case 'scaleY':
				{

					storeData.scaleY = owner.scaleY;
					break;
				}

				default:
				{
					storeData[property] = {};
					this.storeData(this.owner[property], storeData[property], <any> value);
					break;
				}
			}
		}
	}

	private setData(owner:DisplayObject, data:any):void
	{
		if(!owner)
		{
			throw new Error('owner is unknown ')
		}

		for(var property in data)
		{
			var value:number|string|any = data[property];

			switch(property)
			{
				case 'x':
				{
					owner.setX(<number|string> value);
					break;
				}

				case 'y':
				{
					owner.setY(<number|string> value);
					break;
				}

				case 'width':
				{
					owner.setWidth(<number|string> value);
					break;
				}

				case 'height':
				{
					owner.setHeight(<number|string> value);
					break;
				}

				case 'regX':
				{
					owner.setRegX(<number|string> value);
					break;
				}

				case 'regY':
				{
					owner.setRegY(<number|string> value);
					break;
				}

				case 'scaleX':
				{
					owner.scaleX = <number> value;
					break;
				}

				case 'scaleY':
				{

					owner.scaleY = <number> value;
					break;
				}

				default:
				{
					this.setData(this.owner[property], <any> value);
					break;
				}
			}
		}
	}
}

export default MediaQueryBehavior;