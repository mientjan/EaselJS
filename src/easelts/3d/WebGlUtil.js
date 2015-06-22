var WebGlUtil = (function () {
    function WebGlUtil() {
    }
    WebGlUtil.createShader = function (gl, value, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, value);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw gl.getShaderInfoLog(shader);
        }
        return shader;
    };
    WebGlUtil.createProgram = function (gl, vertex, fragment) {
        var program = gl.createProgram();
        var vshader = WebGlUtil.createShader(gl, vertex, gl.VERTEX_SHADER);
        var fshader = WebGlUtil.createShader(gl, fragment, gl.FRAGMENT_SHADER);
        gl.attachShader(program, vshader);
        gl.attachShader(program, fshader);
        gl.linkProgram(program);
        return program;
    };
    return WebGlUtil;
})();
