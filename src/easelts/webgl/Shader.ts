import ShaderType from "./ShaderType";
import HttpRequest from "../../core/net/HttpRequest";
import Promise from "../../core/util/Promise";

/**
 *
 */
class Shader
{
	public static createFromUrl(type:ShaderType, url:string):Promise<Shader>
	{
		return HttpRequest.getString<Shader>(url).then(data => {
			return new Shader(type, data);
		})
	}

	public type:ShaderType;
	public data:string;
	public shader:WebGLShader;

	constructor(type:ShaderType, data?:string)
	{
		this.type = type;

		if(data){
			this.data = data;
		}
	}

	public getShader(gl:WebGLRenderingContext):WebGLShader
	{
		if(!this.shader)
		{
			if(this.type == ShaderType.FRAGMENT)
			{
				this.shader = gl.createShader(gl.FRAGMENT_SHADER);
			}
			else if(this.type == ShaderType.VERTEX)
			{
				this.shader = gl.createShader(gl.VERTEX_SHADER);
			}

			gl.shaderSource(this.shader, this.data);
			gl.compileShader(this.shader);
		}

		if(!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS))
		{
			throw new Error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(this.shader));
			return null;
		}

		return this.shader;
	}

	public deleteShader(gl:WebGLRenderingContext):void
	{
		if(this.shader)
		{
			gl.deleteShader(this.shader);
			this.shader = void 0;
		}

	}

	public toString():string
	{
		return this.data;
	}

	public destruct():void
	{
		this.data = void 0;
	}
}

export default Shader;