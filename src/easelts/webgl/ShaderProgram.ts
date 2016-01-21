
import Shader from "./Shader";
import IHashMap from "../../core/interface/IHashMap";
import UniformLocation from "./UniformLocation";
class ShaderProgram
{
	gl:WebGLRenderingContext;
	program:WebGLProgram;

	private _uniforms:IHashMap<UniformLocation> = null;
	private _attributes:IHashMap<number> = null;

	constructor(gl:WebGLRenderingContext, vertex:Shader, fragment:Shader)
	{
		this.gl = gl;
		this.program = gl.createProgram();

		// Create the shader program
		gl.attachShader(this.program, vertex.getShader(gl));
		gl.attachShader(this.program, fragment.getShader(gl));
		gl.linkProgram(this.program);

		// If creating the shader program failed, alert
		if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
			alert("Unable to initialize the shader program.");
		}
	}

	/**
	 *
	 * @returns {IHashMap<number>}
	 */
	public get attributes()
	{
		if(!this._attributes)
		{
			this._attributes = this.fetchAttributeLocations();
		}

		return this._attributes;
	}

	/**
	 *
	 * @returns {IHashMap<WebGLUniformLocation>}
	 */
	public get uniforms()
	{
		return this.getUniformLocations();
	}

	public useProgram():ShaderProgram
	{
		this.gl.useProgram(this.program);
		return this;
	}

	public getProgram():WebGLProgram
	{
		return this.program;
	}

	public getParameter(parameter:number):any
	{
		return this.gl.getProgramParameter( this.program, parameter );
	}

	public getAttribLocation(value:string):number
	{
		return this.gl.getAttribLocation(this.program, value);
	}

	public getUniformLocation(value:string):WebGLUniformLocation
	{
		return this.gl.getUniformLocation(this.program, value);
	}

	public getUniformLocations():IHashMap<UniformLocation>
	{
		if(!this._uniforms)
		{
			this._uniforms = this.fetchUniformLocations();
		}

		return this._uniforms;
	}
	protected fetchUniformLocations():IHashMap<UniformLocation>
	{
		var uniforms:IHashMap<UniformLocation> = {};
		var program = this.program;
		var gl = this.gl;

		var n = this.getParameter( gl.ACTIVE_UNIFORMS );

		for ( var i = 0; i < n; i ++ ) {

			var info = gl.getActiveUniform( program, i );
			var name = info.name;
			var type = info.type;
			var location = this.getUniformLocation( name );

			// console.log("ACTIVE UNIFORM:", name);

			//var suffixPos = name.lastIndexOf( '[0]' );
			//if ( suffixPos !== - 1 && suffixPos === name.length - 3 ) {
			//
			//	uniforms[ name.substr( 0, suffixPos ) ] = location;
			//}

			uniforms[ name ] = new UniformLocation(this.gl, name, location, type);
		}

		return uniforms;
	}

	protected fetchAttributeLocations():IHashMap<number>
	{
		var attributes:IHashMap<number> = {};

		var n = this.getParameter( this.gl.ACTIVE_ATTRIBUTES );
		var program = this.program;
		var gl = this.gl;

		for ( var i = 0; i < n; i ++ ) {

			var info = gl.getActiveAttrib( program, i );
			var name = info.name;
			var type = info.type;

			// console.log("ACTIVE VERTEX ATTRIBUTE:", name, i );

			attributes[ name ] = this.getAttribLocation(name);

		}

		return attributes;
	}

	public destruct():void
	{
		this.gl.deleteProgram(this.program);
		this.program = void 0;
		this.gl = void 0;
	}
}

export default ShaderProgram;