define(["require", "exports"], function (require, exports) {
    "use strict";
    var mapWebGLBlendModesToPixi = require('./utils/mapWebGLBlendModesToPixi');
    var BLEND = 0, DEPTH_TEST = 1, FRONT_FACE = 2, CULL_FACE = 3, BLEND_FUNC = 4;
    var WebGLState = (function () {
        function WebGLState(gl) {
            this.activeState = new Uint8Array(16);
            this.defaultState = new Uint8Array(16);
            this.stackIndex = 0;
            this.stack = [];
            this.attribState = {
                tempAttribState: new Array(this.maxAttribs),
                attribState: new Array(this.maxAttribs)
            };
            this.gl = gl;
            this.defaultState[0] = 1;
            this.maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
            this.blendModes = mapWebGLBlendModesToPixi(gl);
            this.nativeVaoExtension = (gl.getExtension('OES_vertex_array_object') ||
                gl.getExtension('MOZ_OES_vertex_array_object') ||
                gl.getExtension('WEBKIT_OES_vertex_array_object'));
        }
        WebGLState.prototype.push = function () {
            var state = this.state[++this.stackIndex];
            if (!state) {
                state = this.state[this.stackIndex] = new Uint8Array(16);
            }
            for (var i = 0; i < this.activeState.length; i++) {
                this.activeState[i] = state[i];
            }
        };
        WebGLState.prototype.pop = function () {
            var state = this.state[--this.stackIndex];
            this.setState(state);
        };
        WebGLState.prototype.setState = function (state) {
            this.setBlend(state[BLEND]);
            this.setDepthTest(state[DEPTH_TEST]);
            this.setFrontFace(state[FRONT_FACE]);
            this.setCullFace(state[CULL_FACE]);
            this.setBlendMode(state[BLEND_FUNC]);
        };
        WebGLState.prototype.setBlend = function (value) {
            if (this.activeState[BLEND] === value | 0) {
                return;
            }
            this.activeState[BLEND] = value | 0;
            var gl = this.gl;
            if (value) {
                gl.enable(gl.BLEND);
            }
            else {
                gl.disable(gl.BLEND);
            }
        };
        WebGLState.prototype.setBlendMode = function (value) {
            if (value === this.activeState[BLEND_FUNC]) {
                return;
            }
            this.activeState[BLEND_FUNC] = value;
            this.gl.blendFunc(this.blendModes[value][0], this.blendModes[value][1]);
        };
        WebGLState.prototype.setDepthTest = function (value) {
            if (this.activeState[DEPTH_TEST] === value | 0) {
                return;
            }
            this.activeState[DEPTH_TEST] = value | 0;
            var gl = this.gl;
            if (value) {
                gl.enable(gl.DEPTH_TEST);
            }
            else {
                gl.disable(gl.DEPTH_TEST);
            }
        };
        WebGLState.prototype.setCullFace = function (value) {
            if (this.activeState[CULL_FACE] === value | 0) {
                return;
            }
            this.activeState[CULL_FACE] = value | 0;
            var gl = this.gl;
            if (value) {
                gl.enable(gl.CULL_FACE);
            }
            else {
                gl.disable(gl.CULL_FACE);
            }
        };
        WebGLState.prototype.setFrontFace = function (value) {
            if (this.activeState[FRONT_FACE] === value | 0) {
                return;
            }
            this.activeState[FRONT_FACE] = value | 0;
            var gl = this.gl;
            if (value) {
                gl.frontFace(gl.CW);
            }
            else {
                gl.frontFace(gl.CCW);
            }
        };
        WebGLState.prototype.resetAttributes = function () {
            var gl = this.gl;
            for (var i = 1; i < this.maxAttribs; i++) {
                gl.disableVertexAttribArray(i);
            }
        };
        WebGLState.prototype.resetToDefault = function () {
            if (this.nativeVaoExtension) {
                this.nativeVaoExtension.bindVertexArrayOES(null);
            }
            this.resetAttributes();
            for (var i = 0; i < this.activeState.length; i++) {
                this.activeState[i] = 2;
            }
            this.setState(this.defaultState);
        };
        return WebGLState;
    }());
    exports.WebGLState = WebGLState;
});
