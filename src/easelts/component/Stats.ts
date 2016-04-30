
import {DisplayObject} from "../display/DisplayObject";

var now = ( window.performance && window.performance.now ) ? window.performance.now.bind( performance ) : Date.now;

export class Stats extends DisplayObject
{
	private text:string = '';
	private startTime:number = now();
	private prevTime = this.startTime;
	private frames = 0;
	private mode = 0;

	// FPS

	private fps = 0;
	private fpsMin = Infinity;
	private fpsMax = 0;

	//var fpsDiv = createPanel( 'fps', '#0ff', '#002' );
	//var fpsText = fpsDiv.children[ 0 ];
	//var fpsGraph = fpsDiv.children[ 1 ];

	//container.appendChild( fpsDiv );

	// MS

	private ms = 0;
	private msMin = Infinity;
	private msMax = 0;
	private graph = new Array(100).map(function(){ return 0 });

	//var msDiv = createPanel( 'ms', '#0f0', '#020' );
	//var msText = msDiv.children[ 0 ];
	//var msGraph = msDiv.children[ 1 ];
	//
	//container.appendChild( msDiv );


	constructor(x = '100%', y = 0, rx = '100%', ry = 0){
		super(100, 50, x, y, rx, ry)
	}


	private updateGraph(graph:number[], value)
	{
		graph.shift();
		graph.push(
				Math.max(0, Math.min( this.height, this.height - value * this.height ))
		);
	}

	public draw(ctx:CanvasRenderingContext2D, ignore?:boolean):boolean
	{


		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0,0,this.width, this.height);
		ctx.fillStyle = '#FF0000';
		for(var i = 0; i < this.graph.length; i++)
		{
			var graph = this.graph[i];
			ctx.fillRect(i * 1,this.height - graph,1,graph)
		}

		ctx.fillStyle = '#000000';
		ctx.textAlign = "right";
		ctx.textBaseline = 'bottom'
		ctx.font="10px Georgia";
		ctx.fillText(this.text,this.width - 2,this.height - 2);

		return true;
	}

	public begin () {
		this.startTime = now();
	}

	public end() {

		var time = now();

		this.ms = time - this.startTime;
		this.msMin = Math.min( this.msMin, this.ms );
		this.msMax = Math.max( this.msMax, this.ms );

		this.text = ( this.ms | 0 ) + ' MS (' + ( this.msMin | 0 ) + '-' + ( this.msMax | 0 ) + ')';
		this.updateGraph( this.graph, this.ms / 200 );

		this.frames++;

		//if ( time > this.prevTime + 1000 ) {

			//this.fps = Math.round( ( this.frames * 1000 ) / ( time - this.prevTime ) );
			//this.fpsMin = Math.min( this.fpsMin, this.fps );
			//this.fpsMax = Math.max( this.fpsMax, this.fps );

			//fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
			//updateGraph( fpsGraph, fps / 100 );
			//
			//prevTime = time;
			//frames = 0;
			//
			//if ( mem !== undefined ) {
			//
			//	var heapSize = performance.memory.usedJSHeapSize;
			//	var heapSizeLimit = performance.memory.jsHeapSizeLimit;
			//
			//	mem = Math.round( heapSize * 0.000000954 );
			//	memMin = Math.min( memMin, mem );
			//	memMax = Math.max( memMax, mem );
			//
			//	memText.textContent = mem + ' MB (' + memMin + '-' + memMax + ')';
			//	updateGraph( memGraph, heapSize / heapSizeLimit );
			//
			//}

		//}

		return time;

	}

	public update () {
		this.startTime = this.end();
	}
}

