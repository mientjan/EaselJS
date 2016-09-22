var mapWebGLBlendModesToPixi = require('./utils/mapWebGLBlendModesToPixi');

var BLEND = 0,
	DEPTH_TEST = 1,
	FRONT_FACE = 2,
	CULL_FACE = 3,
	BLEND_FUNC = 4;

/**
 * A WebGL state machines
 * @param gl {WebGLRenderingContext} The current WebGL rendering context
 */
export class WebGLState
{
	/**
	 * The current active state
	 *
	 * @member {Uint8Array}
	 */
	public activeState = new Uint8Array(16);

	/**
	 * The default state
	 *
	 * @member {Uint8Array}
	 */
	public defaultState = new Uint8Array(16);

	/**
	 * The current state index in the stack
	 *
	 * @member {number}
	 * @private
	 */
	public stackIndex = 0;

	/**
	 * The stack holding all the different states
	 *
	 * @member {array}
	 * @private
	 */
	public stack = [];

	/**
	 * The current WebGL rendering context
	 *
	 * @member {WebGLRenderingContext}
	 */
	public gl:WebGLRenderingContext;

	public maxAttribs:number;

	public attribState = {
		tempAttribState: new Array(this.maxAttribs),
		attribState: new Array(this.maxAttribs)
	};

	blendModes;

	// check we have vao..
	nativeVaoExtension;

	constructor(gl:WebGLRenderingContext)
	{
		this.gl = gl;
		
		// default blend mode..
		this.defaultState[0] = 1;

		this.maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
		this.blendModes = mapWebGLBlendModesToPixi(gl);
		this.nativeVaoExtension = (
			gl.getExtension('OES_vertex_array_object') ||
			gl.getExtension('MOZ_OES_vertex_array_object') ||
			gl.getExtension('WEBKIT_OES_vertex_array_object')
		);
	}

	/**
	 * Pushes a new active state
	 */
	public push():void
	{
		// next state..
		var state = this.state[++this.stackIndex];

		if(!state)
		{
			state = this.state[this.stackIndex] = new Uint8Array(16);
		}

		// copy state..
		// set active state so we can force overrides of gl state
		for(var i = 0; i < this.activeState.length; i++)
		{
			this.activeState[i] = state[i];
		}
	}


	/**
	 * Pops a state out
	 */
	public pop():void
	{
		var state = this.state[--this.stackIndex];
		this.setState(state);
	}

	/**
	 * Sets the current state
	 * @param state {number}
	 */
	public setState(state):void
	{
		this.setBlend(state[BLEND]);
		this.setDepthTest(state[DEPTH_TEST]);
		this.setFrontFace(state[FRONT_FACE]);
		this.setCullFace(state[CULL_FACE]);
		this.setBlendMode(state[BLEND_FUNC]);
	}

	/**
	 * Sets the blend mode ? @mat
	 * @param value {number}
	 */
	public setBlend(value):void
	{
		if(this.activeState[BLEND] === value | 0)
		{
			return;
		}

		this.activeState[BLEND] = value | 0;

		var gl = this.gl;

		if(value)
		{
			gl.enable(gl.BLEND);
		}
		else
		{
			gl.disable(gl.BLEND);
		}
	}

	/**
	 * Sets the blend mode ? @mat
	 * @param value {number}
	 */
	public setBlendMode(value):void
	{
		if(value === this.activeState[BLEND_FUNC])
		{
			return;
		}

		this.activeState[BLEND_FUNC] = value;

		this.gl.blendFunc(this.blendModes[value][0], this.blendModes[value][1]);
	}

	/**
	 * Sets the depth test @mat
	 * @param value {number}
	 */
	public setDepthTest(value):void
	{
		if(this.activeState[DEPTH_TEST] === value | 0)
		{
			return;
		}

		this.activeState[DEPTH_TEST] = value | 0;

		var gl = this.gl;

		if(value)
		{
			gl.enable(gl.DEPTH_TEST);
		}
		else
		{
			gl.disable(gl.DEPTH_TEST);
		}
	}

	/**
	 * Sets the depth test @mat
	 * @param value {number}
	 */
	public setCullFace(value):void
	{
		if(this.activeState[CULL_FACE] === value | 0)
		{
			return;
		}

		this.activeState[CULL_FACE] = value | 0;

		var gl = this.gl;

		if(value)
		{
			gl.enable(gl.CULL_FACE);
		}
		else
		{
			gl.disable(gl.CULL_FACE);
		}
	}

	/**
	 * Sets the depth test @mat
	 * @param value {number}
	 */
	public setFrontFace(value):void
	{
		if(this.activeState[FRONT_FACE] === value | 0)
		{
			return;
		}

		this.activeState[FRONT_FACE] = value | 0;

		var gl = this.gl;

		if(value)
		{
			gl.frontFace(gl.CW);
		}
		else
		{
			gl.frontFace(gl.CCW);
		}
	}

	/**
	 * Disables all the vaos in use
	 */
	public resetAttributes():void
	{
		var gl = this.gl;

		// im going to assume one is always active for performance reasons.
		for(var i = 1; i < this.maxAttribs; i++)
		{
			gl.disableVertexAttribArray(i);
		}
	}

	//used
	/**
	 * Resets all the logic and disables the vaos
	 */
	public resetToDefault():void
	{
		// unbind any VAO if they exist..
		if(this.nativeVaoExtension)
		{
			this.nativeVaoExtension.bindVertexArrayOES(null);
		}

		// reset all attributs..
		this.resetAttributes();

		// set active state so we can force overrides of gl state
		for(var i = 0; i < this.activeState.length; i++)
		{
			this.activeState[i] = 2;
		}

		this.setState(this.defaultState);
	}
}