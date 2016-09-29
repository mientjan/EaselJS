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

import {Signal2} from "../event/Signal2";
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

if (!Date.now) {
	Date.now = function now() {
		return new Date().getTime();
	};
}

import {Signal1} from "../event/Signal1";
import {SignalConnection} from "../event/SignalConnection";

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

export class FramePerSecondCollection extends Signal2<number, number> {

	public accum:number = 0;
	public fixed:boolean = false;

	public fps:number;
	public mspf:number;

	constructor(fps, fixed:boolean){
		super();
		this.fps = fps;
		this.fixed = fixed;
		this.mspf = 1000 / fps;
	}
}

var rafInt:number = 0;
var time:number = 0;
var list:Array<FramePerSecondCollection> = [];
var listLength:number = 0;

function requestAnimationFrame(timeUpdate:number):void
{
	rafInt = window.requestAnimationFrame(requestAnimationFrame);
	var prevTime = time;
	time = timeUpdate;

	var delta = timeUpdate - prevTime;
	var fc;
	var mspf;

	for(var i = 0; i < listLength; i++)
	{
		fc = list[i];
		mspf = fc.mspf;
		fc.accum += delta;

		if(fc.fixed){
			while(fc.accum >= fc.mspf)
			{
				fc.accum -= fc.mspf;
				fc.emit(fc.mspf, fc.accum);
			}
		} else if (fc.accum >= fc.mspf){
			fc.signal.emit(fc.mspf, fc.accum);
			fc.accum = 0;
		}
	}
}

export class Interval
{
	public static isRunning:boolean = false;

	public static attach(fps:number, fixed:boolean = false, callback:(delta:number, accumulated:number) => any):SignalConnection
	{
		// floor fps
		var framePerSecond = fps | 0;
		var fc:FramePerSecondCollection = null;

		for(var i = 0; i < list.length; i++)
		{
			if( list[i].fps == framePerSecond && list[i].fixed == fixed )
			{
				fc = list[i];
			}
		}

		if(!fc){
			fc = new FramePerSecondCollection(framePerSecond, fixed);
			list.push(fc);
			listLength = list.length;
		}

		return fc.connect(callback);
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

	private _fps:number;
	private _fixedTimeStep:boolean;
	private _connections:Array<SignalConnection> = [];

	constructor(fps:number = 60, fixedTimeStep:boolean = false)
	{
		this._fps = fps;
		this._fixedTimeStep = fixedTimeStep;
	}

	public attach(callback:(delta:number, accumulate:number) => any):SignalConnection
	{
		var connection = Interval.attach(this._fps, this._fixedTimeStep, callback);
		this._connections.push(connection);
		Interval.start();

		return connection;
	}

	public destruct():void
	{
		var connections = this._connections;
		while( connections.length){
			connections.pop().dispose();
		}
	}
}
