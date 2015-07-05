import v3 = require('./Vector3');
import m4 = require('./Matrix4');

/**
 * @method Matrix3
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */
export class Matrix3
{
	public elements:Float32Array;

	constructor()
	{
		this.elements = new Float32Array([
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		]);
	}

	public set(n11:number, n12:number, n13:number, n21:number, n22:number, n23:number, n31:number, n32:number, n33:number):Matrix3
	{
		var te = this.elements;

		te[ 0 ] = n11;
		te[ 3 ] = n12;
		te[ 6 ] = n13;
		te[ 1 ] = n21;
		te[ 4 ] = n22;
		te[ 7 ] = n23;
		te[ 2 ] = n31;
		te[ 5 ] = n32;
		te[ 8 ] = n33;

		return this;
	}

	public identity():Matrix3
	{

		this.set(

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		);

		return this;

	}

	public copy(m:Matrix3):Matrix3
	{

		var me = m.elements;

		this.set(

			me[ 0 ], me[ 3 ], me[ 6 ],
			me[ 1 ], me[ 4 ], me[ 7 ],
			me[ 2 ], me[ 5 ], me[ 8 ]

		);

		return this;

	}

	private __v0:v3.Vector3 = null;

	public applyToVector3Array(array:number[], offset:number, length:number):number[]
	{
		if(!this.__v0){
			this.__v0 = new v3.Vector3(0, 0, 0);
		}
		var v1 = this.__v0;

		if(offset === undefined)
		{
			offset = 0;
		}
		if(length === undefined)
		{
			length = array.length;
		}

		for(var i = 0, j = offset, il; i < length; i += 3, j += 3)
		{

			v1.x = array[ j ];
			v1.y = array[ j + 1 ];
			v1.z = array[ j + 2 ];

			v1.applyMatrix3(this);

			array[ j ] = v1.x;
			array[ j + 1 ] = v1.y;
			array[ j + 2 ] = v1.z;

		}

		return array;

	}

	public multiplyScalar(s:number):Matrix3
	{

		var te = this.elements;

		te[ 0 ] *= s;
		te[ 3 ] *= s;
		te[ 6 ] *= s;
		te[ 1 ] *= s;
		te[ 4 ] *= s;
		te[ 7 ] *= s;
		te[ 2 ] *= s;
		te[ 5 ] *= s;
		te[ 8 ] *= s;

		return this;
	}

	public determinant():number
	{

		var te = this.elements;

		var a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
			d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
			g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

		return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

	}

	public getInverse(matrix:m4.Matrix4, throwOnInvertible:boolean = false)
	{

		// input: THREE.Matrix4
		// ( based on http://code.google.com/p/webgl-mjs/ )

		var me = matrix.elements;
		var te = this.elements;

		te[ 0 ] = me[ 10 ] * me[ 5 ] - me[ 6 ] * me[ 9 ];
		te[ 1 ] = -me[ 10 ] * me[ 1 ] + me[ 2 ] * me[ 9 ];
		te[ 2 ] = me[ 6 ] * me[ 1 ] - me[ 2 ] * me[ 5 ];
		te[ 3 ] = -me[ 10 ] * me[ 4 ] + me[ 6 ] * me[ 8 ];
		te[ 4 ] = me[ 10 ] * me[ 0 ] - me[ 2 ] * me[ 8 ];
		te[ 5 ] = -me[ 6 ] * me[ 0 ] + me[ 2 ] * me[ 4 ];
		te[ 6 ] = me[ 9 ] * me[ 4 ] - me[ 5 ] * me[ 8 ];
		te[ 7 ] = -me[ 9 ] * me[ 0 ] + me[ 1 ] * me[ 8 ];
		te[ 8 ] = me[ 5 ] * me[ 0 ] - me[ 1 ] * me[ 4 ];

		var det = me[ 0 ] * te[ 0 ] + me[ 1 ] * te[ 3 ] + me[ 2 ] * te[ 6 ];

		// no inverse

		if(det === 0)
		{

			var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";

			if(throwOnInvertible || false)
			{

				throw new Error(msg);

			}
			else
			{

				console.warn(msg);

			}

			this.identity();

			return this;

		}

		this.multiplyScalar(1.0 / det);

		return this;

	}

	public transpose():Matrix3
	{

		var tmp, m = this.elements;

		tmp = m[ 1 ];
		m[ 1 ] = m[ 3 ];
		m[ 3 ] = tmp;
		tmp = m[ 2 ];
		m[ 2 ] = m[ 6 ];
		m[ 6 ] = tmp;
		tmp = m[ 5 ];
		m[ 5 ] = m[ 7 ];
		m[ 7 ] = tmp;

		return this;

	}

	public flattenToArrayOffset(array, offset)
	{

		var te = this.elements;

		array[ offset     ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];

		array[ offset + 3 ] = te[ 3 ];
		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];

		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];
		array[ offset + 8 ] = te[ 8 ];

		return array;

	}

	public getNormalMatrix(m:m4.Matrix4)
	{

		// input: THREE.Matrix4

		this.getInverse(m).transpose();

		return this;

	}

	public transposeIntoArray(r)
	{

		var m = this.elements;

		r[ 0 ] = m[ 0 ];
		r[ 1 ] = m[ 3 ];
		r[ 2 ] = m[ 6 ];
		r[ 3 ] = m[ 1 ];
		r[ 4 ] = m[ 4 ];
		r[ 5 ] = m[ 7 ];
		r[ 6 ] = m[ 2 ];
		r[ 7 ] = m[ 5 ];
		r[ 8 ] = m[ 8 ];

		return this;

	}

	public fromArray(array:Float32Array):Matrix3
	{

		this.elements.set(array);

		return this;

	}

	public toArray()
	{

		var te = this.elements;

		return [
			te[ 0 ], te[ 1 ], te[ 2 ],
			te[ 3 ], te[ 4 ], te[ 5 ],
			te[ 6 ], te[ 7 ], te[ 8 ]
		];

	}

	public clone():Matrix3
	{
		return new Matrix3().fromArray(this.elements);
	}

}