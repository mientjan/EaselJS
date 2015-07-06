class WebGlUtil
{
	public static createShader(gl:WebGLRenderingContext, value:string, type:number):WebGLShader
	{
		var shader = gl.createShader(type);
		gl.shaderSource(shader, value);
		gl.compileShader(shader);

		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		{
			throw gl.getShaderInfoLog(shader);
		}

		return shader;
	}

	public static createProgram(gl:WebGLRenderingContext, vertex:string, fragment:string):WebGLProgram
	{
		var program:WebGLProgram = gl.createProgram();
		var vshader:WebGLShader = WebGlUtil.createShader(gl, vertex, gl.VERTEX_SHADER);
		var fshader:WebGLShader = WebGlUtil.createShader(gl, fragment, gl.FRAGMENT_SHADER);

		gl.attachShader(program, vshader);
		gl.attachShader(program, fshader);
		gl.linkProgram(program);

		return program;
	}
}