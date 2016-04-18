define(["require", "exports", "./ShaderType", "../../core/net/HttpRequest"], function (require, exports, ShaderType_1, HttpRequest_1) {
    "use strict";
    var Shader = (function () {
        function Shader(type, data) {
            this.type = type;
            if (data) {
                this.data = data;
            }
        }
        Shader.createFromUrl = function (type, url) {
            return HttpRequest_1.default.getString(url).then(function (data) {
                return new Shader(type, data);
            });
        };
        Shader.prototype.getShader = function (gl) {
            if (!this.shader) {
                if (this.type == ShaderType_1.default.FRAGMENT) {
                    this.shader = gl.createShader(gl.FRAGMENT_SHADER);
                }
                else if (this.type == ShaderType_1.default.VERTEX) {
                    this.shader = gl.createShader(gl.VERTEX_SHADER);
                }
                gl.shaderSource(this.shader, this.data);
                gl.compileShader(this.shader);
            }
            if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
                throw new Error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(this.shader));
            }
            return this.shader;
        };
        Shader.prototype.deleteShader = function (gl) {
            if (this.shader) {
                gl.deleteShader(this.shader);
                this.shader = void 0;
            }
        };
        Shader.prototype.toString = function () {
            return this.data;
        };
        Shader.prototype.destruct = function () {
            this.data = void 0;
        };
        return Shader;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Shader;
});
