import {Bitmap} from "../../display/Bitmap";
import {Rectangle} from "../../geom/Rectangle";
import {NinePatchCoordinates} from "./NinePatchCoordinates";
import {Size} from "../../geom/Size";
import {Texture} from "../../display/Texture";
import {TexturePosition} from "../../display/TexturePosition";

/**
 *
 */
export class NinePatch
{

	public texture:Texture;
	public rectangle:Rectangle;

	protected _prevWidth:number = -1;
	protected _prevHeight:number = -1;
	protected _textures:Array<TexturePosition> = [];
	protected _isLoaded:boolean = false;

	/**
	 *
	 * @param imageOrString
	 * @param rectangle
	 */
	constructor(texture:Texture|string, rectangle:Rectangle|Array<number>)
	{
		if(typeof texture == 'string')
		{
			this.texture = Texture.createFromString(<string> texture);
		} else {
			this.texture = <Texture> texture;
		}

		if(!(rectangle instanceof Rectangle))
		{

			this.rectangle = new Rectangle(rectangle[0], rectangle[1], rectangle[2], rectangle[3]);
		}
		else
		{
			this.rectangle = rectangle;
		}

		if(!this.texture.hasLoaded())
		{
			this.texture.load().then(() => this.onLoad());
		}
		else
		{
			this.onLoad();
		}
	}

	protected onLoad()
	{
		if(!this._isLoaded)
		{
			var source = new Rectangle(0, 0, 10, 10);
			var dest = new Rectangle(0, 0, 10, 10);
			var texture = this.texture;

			this._textures.push(new TexturePosition(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
			this._textures.push(new TexturePosition(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
			this._textures.push(new TexturePosition(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
			this._textures.push(new TexturePosition(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
			this._textures.push(new TexturePosition(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
			this._textures.push(new TexturePosition(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
			this._textures.push(new TexturePosition(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
			this._textures.push(new TexturePosition(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));
			this._textures.push(new TexturePosition(texture, source.x, source.y, source.width, source.height, dest.x, dest.y, dest.width, dest.height));

			this._isLoaded = true;
		}
	}

	/**
	 *
	 * @param width
	 * @param height
	 * @returns {NinePatchCoordinates}
	 */
	public getTextures(width:number, height:number):Array<TexturePosition>
	{
		if(width != this._prevWidth || height != this._prevHeight && this._textures.length == 9)
		{
			this._prevWidth = width;
			this._prevHeight = height;

			var size = new Size(this.texture.width, this.texture.height);
			var iw = size.width;
			var ih = size.height;
			var rx = this.rectangle.x;
			var ry = this.rectangle.y;
			var rw = this.rectangle.width;
			var rh = this.rectangle.height;

			var sourceRow = [
				0, ry, ry + rh, ih
			];

			var sourceColumn = [
				0, rx, rx + rw, iw
			];

			var destRow = [
				0, ry, height - ( sourceRow[3] - sourceRow[2] ), height
			];

			var destColumn = [
				0, rx, width - ( sourceColumn[3] - sourceColumn[2] ), width
			];

			// left top
			this._textures[0].setPosition(
				sourceColumn[0], sourceRow[0], sourceColumn[1], sourceRow[1],
				destColumn[0], destRow[0], destColumn[1], destRow[1]
			);

			// center top
			this._textures[1].setPosition(
				sourceColumn[1], sourceRow[0], sourceColumn[2] - sourceColumn[1], sourceRow[1],
				destColumn[1], destRow[0], destColumn[2] - destColumn[1], destRow[1]
			);

			// right top
			this._textures[2].setPosition(
				sourceColumn[2], sourceRow[0], sourceColumn[3] - sourceColumn[2], sourceRow[1],
				destColumn[2], destRow[0], destColumn[3] - destColumn[2], destRow[1]
			);

			// left middle
			this._textures[3].setPosition(
				sourceColumn[0], sourceRow[1], sourceColumn[1], sourceRow[2] - sourceRow[1],
				destColumn[0], destRow[1], destColumn[1], destRow[2] - destRow[1]
			);

			// center middle
			this._textures[4].setPosition(
				sourceColumn[1], sourceRow[1], sourceColumn[2] - sourceColumn[1], sourceRow[2] - sourceRow[1],
				destColumn[1], destRow[1], destColumn[2] - destColumn[1], destRow[2] - destRow[1]
			);

			// right middle
			this._textures[5].setPosition(
				sourceColumn[2], sourceRow[1], sourceColumn[3] - sourceColumn[2], sourceRow[2] - sourceRow[1],
				destColumn[2], destRow[1], destColumn[3] - destColumn[2], destRow[2] - destRow[1]
			);

			// left bottom
			this._textures[6].setPosition(
				sourceColumn[0], sourceRow[2], sourceColumn[1], sourceRow[3] - sourceRow[2],
				destColumn[0], destRow[2], destColumn[1], destRow[3] - destRow[2]
			);

			// center bottom
			this._textures[7].setPosition(
				sourceColumn[1], sourceRow[2], sourceColumn[2] - destColumn[1], sourceRow[3] - sourceRow[2],
				destColumn[1], destRow[2], destColumn[2] - destColumn[1], destRow[3] - destRow[2]
			);

			// right bottom
			this._textures[8].setPosition(
				sourceColumn[2], sourceRow[2], sourceColumn[3] - destColumn[2], sourceRow[3] - sourceRow[2],
				destColumn[2], destRow[2], destColumn[3] - destColumn[2], destRow[3] - destRow[2]
			);
		}

		return this._textures;
	}

	public isLoaded():boolean
	{
		return this._isLoaded;
	}
}

