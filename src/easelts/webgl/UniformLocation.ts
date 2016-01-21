import ShaderProgram from "./ShaderProgram";

class UniformLocation
{
	protected _gl:WebGLRenderingContext = null;
	protected _name:string;
	protected _type:number;
	protected _location:WebGLUniformLocation;
	protected _value:any;

	constructor(gl:WebGLRenderingContext, name:string, location:WebGLUniformLocation, type:number)
	{
		this._gl = gl;
		this._name = name;
		this._location = location;
		this._type = type;
	}

	public getValue():any
	{
		return this._value;
	}

	public setValue(value):any
	{
		var gl = this._gl;
		if( this._value != value )
		{
			this._value = value;

			switch(this._type)
			{
				case gl.FLOAT:{
					gl.uniform1f(this._location, value);
					break;
				}

				case gl.INT:{
					gl.uniform1i(this._location, value);
					break;
				}

				case gl.FLOAT_VEC2:{
					gl.uniform2fv(this._location, value);
					break;
				}

				case gl.FLOAT_MAT2:{
					gl.uniformMatrix2fv(this._location, false, value);
					break;
				}

				case gl.FLOAT_MAT3:{
					gl.uniformMatrix3fv(this._location, false, value);
					break;
				}

				case gl.FLOAT_MAT4:{
					gl.uniformMatrix4fv(this._location, false, value);
					break;
				}

				case gl.FLOAT_VEC2:{
					gl.uniform2fv(this._location, value);
					break;
				}

				case gl.FLOAT_VEC3:{
					gl.uniform3fv(this._location, value);
					break;
				}

				case gl.FLOAT_VEC4:{
					gl.uniform4fv(this._location, value);
					break;
				}

			}
		}
	}

	public get name()
	{
		return this._name;
	}

	public get value()
	{
		return this._value;
	}

	public set value(value:any)
	{
		this._value = value;
	}
}

export default UniformLocation;