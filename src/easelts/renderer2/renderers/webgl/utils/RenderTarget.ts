var math = require('../../../math'),
	CONST = require('../../../const'),
	Transform2d = require('../../../c2d/Transform2d'),
	GLFramebuffer = require('pixi-gl-core').GLFramebuffer;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * @class
 * @memberof PIXI
 * @param gl {WebGLRenderingContext} the current WebGL drawing context
 * @param width {number} the horizontal range of the filter
 * @param height {number} the vertical range of the filter
 * @param scaleMode {number} See {@link PIXI.SCALE_MODES} for possible values
 * @param resolution {number} the current resolution
 * @param root {boolean} Whether this object is the root element or not
 */
export class RenderTarget
{
	//TODO Resolution could go here ( eg low res blurs )

	/**
	 * The current WebGL drawing context.
	 *
	 * @member {WebGLRenderingContext}
	 */
	gl:WebGLRenderingContext;

	// next time to create a frame buffer and texture

	/**
	 * A frame buffer
	 *
	 * @member {WebGLFrameBuffer}
	 */
	public frameBuffer = null;

	/**
	 * The texture
	 *
	 * @member {PIXI.Texture}
	 */
	public texture = null;

	/**
	 * The background colour of this render target, as an array of [r,g,b,a] values
	 *
	 * @member {array}
	 */
	public clearColor = [0, 0, 0, 0];

	/**
	 * The size of the object as a rectangle
	 *
	 * @member {PIXI.Rectangle}
	 */
	public size = new math.Rectangle(0, 0, 1, 1);

	/**
	 * The current resolution
	 *
	 * @member {number}
	 */
	public resolution = resolution || CONST.RESOLUTION;

	/**
	 * The actual transform from pixels region to webgl (-1,1)
	 *
	 * @member {PIXI.Transform2d}
	 */
	public projection2d = new Transform2d();

	/**
	 * World transform for this target. Sometimes it changes
	 * @member {PIXI.ComputedTransform2d}
	 */
	public worldProjection = null;

	/**
	 * The object's transform
	 *
	 * @member {PIXI.Matrix}
	 */
	public transform = null;

	/**
	 * The frame.
	 *
	 * @member {PIXI.Rectangle}
	 */
	public frame = null;

	/**
	 * The stencil buffer stores masking data for the render target
	 *
	 * @member {WebGLRenderBuffer}
	 */
	public defaultFrame = new math.Rectangle();
	public destinationFrame = null;
	public sourceFrame = null;

	/**
	 * The stencil buffer stores masking data for the render target
	 *
	 * @member {WebGLRenderBuffer}
	 */
	public stencilBuffer = null;

	/**
	 * The data structure for the stencil masks
	 *
	 * @member {PIXI.StencilMaskStack}
	 */
	public stencilMaskStack = [];

	/**
	 * Stores filter data for the render target
	 *
	 * @member {object[]}
	 */
	public filterStack = [
		{
			renderTarget: this,
			filter: [],
			bounds: this.size
		}
	];


	/**
	 * The scale mode.
	 *
	 * @member {number}
	 * @default PIXI.SCALE_MODES.DEFAULT
	 * @see PIXI.SCALE_MODES
	 */
	public scaleMode:number;

	/**
	 * Whether this object is the root element or not
	 *
	 * @member {boolean}
	 */
	public root:boolean;

	constructor(gl:WebGLRenderingContext, width:number, height:number, scaleMode:number, resolution:number, root:boolean)
	{
		//TODO Resolution could go here ( eg low res blurs )

		/**
		 * The current WebGL drawing context.
		 *
		 * @member {WebGLRenderingContext}
		 */
		this.gl = gl;

		// next time to create a frame buffer and texture

		/**
		 * A frame buffer
		 *
		 * @member {WebGLFrameBuffer}
		 */
		this.frameBuffer = null;

		/**
		 * The texture
		 *
		 * @member {PIXI.Texture}
		 */
		this.texture = null;

		/**
		 * The background colour of this render target, as an array of [r,g,b,a] values
		 *
		 * @member {array}
		 */
		this.clearColor = [0, 0, 0, 0];

		/**
		 * The size of the object as a rectangle
		 *
		 * @member {PIXI.Rectangle}
		 */
		this.size = new math.Rectangle(0, 0, 1, 1);

		/**
		 * The current resolution
		 *
		 * @member {number}
		 */
		this.resolution = resolution || CONST.RESOLUTION;

		/**
		 * The actual transform from pixels region to webgl (-1,1)
		 *
		 * @member {PIXI.Transform2d}
		 */
		this.projection2d = new Transform2d();

		/**
		 * World transform for this target. Sometimes it changes
		 * @member {PIXI.ComputedTransform2d}
		 */
		this.worldProjection = null;

		/**
		 * The object's transform
		 *
		 * @member {PIXI.Matrix}
		 */
		this.transform = null;

		/**
		 * The frame.
		 *
		 * @member {PIXI.Rectangle}
		 */
		this.frame = null;

		/**
		 * The stencil buffer stores masking data for the render target
		 *
		 * @member {WebGLRenderBuffer}
		 */
		this.defaultFrame = new math.Rectangle();
		this.destinationFrame = null;
		this.sourceFrame = null;

		/**
		 * The stencil buffer stores masking data for the render target
		 *
		 * @member {WebGLRenderBuffer}
		 */
		this.stencilBuffer = null;

		/**
		 * The data structure for the stencil masks
		 *
		 * @member {PIXI.StencilMaskStack}
		 */
		this.stencilMaskStack = [];

		/**
		 * Stores filter data for the render target
		 *
		 * @member {object[]}
		 */
		this.filterStack = [
			{
				renderTarget: this,
				filter: [],
				bounds: this.size
			}
		];


		/**
		 * The scale mode.
		 *
		 * @member {number}
		 * @default PIXI.SCALE_MODES.DEFAULT
		 * @see PIXI.SCALE_MODES
		 */
		this.scaleMode = scaleMode || CONST.SCALE_MODES.DEFAULT;

		/**
		 * Whether this object is the root element or not
		 *
		 * @member {boolean}
		 */
		this.root = root;


		if(!this.root)
		{
			this.frameBuffer = GLFramebuffer.createRGBA(gl, 100, 100);

			if(this.scaleMode === CONST.SCALE_MODES.NEAREST)
			{
				this.frameBuffer.texture.enableNearestScaling();
			}
			else
			{
				this.frameBuffer.texture.enableLinearScaling();

			}
			/*
			 A frame buffer needs a target to render to..
			 create a texture and bind it attach it to the framebuffer..
			 */

			// this is used by the base texture
			this.texture = this.frameBuffer.texture;
		}
		else
		{
			// make it a null framebuffer..
			this.frameBuffer = new GLFramebuffer(gl, 100, 100);
			this.frameBuffer.framebuffer = null;

		}

		this.setFrame();

		this.resize(width, height);
	}


