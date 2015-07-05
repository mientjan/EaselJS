import q = require('../Quaternion');
import v3 = require('../Vector3');
import m4 = require('../Matrix4');


export class AbstractMath3d
{
	private _quaternion:{[index:string]:q.Quaternion} = {};
	private _vector3:{[index:string]:v3.Vector3} = {};
	private _matrix4:{[index:string]:m4.Matrix4} = {};

	protected getQuaternion(value:string):q.Quaternion
	{
		if(!this._quaternion[value])
		{
			this._quaternion[value] = new q.Quaternion();
		}
		return this._quaternion[value];
	}

	protected getVector3(value:string):v3.Vector3
	{
		if(!this._vector3[value])
		{
			this._vector3[value] = new v3.Vector3();
		}
		return this._vector3[value];
	}

	protected getMatrix4(value:string):m4.Matrix4
	{
		if(!this._matrix4[value])
		{
			this._matrix4[value] = new m4.Matrix4();
		}
		return this._matrix4[value];
	}
}