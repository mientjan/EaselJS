import {Matrix4} from "../Matrix4";
import {Quaternion} from "../Quaternion";
import {Vector3} from "../Vector3";

/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author WestLangley / http://github.com/WestLangley
 */

class Camera
{
	public matrixWorldInverse:Matrix4;
	public projectionMatrix:Matrix4;

	constructor()
	{

		this.matrixWorldInverse = new Matrix4();
		this.projectionMatrix = new Matrix4();

	}


	public getWorldDirection = (function()
	{
		var quaternion = new Quaternion();

		return function(optionalTarget)
		{

			var result = optionalTarget || new Vector3();

			this.getWorldQuaternion(quaternion);

			return result.set(0, 0, -1).applyQuaternion(quaternion);
		};

	})();

	public lookAt = (function()
	{
		// This routine does not support cameras with rotated and/or translated parent(s)
		var m1 = new Matrix4();
		return function(vector)
		{
			m1.lookAt(this.position, vector, this.up);
			this.quaternion.setFromRotationMatrix(m1);
		}
	})();

	public copy(source:Camera)
	{

		//THREE.Object3D.prototype.copy.call( this, source );

		this.matrixWorldInverse.copy(source.matrixWorldInverse);
		this.projectionMatrix.copy(source.projectionMatrix);

		return this;

	}
}
//
//THREE.Camera.prototype = Object.create( THREE.Object3D.prototype );
//THREE.Camera.prototype.constructor = THREE.Camera;
export default Camera;