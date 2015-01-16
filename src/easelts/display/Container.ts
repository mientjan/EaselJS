/*
 * Container
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
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

import DisplayObject = require('./DisplayObject');
import DisplayType = require('../enum/DisplayType');
import Size = require('../geom/Size');
import m2 = require('../geom/Matrix2');

import TimeEvent = require('../../createts/event/TimeEvent');

/**
 * A Container is a nestable display list that allows you to work with compound display elements. For  example you could
 * group arm, leg, torso and head {{#crossLink "Bitmap"}}{{/crossLink}} instances together into a Person Container, and
 * transform them as a group, while still being able to move the individual parts relative to each other. Children of
 * containers have their <code>transform</code> and <code>alpha</code> properties concatenated with their parent
 * Container.
 *
 * For example, a {{#crossLink "Shape"}}{{/crossLink}} with x=100 and alpha=0.5, placed in a Container with <code>x=50</code>
 * and <code>alpha=0.7</code> will be rendered to the canvas at <code>x=150</code> and <code>alpha=0.35</code>.
 * Containers have some overhead, so you generally shouldn't create a Container to hold a single child.
 *
 * <h4>Example</h4>
 *
 *      var container = new createjs.Container();
 *      container.addChild(bitmapInstance, shapeInstance);
 *      container.x = 100;
 *
 * @class Container
 * @extends DisplayObject
 * @constructor
 **/
class Container extends DisplayObject
{
	// public properties:
	public type:DisplayType = DisplayType.CONTAINER;

	/**
	 * The array of children in the display list. You should usually use the child management methods such as
	 * {{#crossLink "Container/addChild"}}{{/crossLink}}, {{#crossLink "Container/removeChild"}}{{/crossLink}},
	 * {{#crossLink "Container/swapChildren"}}{{/crossLink}}, etc, rather than accessing this directly, but it is
	 * included for advanced uses.
	 * @property children
	 * @type Array
	 * @default null
	 **/
	public children:any[] = [];

	/**
	 * Indicates whether the children of this container are independently enabled for mouse/pointer interaction.
	 * If false, the children will be aggregated under the container - for example, a click on a child shape would
	 * trigger a click event on the container.
	 * @property mouseChildren
	 * @type Boolean
	 * @default false
	 **/
	public mouseChildren = false;

	/**
	 * If false, the tick will not be propagated to children of this Container. This can provide some performance benefits.
	 * In addition to preventing the "tick" event from being dispatched, it will also prevent tick related updates
	 * on some display objects (ex. Sprite & MovieClip frame advancing, DOMElement visibility handling).
	 * @property tickChildren
	 * @type Boolean
	 * @default false
	 **/
	public tickChildren = true;

	/**
	 * @constructor
	 * @param width
	 * @param height
	 * @param x
	 * @param y
	 * @param regX
	 * @param regY
	 */
		constructor(width:any = '100%', height:any = '100%', x:any = 0, y:any = 0, regX:any = 0, regY:any = 0)
	{
		super(width, height, x, y, regX, regY);

		this.enableMouseInteraction();
	}

	public initialize()
	{

		this['constructor'].call(this)
		//		super.initialize();
	}

