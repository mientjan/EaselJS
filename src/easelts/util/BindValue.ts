/*
 Port of Value class from Flambe framework (https://github.com/aduros/flambe)

 Original license:

 Copyright (c) Bruno Garcia

 Permission is hereby granted, free of charge, to any person obtaining a
 copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be included
 in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Signal2 = require('../../createts/event/Signal2');

class BindValue<T>
{
	private _value:T;

	private _changed:Signal2<T,T>;


	constructor(value?:T, listener?:Function)
	{
		this._value = value;

		if (listener != void 0)
		{
			this.changed.connect(listener);
		}
	}

	public get _():T
	{
		return this._value;
	}

	public set _(value:T)
	{
		if (this._value === value) return;

		var oldValue:T = this._value;
		this._value = value;

		if (this._changed != void 0)
		{
			this._changed.emit(value, oldValue);
		}
	}

	public get changed():Signal2<T,T>
	{
		if (this._changed == void 0)
		{
			this._changed = new Signal2();
		}

		return this._changed;
	}

	public dispose():void
	{
		if(this._changed != void 0)
		{
			this._changed.dispose();
			this._changed = null;
		}

		this._value = null;
	}
}

export = BindValue;