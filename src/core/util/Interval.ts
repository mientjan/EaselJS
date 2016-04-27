/*
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 *
 * requestAnimationFrame polyfill
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Erik Möller
 * Copyright (c) 2015 Paul Irish
 * Copyright (c) 2015 Tino Zijdel
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
 * The above * copyright notice and this permission notice shall be
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

(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
				|| window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = <any> function(callback) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
					timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());

import Signal1 from "../event/Signal1";
import Signal from "../event/Signal";
import SignalConnection from "../event/SignalConnection";

/*
 * Interval
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mient-jan Stelling
 * Copyright (c) 2015 MediaMonks B.V
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

class FpsCollection {

	public signal:Signal1<number> = new Signal1<number>();
	public frame:number = 0;
	public time:number = 0;
	public ptime:number = 0;
	public accum:number = 0;

	public fps:number;
	public mspf:number;

	constructor(fps){
		this.fps = fps;
		this.mspf = 1000 / fps;
	}
}

var rafInt:number = 0;
var time:number = 0;
var list:Array<FpsCollection> = [];
var listLength:number = 0;

function requestAnimationFrame(timeUpdate:number):void
{
	rafInt = window.requestAnimationFrame(requestAnimationFrame);
	var prevTime = time;
	time = timeUpdate;

	var delta = timeUpdate - prevTime;
	var fc;

	for(var i = 0; i < listLength; i++)
	{
		fc = list[i];
		fc.time += delta;
		fc.accum += delta;

		if(fc.accum >= fc.mspf )
		{
			fc.signal.emit(fc.accum);
			fc.accum = 0;
			fc.ptime = fc.time;
		}
	}


}

class Interval
{
	public static isRunning:boolean = false;

	public static attach(fps_:number, callback:(delta:number) => any):SignalConnection
	{
		// floor fps
		var fps = fps_ | 0;
		var fc:FpsCollection = null;
		for(var i = 0; i < list.length; i++)
		{
			if( list[i].fps == fps )
			{
				fc = list[i];
			}
		}

		if(!fc){
			fc = new FpsCollection(fps);
			list.push(fc);
			listLength = list.length;
		}

		return fc.signal.connect(callback);
	}

	private static start():void
	{
		if(!Interval.isRunning)
		{
			Interval.isRunning = true;
			requestAnimationFrame(0);
		}
	}

	private static stop():void
	{
		Interval.isRunning = false;
		cancelAnimationFrame(rafInt);
	}

	private fps:number = 0;
	private _connections:Array<SignalConnection> = [];

	constructor(fps:number = 60)
	{
		this.fps = fps;
	}

	public attach(callback:(delta:number) => any):SignalConnection
	{
		var connection = Interval.attach(this.fps, callback);
		this._connections.push(connection);
		Interval.start();

		return connection;
	}

	private _delay:number = -1;
	public getDelay():number
	{
		var delay = ( time - this._delay );
		this._delay = time;

		return delay;
	}

	public destruct():void
	{
		var connections = this._connections;
		while( connections.length){
			connections.pop().dispose();
		}
	}
}

export default Interval;
