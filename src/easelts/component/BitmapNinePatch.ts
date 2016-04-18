import NinePatch from "./bitmapninepatch/NinePatch";
import NinePatchCoordinates from "./bitmapninepatch/NinePatchCoordinates";
import Bitmap from "../display/Bitmap";
import {DisplayObject} from "../display/DisplayObject";
import Rectangle from "../geom/Rectangle";
import DisplayType from "../enum/DisplayType";
import Size from "../geom/Size";

class BitmapNinePatch extends DisplayObject {

	public type:DisplayType = DisplayType.TEXTURE;

	private _patch:NinePatch;

	public _isLoaded:boolean = false;

	constructor(ninePatch:NinePatch, width:any = '100%', height:any = '100%', x:any = 0, y:any = 0, regX:any = 0, regY:any = 0){
		super(width, height, x, y, regX, regY);

		this._patch = ninePatch;

		console.log(this._patch.texture.hasLoaded());

		if( !this._patch.texture.hasLoaded() ){
			this._patch.texture.load().then(this.onLoad.bind(this));
		} else {
			this.onLoad();
		}
	}

	private onLoad():void
	{
		console.log('ONLOAD!!', this);
		
		this._isLoaded = true;
	}

	private isLoaded():boolean
	{
		return this._isLoaded;
	}

	public setContentSize(width:number, height:number):BitmapNinePatch
	{
		var imageSize = new Size(this._patch.texture.width, this._patch.texture.height);

		this.setWidth(
			this._patch.rectangle.x
			+ Math.max(this._patch.rectangle.width, width)
			+ imageSize.width - (this._patch.rectangle.x + this._patch.rectangle.width)
		);

		this.setHeight(
			this._patch.rectangle.y
			+ Math.max(this._patch.rectangle.height, height)
			+ imageSize.height - (this._patch.rectangle.y + this._patch.rectangle.height)
		);

		return this;
	}

	public getRectangle():Rectangle
	{
		return this._patch.rectangle;
	}

	public draw(ctx:CanvasRenderingContext2D, ignoreCache:boolean):boolean
	{

		if(!this._isLoaded){
			return false;
		}



		if(super.draw(ctx, ignoreCache))
		{
			return true;
		}

		var textures = this._patch.getTextures(this.width, this.height);

		for(var i = 0; i < textures.length; i++)
		{
			var texture = textures[i];
			texture.draw(ctx);
		}

		return true;
	}
}

export default BitmapNinePatch;