define(["require", "exports", "../../core/net/HttpRequest"], function (require, exports, HttpRequest_1) {
    "use strict";
    var Shader = (function () {
        function Shader(type, data) {
            this.type = type;
            if (data) {
                this.data = data;
            }
        }
        Shader.createFromUrl = function (type, url) {
            return HttpRequest_1.HttpRequest.getString(url).then(function (data) {
                return new Shader(type, data);
            });
        };
        Shader.prototype.getShader = function (gl) {
            if (!this.shader) {
                if (this.type == 0) {
                    this.shader = gl.createShader(gl.FRAGMENT_SHADER);
                }
                else if (this.type == 1) {
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
    exports.Shader = Shader;
});