	/**
	 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
	 * This does not account for whether it would be visible within the boundaries of the stage.
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method isVisible
	 * @return {Boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
	 **/
	public isVisible()
	{
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && (this.cacheCanvas || this.children.length) );
	}

	/**
	 *
	 * @method enableMouseInteraction
	 */
	public enableMouseInteraction()
	{
		this.mouseChildren = true;
		super.enableMouseInteraction();
	}

	public disableMouseInteraction()
	{
		this.mouseChildren = false;
		super.disableMouseInteraction();
	}

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 **/
	public draw(ctx:CanvasRenderingContext2D, ignoreCache?:boolean):boolean
	{
		if(super.draw(ctx, ignoreCache))
		{
			return true;
		}

		// this ensures we don't have issues with display list changes that occur during a draw:
		var list = this.children, //.slice(0);
			child;
		for(var i = 0, l = list.length; i < l; i++)
		{
			child = list[i];

			if(!child.isVisible())
			{
				continue;
			}

			// draw the child:
			ctx.save();
			child.updateContext(ctx);
			child.draw(ctx);
			ctx.restore();
		}

		return true;
	}

	/**
	 * Adds a child to the top of the display list.
	 *
	 * <h4>Example</h4>
	 *
	 *      container.addChild(bitmapInstance);
	 *
	 *  You can also add multiple children at once:
	 *
	 *      container.addChild(bitmapInstance, shapeInstance, textInstance);
	 *
	 * @method addChild
	 * @param {DisplayObject} child The display object to add.
	 * @return {DisplayObject} The child that was added, or the last child if multiple children were added.
	 **/
	public addChild(...children:DisplayObject[]):DisplayObject
	{
		var length = children.length;
		if(length == 0)
		{
			return null;
		}

		if(length > 1)
		{
			for(var i = 0; i < length; i++)
			{
				this.addChild(children[i]);
			}

			return children[length - 1];
		}

		var child = children[0];
		if(child.parent)
		{
			child.parent.removeChild(child);
		}

		child.parent = this;
		if(this._parentSizeIsKnown)
		{
			if(typeof child.onResize == 'function')
			{
				child.onResize(new Size(this.width, this.height));
			}
		}

		if(this.stage)
		{
			child.stage = this.stage;
			if(child.onStageSet)
			{
				child.onStageSet.call(child);
			}
		}

		this.children.push(child);
		return child;
	}

	public onStageSet()
	{
		var children = this.children;
		for(var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.stage = this.stage;
			if(child.onStageSet)
			{
				child.onStageSet.call(child);
			}
		}
	}

	/**
	 * Adds a child to the display list at the specified index, bumping children at equal or greater indexes up one, and
	 * setting its parent to this Container.
	 *
	 * <h4>Example</h4>
	 *
	 *      addChildAt(child1, index);
	 *
	 * The index must be between 0 and numChildren. For example, to add myShape under otherShape in the display list,
	 * you could use:
	 *
	 *      container.addChildAt(myShape, container.getChildIndex(otherShape));
	 *
	 * This would also bump otherShape's index up by one. Fails silently if the index is out of range.
	 *
	 * @method addChildAt
	 * @param {DisplayObject} child The display object to add.
	 * @param {number} index The index to add the child at.
	 * @return {DisplayObject} Returns the last child that was added, or the last child if multiple children were added.
	 **/
	public addChildAt(child:DisplayObject, index:number)
	{
		if(child.parent)
		{
			child.parent.removeChild(child);
		}

		child.parent = this;
		if(this._parentSizeIsKnown)
		{
			child.onResize(new Size(this.width, this.height));
		}

		if(this.stage)
		{
			child.stage = this.stage;
			if(child.onStageSet)
			{
				child.onStageSet.call(child);
			}
		}

		this.children.splice(index, 0, child);
		return child;
	}

	/**
	 * Removes the specified child from the display list. Note that it is faster to use removeChildAt() if the index is
	 * already known.
	 *
	 * <h4>Example</h4>
	 *
	 *      container.removeChild(child);
	 *
	 * You can also remove multiple children:
	 *
	 *      removeChild(child1, child2, ...);
	 *
	 * Returns true if the child (or children) was removed, or false if it was not in the display list.
	 * @method removeChild
	 * @param {DisplayObject} child The child to remove.
	 * @return {Boolean} true if the child (or children) was removed, or false if it was not in the display list.
	 **/
	public removeChild(...children:DisplayObject[])
	{
		var l = children.length;
		if(l > 1)
		{
			var good = true;
			for(var i = 0; i < l; i++)
			{
				good = good && this.removeChild(children[i]);
			}
			return good;
		}

		return this.removeChildAt(this.children.indexOf(children[0]));
	}

	/**
	 * Removes the child at the specified index from the display list, and sets its parent to null.
	 *
	 * <h4>Example</h4>
	 *
	 *      container.removeChildAt(2);
	 *
	 * You can also remove multiple children:
	 *
	 *      container.removeChild(2, 7, ...)
	 *
	 * Returns true if the child (or children) was removed, or false if any index was out of range.
	 * @method removeChildAt
	 * @param {Number} index The index of the child to remove.
	 * @return {Boolean} true if the child (or children) was removed, or false if any index was out of range.
	 **/
	public removeChildAt(...index:number[])
	{
		var l = index.length;
		if(l > 1)
		{
			index.sort(function(a, b){ return b - a; });
			var good = true;
			for(var i = 0; i < l; i++)
			{
				good = good && this.removeChildAt(index[i]);
			}
			return good;
		}

		// check if remove command is valid.
		if(index[0] < 0 || index[0] > this.children.length - 1)
		{
			return false;
		}


		var child = this.children[index[0]];

		// remove parent
		if(child)
		{
			child.parent = null;
		}

		this.children.splice(index[0], 1);
		return true;
	}

	/**
	 * Removes all children from the display list.
	 *
	 * <h4>Example</h4>
	 *
	 *      container.removeAlLChildren();
	 *
	 * @method removeAllChildren
	 **/
	public removeAllChildren()
	{
		var children = this.children;
		while(children.length)
		{
			children.pop().parent = null;
		}
	}

	/**
	 * Returns the child at the specified index.
	 *
	 * <h4>Example</h4>
	 *
	 *      container.getChildAt(2);
	 *
	 * @method getChildAt
	 * @param {Number} index The index of the child to return.
	 * @return {DisplayObject} The child at the specified index. Returns null if there is no child at the index.
	 **/
	public getChildAt(index:number):DisplayObject
	{
		return this.children[index];
	}

	/**
	 * Returns the child with the specified name.
	 * @method getChildByName
	 * @param {String} name The name of the child to return.
	 * @return {DisplayObject} The child with the specified name.
	 **/
	public getChildByName(name:string):DisplayObject
	{
		var children = this.children;
		for(var i = 0, l = children.length; i < l; i++)
		{
			if(children[i].name == name)
			{
				return children[i];
			}
		}
		return null;
	}

	/**
	 * Performs an array sort operation on the child list.
	 *
	 * <h4>Example: Display children with a higher y in front.</h4>
	 *
	 *      var sortFunction = function(obj1, obj2, options) {
	 *          if (obj1.y > obj2.y) { return 1; }
	 *          if (obj1.y < obj2.y) { return -1; }
	 *          return 0;
	 *      }
	 *      container.sortChildren(sortFunction);
	 *
	 * @method sortChildren
	 * @param {Function} sortFunction the function to use to sort the child list. See JavaScript's <code>Array.sort</code>
	 * documentation for details.
	 **/
	public sortChildren(sortFunction:(a: DisplayObject, b: DisplayObject) => number ):void
	{
		this.children.sort(sortFunction);
	}

	/**
	 * Returns the index of the specified child in the display list, or -1 if it is not in the display list.
	 *
	 * <h4>Example</h4>
	 *
	 *      var index = container.getChildIndex(child);
	 *
	 * @method getChildIndex
	 * @param {DisplayObject} child The child to return the index of.
	 * @return {Number} The index of the specified child. -1 if the child is not found.
	 **/
	public getChildIndex(child:DisplayObject):number
	{
		return this.children.indexOf(child);
	}

	/**
	 * Returns the number of children in the display list.
	 * @method getNumChildren
	 * @return {Number} The number of children in the display list.
	 **/
	public getNumChildren():number
	{
		return this.children.length;
	}

	/**
	 * Swaps the children at the specified indexes. Fails silently if either index is out of range.
	 * @method swapChildrenAt
	 * @param {Number} index1
	 * @param {Number} index2
	 **/
	public swapChildrenAt(index1:number, index2:number):void
	{
		var children = this.children;
		var o1 = children[index1];
		var o2 = children[index2];
		if(!o1 || !o2)
		{
			return;
		}
		children[index1] = o2;
		children[index2] = o1;
	}

	/**
	 * Swaps the specified children's depth in the display list. Fails silently if either child is not a child of this
	 * Container.
	 * @method swapChildren
	 * @param {DisplayObject} child0
	 * @param {DisplayObject} child1
	 **/
	public swapChildren(child0:DisplayObject, child1:DisplayObject):void
	{
		var children = this.children;
		var index1, index2;
		for(var i = 0, l = children.length; i < l; i++)
		{
			if(children[i] == child0)
			{
				index1 = i;
			}
			if(children[i] == child1)
			{
				index2 = i;
			}
			if(index1 != null && index2 != null)
			{
				break;
			}
		}
		if(i == l)
		{
			return;
		} // TODO: throw error?
		children[index1] = child1;
		children[index2] = child0;
	}

	/**
	 * Changes the depth of the specified child. Fails silently if the child is not a child of this container, or the index is out of range.
	 *
	 * @method setChildIndex
	 * @param {DisplayObject} child
	 * @param {Number} index
	 **/
	public setChildIndex(child:DisplayObject, index:number):void
	{
		var children = this.children, l = children.length;
		if(child.parent != this || index < 0 || index >= l)
		{
			return;
		}
		for(var i = 0; i < l; i++)
		{
			if(children[i] == child)
			{
				break;
			}
		}
		if(i == l || i == index)
		{
			return;
		}
		children.splice(i, 1);
		children.splice(index, 0, child);
	}

	/**
	 * Returns true if the specified display object either is this container or is a descendent (child, grandchild, etc)
	 * of this container.
	 *
	 * @method contains
	 * @param {DisplayObject} child The DisplayObject to be checked.
	 * @return {Boolean} true if the specified display object either is this container or is a descendent.
	 **/
	public contains(child:DisplayObject):boolean
	{
		while(child)
		{
			if(child == this)
			{
				return true;
			}
			child = child.parent;
		}
		return false;
	}

	/**
	 * Tests whether the display object intersects the specified local point (ie. draws a pixel with alpha > 0 at the
	 * specified position). This ignores the alpha, shadow and compositeOperation of the display object, and all
	 * transform properties including regX/Y.
	 *
	 * @method hitTest
	 * @param {Number} x The x position to check in the display object's local coordinates.
	 * @param {Number} y The y position to check in the display object's local coordinates.
	 * @return {Boolean} A Boolean indicating whether there is a visible section of a DisplayObject that overlaps the specified
	 * coordinates.
	 **/
	public hitTest(x:number, y:number):boolean
	{
		// TODO: optimize to use the fast cache check where possible.
		return (this.getObjectUnderPoint(x, y) != null);
	}

	/**
	 * Returns an array of all display objects under the specified coordinates that are in this container's display
	 * list. This routine ignores any display objects with mouseEnabled set to false. The array will be sorted in order
	 * of visual depth, with the top-most display object at index 0. This uses shape based hit detection, and can be an
	 * expensive operation to run, so it is best to use it carefully. For example, if testing for objects under the
	 * mouse, test on tick (instead of on mousemove), and only if the mouse's position has changed.
	 *
	 * Accounts for both {{#crossLink "DisplayObject/hitArea:property"}}{{/crossLink}} and {{#crossLink "DisplayObject/mask:property"}}{{/crossLink}}.
	 * @method getObjectsUnderPoint
	 * @param {Number} x The x position in the container to test.
	 * @param {Number} y The y position in the container to test.
	 * @return {Array} An Array of DisplayObjects under the specified coordinates.
	 **/
	public getObjectsUnderPoint(x:number, y:number):DisplayObject[]
	{
		var arr = [];
		var pt = this.localToGlobal(x, y);
		this._getObjectsUnderPoint(pt.x, pt.y, arr);
		return arr;
	}

	/**
	 * Similar to {{#crossLink "Container/getObjectsUnderPoint()"}}{{/crossLink}}, but returns only the top-most display
	 * object. This runs significantly faster than <code>getObjectsUnderPoint()<code>, but is still an expensive
	 * operation. See {{#crossLink "Container/getObjectsUnderPoint"}}{{/crossLink}} for more information.
	 * @method getObjectUnderPoint
	 * @param {Number} x The x position in the container to test.
	 * @param {Number} y The y position in the container to test.
	 * @return {DisplayObject} The top-most display object under the specified coordinates.
	 **/
	public getObjectUnderPoint(x:number, y:number):DisplayObject[]
	{
		var pt = this.localToGlobal(x, y);
		return this._getObjectsUnderPoint(pt.x, pt.y);
	}

	/**
	 * Docced in superclass.
	 */
	public getBounds()
	{
		return this._getBounds(null, true);
	}

	/**
	 * Docced in superclass.
	 */
	public getTransformedBounds()
	{
		return this._getBounds(null, true);
	}

	/**
	 * Returns a clone of this Container. Some properties that are specific to this instance's current context are
	 * reverted to their defaults (for example .parent).
	 * @method clone
	 * @param {Boolean} recursive If true, all of the descendants of this container will be cloned recursively. If false, the
	 * properties of the container will be cloned, but the new instance will not have any children.
	 * @return {Container} A clone of the current Container instance.
	 **/
	public clone(recursive:boolean):Container
	{
		var container = new Container();
		this.cloneProps(container);
		if(recursive)
		{
			var arr = container.children = [];
			for(var i = 0, l = this.children.length; i < l; i++)
			{
				var clone = this.children[i].clone(recursive);
				clone.parent = container;
				arr.push(clone);
			}
		}

		return container;
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	public toString():string
	{
		return "[Container (name=" + this.name + ")]";
	}

	public onResize(e:Size):void
	{

		super.onResize(e);

		var size = new Size(this.width, this.height);
		var child = null;
		for(var i = 0; i < this.children.length; i++)
		{
			child = this.children[i];
			if(typeof child.onResize == 'function')
			{
				child.onResize(size)
			}
		}

	}

	// private properties:
	/**
	 * @property DisplayObject__tick
	 * @type Function
	 * @private
	 **/
	//	p.DisplayObject__tick = p._tick;

	/**
	 * @method _tick
	 * @param {Object} props Properties to copy to the DisplayObject {{#crossLink "DisplayObject/tick"}}{{/crossLink}} event object.
	 * function.
	 * @protected
	 **/
	public onTick(e:TimeEvent)
	{
		if(this.tickChildren)
		{
			var children = this.children;
			for(var i = children.length - 1; i >= 0; i--)
			{
				var child = children[i];
				if(child.tickEnabled)
				{
					child.onTick(e);
				}
			}

		}

		super.onTick(e);
	}

	/**
	 * @method _getObjectsUnderPoint
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Array} arr
	 * @param {Boolean} mouse If true, it will respect mouse interaction properties like mouseEnabled, mouseChildren, and active listeners.
	 * @param {Boolean} activeListener If true, there is an active mouse event listener.
	 * @return {Array}
	 * @protected
	 **/
	public _getObjectsUnderPoint(x, y, arr?:any[], mouse?:boolean, activeListener?:boolean)
	{
		var ctx = DisplayObject._hitTestContext;
		var mtx = this._matrix;
		activeListener = activeListener || (mouse && this._hasMouseEventListener());

		// draw children one at a time, and check if we get a hit:
		var children = this.children;
		var l = children.length;
		for(var i = l - 1; i >= 0; i--)
		{
			var child = children[i];
			var hitArea = child.hitArea;
			var mask = child.mask;


			if(!child.visible || (!hitArea && !child.isVisible()) || (mouse && !child.mouseEnabled))
			{
				continue;
			}


			if(!hitArea && mask && mask.graphics && !mask.graphics.isEmpty())
			{
				var maskMtx = mask.getMatrix(mask._matrix).prependMatrix(this.getConcatenatedMatrix(mtx));
				ctx.setTransform(maskMtx.a, maskMtx.b, maskMtx.c, maskMtx.d, maskMtx.tx - x, maskMtx.ty - y);

				// draw the mask as a solid fill:
				mask.graphics.drawAsPath(ctx);
				ctx.fillStyle = "#000";
				ctx.fill();

				// if we don't hit the mask, then no need to keep looking at this DO:

				if(!this._testHit(ctx))
				{
					continue;
				}
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, 2, 2);
			}

			// if a child container has a hitArea then we only need to check its hitArea, so we can treat it as a normal DO:
			if(!hitArea && child.type == DisplayType.CONTAINER)
			{
				var result = ( <Container> child)._getObjectsUnderPoint(x, y, arr, mouse, activeListener);
				if(!arr && result)
				{
					return (mouse && !this.mouseChildren) ? this : result;
				}
			}
			else
			{


				if(mouse && !activeListener && !child._hasMouseEventListener())
				{
					continue;
				}


				child.getConcatenatedMatrix(mtx);

				if(hitArea)
				{
					mtx.appendTransform(hitArea.x, hitArea.y, hitArea.scaleX, hitArea.scaleY, hitArea.rotation, hitArea.skewX, hitArea.skewY, hitArea.regX, hitArea.regY);
					mtx.alpha = hitArea.alpha;
				}

				ctx.globalAlpha = mtx.alpha;
				ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y);
				(hitArea || child).draw(ctx);


				if(!this._testHit(ctx))
				{
					continue;
				}
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, 2, 2);


				if(arr)
				{
					arr.push(child);
				}
				else
				{


					return (mouse && !this.mouseChildren) ? this : child;
				}
			}
		}

		return null;
	}

	/**
	 * @method _getBounds
	 * @param {Matrix2D} matrix
	 * @param {Boolean} ignoreTransform If true, does not apply this object's transform.
	 * @return {Rectangle}
	 * @protected
	 **/
	public _getBounds(matrix:m2.Matrix2, ignoreTransform:boolean)
	{
		var bounds = super.getBounds();
		if(bounds)
		{
			return this._transformBounds(bounds, matrix, ignoreTransform);
		}

		var minX, maxX, minY, maxY;
		var mtx = ignoreTransform ? this._matrix.identity() : this.getMatrix(this._matrix);
		if(matrix)
		{
			mtx.prependMatrix(matrix);
		}

		var l = this.children.length;
		for(var i = 0; i < l; i++)
		{
			var child = this.children[i];
			if(!child.visible || !(bounds = child._getBounds(mtx)))
			{
				continue;
			}
			var x1 = bounds.x, y1 = bounds.y, x2 = x1 + bounds.width, y2 = y1 + bounds.height;
			if(x1 < minX || minX == null)
			{
				minX = x1;
			}
			if(x2 > maxX || maxX == null)
			{
				maxX = x2;
			}
			if(y1 < minY || minY == null)
			{
				minY = y1;
			}
			if(y2 > maxY || maxY == null)
			{
				maxY = y2;
			}
		}

		return (maxX == null) ? null : this._rectangle.initialize(minX, minY, maxX - minX, maxY - minY);
	}


	public destruct()
	{

		for(var i = 0; i < this.children.length; i++)
		{
			if(typeof this.children[i].destruct == 'function')
			{
				this.children[i].destruct();
			}
		}

		this.disableMouseInteraction();
		this.removeAllChildren();

		super.destruct();
	}
}

export = Container;