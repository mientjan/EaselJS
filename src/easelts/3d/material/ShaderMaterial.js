/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  defines: { "label" : "value" },
 *  uniforms: { "parameter1": { type: "f", value: 1.0 }, "parameter2": { type: "i" value2: 2 } },
 *
 *  fragmentShader: <string>,
 *  vertexShader: <string>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  lights: <bool>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *	fog: <bool>
 * }
 */
var ShaderMaterial = (function () {
    function ShaderMaterial(parameters) {
        this.defines = {};
        this.uniforms = {};
        this.attributes = null;
        this.vertexShader = '\
void main() {\
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
}';
        this.fragmentShader = '\
void main() {\
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\
}';
        this.defaultAttributeValues = {
            'color': [1, 1, 1],
            'uv': [0, 0],
            'uv2': [0, 0]
        };
        this.setValues(parameters);
    }
    ShaderMaterial.prototype.setValues = function (values) {
        if (values === undefined) {
            return;
        }
        for (var key in values) {
            var newValue = values[key];
            if (newValue === undefined) {
                continue;
            }
            if (key in this) {
                var currentValue = this[key];
                this[key] = newValue;
            }
        }
    };
    return ShaderMaterial;
})();
