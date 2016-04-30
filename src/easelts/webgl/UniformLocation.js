define(["require", "exports"], function (require, exports) {
    "use strict";
    var UniformLocation = (function () {
        function UniformLocation(gl, name, location, type) {
            this._gl = null;
            this._gl = gl;
            this._name = name;
            this._location = location;
            this._type = type;
        }
        UniformLocation.prototype.getValue = function () {
            return this._value;
        };
        UniformLocation.prototype.setValue = function (value) {
            var gl = this._gl;
            if (this._value != value) {
                this._value = value;
                switch (this._type) {
                    case gl.FLOAT: {
                        gl.uniform1f(this._location, value);
                        break;
                    }
                    case gl.INT: {
                        gl.uniform1i(this._location, value);
                        break;
                    }
                    case gl.FLOAT_VEC2: {
                        gl.uniform2fv(this._location, value);
                        break;
                    }
                    case gl.FLOAT_MAT2: {
                        gl.uniformMatrix2fv(this._location, false, value);
                        break;
                    }
                    case gl.FLOAT_MAT3: {
                        gl.uniformMatrix3fv(this._location, false, value);
                        break;
                    }
                    case gl.FLOAT_MAT4: {
                        gl.uniformMatrix4fv(this._location, false, value);
                        break;
                    }
                    case gl.FLOAT_VEC2: {
                        gl.uniform2fv(this._location, value);
                        break;
                    }
                    case gl.FLOAT_VEC3: {
                        gl.uniform3fv(this._location, value);
                        break;
                    }
                    case gl.FLOAT_VEC4: {
                        gl.uniform4fv(this._location, value);
                        break;
                    }
                }
            }
        };
        Object.defineProperty(UniformLocation.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UniformLocation.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
            },
            enumerable: true,
            configurable: true
        });
        return UniformLocation;
    }());
    exports.UniformLocation = UniformLocation;
});