	get projectionMatrix()
	{
		return this.worldProjection ? this.worldProjection.matrix : this.projection2d.matrix;
	}

	public setWorldProjection(worldProjection):void
	{
		if(worldProjection)
		{
			this.worldProjection = worldProjection.updateChildReverseTransform(this.worldProjection, this.projection2d);
		}
		else
		{
			this.worldProjection = null;
		}
	}

	public checkWorldProjection(worldProjection)
	{
		if(worldProjection)
		{
			if(!this.worldProjection)
			{
				return true;
			}
			return worldProjection.checkChildReverseTransform(this.worldProjection, this.projection2d);
		}
		else
		{
			return this.worldProjection !== null;
		}
	}

	/**
	 * Clears the filter texture.
	 *
	 * @param [bind=false] {boolean} Should we bind our framebuffer before clearing?
	 */
	public clear(clearColor:boolean):void
	{
		var cc = clearColor || this.clearColor;
		this.frameBuffer.clear(cc[0], cc[1], cc[2], cc[3]);//r,g,b,a);
	}

	/**
	 * Binds the stencil buffer.
	 *
	 */
	public attachStencilBuffer():void
	{
		//TODO check if stencil is done?
		/**
		 * The stencil buffer is used for masking in pixi
		 * lets create one and then add attach it to the framebuffer..
		 */
		if(!this.root)
		{
			this.frameBuffer.enableStencil();
		}
	}

	public setFrame(destinationFrame?, sourceFrame?):void
	{
		this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
		this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
	}

	/**
	 * Binds the buffers and initialises the viewport.
	 *
	 */
	public activate(worldProjection):void
	{
		//TOOD refactor usage of frame..
		var gl = this.gl;

		// make surethe texture is unbound!
		this.frameBuffer.bind();

		this.calculateProjection(this.destinationFrame, this.sourceFrame);

		if(this.transform)
		{
			this.projection2d.matrix2d.append(this.transform);
			this.projection2d.version++;
		}
		this.setWorldProjection(worldProjection);

		//TODO add a check as them may be the same!
		if(this.destinationFrame !== this.sourceFrame)
		{

			gl.enable(gl.SCISSOR_TEST);
			gl.scissor(this.destinationFrame.x | 0, this.destinationFrame.y | 0, (this.destinationFrame.width * this.resolution) | 0, (this.destinationFrame.height * this.resolution) | 0);
		}
		else
		{
			gl.disable(gl.SCISSOR_TEST);
		}


		// TODO - does not need to be updated all the time??
		gl.viewport(this.destinationFrame.x | 0, this.destinationFrame.y | 0, (this.destinationFrame.width * this.resolution) | 0, (this.destinationFrame.height * this.resolution) | 0);


	}


	/**
	 * Updates the projection matrix based on a projection frame (which is a rectangle)
	 *
	 */
	public calculateProjection(destinationFrame, sourceFrame):void
	{
		var p = this.projection2d;
		var pm = p.matrix2d;

		sourceFrame = sourceFrame || destinationFrame;

		pm.identity();

		// TODO: make dest scale source
		if(!this.root)
		{
			pm.a = 1 / destinationFrame.width * 2;
			pm.d = 1 / destinationFrame.height * 2;

			pm.tx = -1 - sourceFrame.x * pm.a;
			pm.ty = -1 - sourceFrame.y * pm.d;
		}
		else
		{
			pm.a = 1 / destinationFrame.width * 2;
			pm.d = -1 / destinationFrame.height * 2;

			pm.tx = -1 - sourceFrame.x * pm.a;
			pm.ty = 1 - sourceFrame.y * pm.d;
		}
	}


	/**
	 * Resizes the texture to the specified width and height
	 *
	 * @param width {Number} the new width of the texture
	 * @param height {Number} the new height of the texture
	 */
	public resize(width:number = 0, height:number = 0):void
	{

		if(this.size.width === width && this.size.height === height)
		{
			return;
		}

		this.size.width = width;
		this.size.height = height;

		this.defaultFrame.width = width;
		this.defaultFrame.height = height;


		this.frameBuffer.resize(width * this.resolution, height * this.resolution);

		var projectionFrame = this.frame || this.size;

		this.calculateProjection(projectionFrame);
	}

	/**
	 * Destroys the render target.
	 *
	 */
	public destroy():void
	{
		this.frameBuffer.destroy();

		this.frameBuffer = null;
		this.texture = null;
	}
}