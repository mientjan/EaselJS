/*
 * IDisplayType
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

import {DisplayType} from "../enum/DisplayType";
import {Stage} from "../display/Stage";
import {Container} from "../display/Container";
import {Rectangle} from "../geom/Rectangle";
import {IRectangle} from "./IRectangle";
import {Shape} from "../display/Shape";
import {Matrix2} from "../geom/Matrix2";
import {ILoadable} from "./../../core/interface/ILoadable";

export interface IDisplayObject extends ILoadable<any>
{
	type:DisplayType;

	updateContext(ctx:CanvasRenderingContext2D);
	draw(ctx:CanvasRenderingContext2D, ignoreCache?:boolean);
	setStage(stage:Stage);
	isVisible():boolean;
	hasMouseEventListener():boolean;
	onResize(width:number, height:number):void;
	getBounds():Rectangle;
	getTransformedBounds(matrix:Matrix2):Rectangle;
	getConcatenatedMatrix(matrix:Matrix2):Matrix2;
	destruct():void;

	mouseEnabled:boolean;
	mask:Shape;
	hitArea:IDisplayObject;
	parent:Container;

	isDirty:boolean;

	visible:boolean;

	alpha:number;
	width:number;
	height:number;

	skewX:number;
	skewY:number;
	rotation:number;
	x:number;
	y:number;

	regX:number;
	regY:number;

	scaleX:number;
	scaleY:number;
}


