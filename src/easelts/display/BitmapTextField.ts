/*
 * BitmapTextField
 *
 * Copyright (c) 2015 Mient-jan Stelling
 * Copyright (c) 2015 MediaMonks B.V.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

import Container from "./Container";
import Shape from "./Shape";
import Sprite from "./Sprite";
import Graphics from "./Graphics";
import VAlign from "./bitmapfont/VAlign";
import HAlign from "./bitmapfont/HAlign";
import BitmapFont from "./BitmapFont";
import ColorFilter from "../filters/ColorFilter";
import {DisplayObject} from "./DisplayObject";


function hexToR(h)
{
	return parseInt((cutHex(h)).substring(0, 2), 16)
}

function hexToG(h)
{
	return parseInt((cutHex(h)).substring(2, 4), 16)
}

function hexToB(h)
{
	return parseInt((cutHex(h)).substring(4, 6), 16)
}

function cutHex(h)
{
	return (h.charAt(0) == "#") ? h.substring(1, 7) : h
}

/**
 *
 * @param    width: width of the text field
 * @param    height: height of the text field
 * @param    text: text to be displayed
 * @param    fontName: name of the font give while registering the font.
 * @param    fontSize: size of the font, -1 to keep the font size as exported
 * @param    horizantalLetterSpacing: Horizantal letter space
 * @param    verticalLetterSpacing: line spacing
 * @param    hAlign: Horizantal alignment: accepted parameters: "left","right","center", default:"center"
 * @param    vAlign: Verticle alignment: accepter parameters: "top","center",""bottom", default:"center"
 * @param    autoScale: true, scales the text to fit in the space, default: true
 */
class BitmapTextField extends Container<DisplayObject>
{
	public static EVENT_TEXT_CHANGE = 'text_change';

	//One must register bitmapfont before creating a textfield..
	/**
	 *
	 * @param    bitmapFont: BitmapFont instance
	 * @param    fontName: name of the font, this will be used later while creating the text field.
	 */
	public static registerBitmapFont(bitmapFont:BitmapFont, fontName:string)
	{
		if(BitmapTextField.bitmapFonts[fontName] == null)
		{
			BitmapTextField.bitmapFonts[fontName] = bitmapFont;
			return fontName;
		}
		else
		{
			//			console.log(fontName + " : is already registered");
		}

		return null;
	}

	public static bitmapFonts = [];

	font:BitmapFont = null;
	hAlign:string;
	vAlign:string;
	autoScale:boolean;
	color:string;

	border:Shape;
	textContainer:Container<DisplayObject>;

	actualWidth:number;
	containerWidth:number;
	containerHeight:number;
	fontSize:number;
	horizantalLetterSpacing:number;
	verticalLetterSpacing:number;

	colorFilter:ColorFilter;

	constructor(width:number, height:number, textDisplay:string, fontName:string, fontSize:number,
	            horizantalLetterSpacing:number = 1, verticalLetterSpacing:number = 1,
	            hAlign:string = HAlign.CENTER, vAlign:string = VAlign.CENTER,
	            autoScale:boolean = false)
	{

		super();

		this.hAlign = hAlign;
		this.vAlign = vAlign;
		this.autoScale = autoScale;
		this.color = "";

		this.border = new Shape();
		this.border.graphics.setStrokeStyle(2);
		this.border.graphics.beginStroke(Graphics.getRGB(0, 0, 0));
		this.border.graphics.drawRect(0, 0, width, height);
		this.addChild(this.border);

		this.border.visible = false;
		this.textContainer = new Container<DisplayObject>();
		this.addChild(this.textContainer);

		this.containerWidth = width;
		this.containerHeight = height;
		this.setWidth(width);
		this.setHeight(height);
		this.fontSize = fontSize;

		this.horizantalLetterSpacing = horizantalLetterSpacing;
		this.verticalLetterSpacing = verticalLetterSpacing;

		if(BitmapTextField.bitmapFonts[fontName])
		{
			this.font = BitmapTextField.bitmapFonts[fontName];
			if(textDisplay.length > 0)
			{
				this.setText(textDisplay);
			}
		}
		else
		{
			throw new Error("BitmapTextField: Font is not registered " + fontName);
		}
	}

	public setText(textDisplay:string)
	{

		this.textContainer.uncache();
		this.textContainer.removeAllChildren();

		var container = this.font.createSprite(this.containerWidth, this.containerHeight, textDisplay, this.fontSize, this.horizantalLetterSpacing, this.verticalLetterSpacing, this.hAlign, this.vAlign, this.autoScale, true);

		this.textContainer.addChild(container);

		if(this.color != "")
		{
			this.setColor(this.color);
		}

		this.actualWidth = this.font.getWidth();

		this.dispatchEvent(BitmapTextField.EVENT_TEXT_CHANGE);
	}


	public getWidth()
	{
		return this.containerWidth;
	}

	//height of the container, the width given while creating text field

	public getHeight()
	{
		return this.containerHeight;
	}

	//actual text width.

	public getActualWidth()
	{
		return this.actualWidth;
	}

	//shows a red colored bounding box, useful for debugging.

	public showBorder(visible)
	{
		if(visible == null)
		{
			visible = true;
		}

		this.border.visible = visible;
	}

	public setColor(color)
	{

		var R = hexToR(color);
		var G = hexToG(color);
		var B = hexToB(color);

		if(color != this.color)
		{
			this.colorFilter = new ColorFilter(0, 0, 0, 1, R, G, B, 0);
		}

		this.textContainer.filters = [this.colorFilter];
		this.textContainer.cache(0, 0, this.containerWidth, this.containerHeight);

		this.color = color;

	}
}
export default BitmapTextField;
