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

import {LinkedList} from "./LinkedList";
import {Signal1} from "../event/Signal1";
import {SignalConnection} from "../event/SignalConnection";

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

export class FramePerSecondCollection extends Signal1<number>
{
	private _intervalKey:number = -1;
	private _fps:number;
	private _mspf:number;
	private _time:number = 0;

	public fps:number;

	constructor(fps:number)
	{
		super();
		this.fps = fps;
		this._fps = fps;
		this._mspf = 1000 / fps;
	}

	public listAdd(conn:SignalConnection, prioritize:boolean):any
	{
		super.listAdd(conn, prioritize);

		if(this.hasListeners()){
			this.start();
		}
	}

	public listRemove(conn:SignalConnection):any
	{
		super.listRemove(conn);

		if(!this.hasListeners()){
			this.stop();
		}
	}

	public start():void
	{
		if(this._fps == -1){
			this._runRequestAnimationFrame(Date.now());
		} else {
			this._runSetTimeout();
		}
	}

	private _runRequestAnimationFrame = (time:number):void =>
	{
		var time:number, ptime:number;
		this._intervalKey = requestAnimationFrame(this._runRequestAnimationFrame);
		ptime = this._time;
		this._time = time;
		this.emit(time - ptime);
	}

	private _runSetTimeout = ():void =>
	{
		var time:number, ptime:number;
		this._intervalKey = setTimeout(this._runSetTimeout, this._mspf);
		ptime = this._time;
		this._time = time = Date.now();
		this.emit(time - ptime);
	}

	public stop():void
	{
		if(this._fps == -1){
			cancelAnimationFrame(this._intervalKey);
		} else {
			clearTimeout(this._intervalKey);
		}
		this._intervalKey = -1;
	}
}

export class Interval2
{
	private static _requestAnimationFrameList:FramePerSecondCollection = new FramePerSecondCollection(-1);
	private static _setTimeoutList:LinkedList<FramePerSecondCollection> = new LinkedList<FramePerSecondCollection>();
	
	protected static add(framePerSecond:number, fixedTimeStep:boolean, callback:(delta:number) => any):SignalConnection
	{
		var connection:SignalConnection = null;
		
		if(framePerSecond === -1)
		{
			Interval2._requestAnimationFrameList.connect(callback);
		} 
		else if(framePerSecond >= 1)
		{
			// floor fps
			framePerSecond = framePerSecond | 0;
			var fpsCollection:FramePerSecondCollection = null;
			var list = Interval2._setTimeoutList;

			var currentNode = list.firstNode;
			while(currentNode !== null)
			{
				if(currentNode.element.fps == framePerSecond)
				{
					fpsCollection = currentNode.element;
					break;
				}
				currentNode = currentNode.next;
			}

			if(!fpsCollection){
				fpsCollection = new FramePerSecondCollection(framePerSecond);
				list.add(fpsCollection);
			}

			connection = fpsCollection.connect(callback);
		}
		
		return connection;
	}

	protected _framePerSecond:number;
	protected _fixedTimeStep:boolean;
	protected _connections:Array<SignalConnection> = [];

	constructor(framePerSecond:number = -1, fixedTimeStep = false)
	{
		if(framePerSecond === 0){
			throw new Error('framePerSecond can not be zero, only -1 or 1 and above is allowed. -1 will run as fast as possible.')
		}
		this._framePerSecond = framePerSecond;
		this._fixedTimeStep = fixedTimeStep;
	}

	public getFramePerSecond():number
	{
		return this._framePerSecond;
	}

	public add(callback:(delta:number) => any):SignalConnection
	{
		var connection = Interval2.add(this._framePerSecond, this._fixedTimeStep, callback);
		this._connections.push(connection);
		return connection;
	}

	public destruct():void
	{
		var connections = this._connections;
		while( connections.length ){
			connections.pop().dispose();
		}
	}
}