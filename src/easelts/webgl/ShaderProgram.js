define(["require", "exports", "./UniformLocation"], function (require, exports, UniformLocation_1) {
    var ShaderProgram = (function () {
        function ShaderProgram(gl, vertex, fragment) {
            this._uniforms = null;
            this._attributes = null;
            this.gl = gl;
            this.program = gl.createProgram();
            gl.attachShader(this.program, vertex.getShader(gl));
            gl.attachShader(this.program, fragment.getShader(gl));
            gl.linkProgram(this.program);
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                alert("Unable to initialize the shader program.");
            }
        }
        Object.defineProperty(ShaderProgram.prototype, "attributes", {
            get: function () {
                if (!this._attributes) {
                    this._attributes = this.fetchAttributeLocations();
                }
                return this._attributes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ShaderProgram.prototype, "uniforms", {
            get: function () {
                return this.getUniformLocations();
            },
            enumerable: true,
            configurable: true
        });
        ShaderProgram.prototype.useProgram = function () {
            this.gl.useProgram(this.program);
            return this;
        };
        ShaderProgram.prototype.getProgram = function () {
            return this.program;
        };
        ShaderProgram.prototype.getParameter = function (parameter) {
            return this.gl.getProgramParameter(this.program, parameter);
        };
        ShaderProgram.prototype.getAttribLocation = function (value) {
            return this.gl.getAttribLocation(this.program, value);
        };
        ShaderProgram.prototype.getUniformLocation = function (value) {
            return this.gl.getUniformLocation(this.program, value);
        };
        ShaderProgram.prototype.getUniformLocations = function () {
            if (!this._uniforms) {
                this._uniforms = this.fetchUniformLocations();
            }
            return this._uniforms;
        };
        ShaderProgram.prototype.fetchUniformLocations = function () {
            var uniforms = {};
            var program = this.program;
            var gl = this.gl;
            var n = this.getParameter(gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < n; i++) {
                var info = gl.getActiveUniform(program, i);
                var name = info.name;
                var type = info.type;
                var location = this.getUniformLocation(name);
                uniforms[name] = new UniformLocation_1.default(this.gl, name, location, type);
            }
            return uniforms;
        };
        ShaderProgram.prototype.fetchAttributeLocations = function () {
            var attributes = {};
            var n = this.getParameter(this.gl.ACTIVE_ATTRIBUTES);
            var program = this.program;
            var gl = this.gl;
            for (var i = 0; i < n; i++) {
                var info = gl.getActiveAttrib(program, i);
                var name = info.name;
                var type = info.type;
                attributes[name] = this.getAttribLocation(name);
            }
            return attributes;
        };
        ShaderProgram.prototype.destruct = function () {
            this.gl.deleteProgram(this.program);
            this.program = void 0;
            this.gl = void 0;
        };
        return ShaderProgram;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShaderProgram;
});
