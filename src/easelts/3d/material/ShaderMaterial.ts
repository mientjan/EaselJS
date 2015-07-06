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

class ShaderMaterial
{

	public defines = {};
	public uniforms = {};
	public attributes = null;


	public vertexShader = '\
void main() {\
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
}';

	public fragmentShader = '\
void main() {\
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\
}';

	// When rendered geometry doesn't include these attributes but the material does,
	// use these default values in WebGL. This avoids errors when buffer data is missing.
	public defaultAttributeValues = {
		'color': [ 1, 1, 1 ],
		'uv': [ 0, 0 ],
		'uv2': [ 0, 0 ]
	};

	constructor(parameters)
	{

		this.setValues(parameters);

	}

	public setValues(values)
	{
		if(values === undefined)
		{
			return;
		}

		for(var key in values)
		{
			var newValue = values[ key ];

			if(newValue === undefined)
			{

				continue;
			}

			if(key in this)
			{
				var currentValue = this[ key ];

//				if(currentValue instanceof THREE.Color)
//				{
//
//					currentValue.set(newValue);
//
//				}
//				else if(currentValue instanceof THREE.Vector3 && newValue instanceof THREE.Vector3)
//				{
//
//					currentValue.copy(newValue);
//
//				}
//				else if(key == 'overdraw')
//				{
//
//					// ensure overdraw is backwards-compatable with legacy boolean type
//					this[ key ] = Number(newValue);
//
//				}
//				else
//				{

					this[ key ] = newValue;

//				}

			}

		}

	}
}