import {Vector3} from "./Vector3";
import {MathUtil} from "./MathUtil";
import {Euler} from "./Euler";
import {Quaternion} from "./Quaternion";
import {Matrix3} from "./Matrix3";
import {Matrix4} from "./Matrix4";
import {UID} from "../util/UID";
/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author elephantatwork / www.elephantatwork.ch
 */

export class Object3D
{

	public static DefaultUp:Vector3 = new Vector3(0, 1, 0);
	public static DefaultMatrixAutoUpdate:boolean = true;
	private static Object3DIdCount:number = 0;

	public id:number = Object3D.Object3DIdCount++;
	public name = '';
	public type = 'Object3D';

	public parent = null;
	public channels = new Channels();
	public children = [];

	public up = Object3D.DefaultUp.clone();
	public position:Vector3;
	public rotation:Euler;
	public quaternion:Quaternion;
	public scale:Vector3;

	public uuid = UID.get();
	public rotationAutoUpdate = true;

	public matrix = new Matrix4();
	public matrixWorld = new Matrix4();

	public matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate;
	public matrixWorldNeedsUpdate = false;

	public visible = true;

	public castShadow = false;
	public receiveShadow = false;

	public frustumCulled = true;
	public renderOrder = 0;

	public userData = {};

	constructor()
	{

		//


		var position = new Vector3();
		var rotation = new Euler();
		var quaternion = new Quaternion();
		var scale = new Vector3(1, 1, 1);


		function onRotationChange()
		{

			quaternion.setFromEuler(rotation, false);

		}

		function onQuaternionChange()
		{

			rotation.setFromQuaternion(quaternion, undefined, false);

		}

		rotation.onChange(onRotationChange);
		quaternion.onChange(onQuaternionChange);

		Object.defineProperties(this, {
			position: {
				enumerable: true,
				value: position
			},
			rotation: {
				enumerable: true,
				value: rotation
			},
			quaternion: {
				enumerable: true,
				value: quaternion
			},
			scale: {
				enumerable: true,
				value: scale
			},
			modelViewMatrix: {
				value: new Matrix4()
			},
			normalMatrix: {
				value: new Matrix3()
			}
		});
	}

	public applyMatrix(matrix:Matrix4)
	{

		this.matrix.multiplyMatrices(matrix, this.matrix);

		this.matrix.decompose(this.position, this.quaternion, this.scale);

	}

	public setRotationFromAxisAngle(axis, angle)
	{

		// assumes axis is normalized

		this.quaternion.setFromAxisAngle(axis, angle);

	}

	public setRotationFromEuler(euler:Euler)
	{

		this.quaternion.setFromEuler(euler, true);

	}

	public setRotationFromMatrix(m)
	{

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		this.quaternion.setFromRotationMatrix(m);

	}

	public setRotationFromQuaternion(q)
	{

		// assumes q is normalized

		this.quaternion.copy(q);

	}

	public rotateOnAxis = function()
	{

		// rotate object on axis in object space
		// axis is assumed to be normalized

		var q1 = new Quaternion();

		return function(axis, angle)
		{

			q1.setFromAxisAngle(axis, angle);

			this.quaternion.multiply(q1);

			return this;

		};

	}()

	public rotateX = function()
	{

		var v1 = new Vector3(1, 0, 0);

		return function(angle)
		{

			return this.rotateOnAxis(v1, angle);

		};

	}()

	public rotateY = function()
	{

		var v1 = new Vector3(0, 1, 0);

		return function(angle)
		{

			return this.rotateOnAxis(v1, angle);

		};

	}()

	public rotateZ = function()
	{

		var v1 = new Vector3(0, 0, 1);

		return function(angle)
		{

			return this.rotateOnAxis(v1, angle);

		};

	}()

	public translateOnAxis = function()
	{

		// translate object by distance along axis in object space
		// axis is assumed to be normalized

		var v1 = new Vector3();

		return function(axis, distance)
		{

			v1.copy(axis).applyQuaternion(this.quaternion);

			this.position.add(v1.multiplyScalar(distance));

			return this;

		};

	}()

	public translate(distance, axis)
	{

		console.warn('Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead.');
		return this.translateOnAxis(axis, distance);

	}

	public translateX = function()
	{

		var v1 = new Vector3(1, 0, 0);

		return function(distance)
		{

			return this.translateOnAxis(v1, distance);

		};

	}()

	public translateY = function()
	{

		var v1 = new Vector3(0, 1, 0);

		return function(distance)
		{

			return this.translateOnAxis(v1, distance);

		};

	}()

	public translateZ = function()
	{

		var v1 = new Vector3(0, 0, 1);

		return function(distance)
		{

			return this.translateOnAxis(v1, distance);

		};

	}()

	public localToWorld(vector)
	{

		return vector.applyMatrix4(this.matrixWorld);

	}

	public worldToLocal = function()
	{

		var m1 = new Matrix4();

		return function(vector)
		{

			return vector.applyMatrix4(m1.getInverse(this.matrixWorld));

		};

	}()

	public lookAt = function()
	{

		// This routine does not support objects with rotated and/or translated parent(s)

		var m1 = new Matrix4();

		return function(vector)
		{

			m1.lookAt(vector, this.position, this.up);

			this.quaternion.setFromRotationMatrix(m1);

		};

	}()

	public add(object)
	{

		if(arguments.length > 1)
		{

			for(var i = 0; i < arguments.length; i++)
			{

				this.add(arguments[i]);

			}

			return this;

		}

		if(object === this)
		{

			console.error("Object3D.add: object can't be added as a child of itself.", object);
			return this;

		}

		if(object instanceof Object3D)
		{

			if(object.parent !== null)
			{

				object.parent.remove(object);

			}

			object.parent = this;
			object.dispatchEvent({type: 'added'});

			this.children.push(object);

		}
		else
		{

			console.error("Object3D.add: object not an instance of Object3D.", object);

		}

		return this;

	}

	public remove(object)
	{

		if(arguments.length > 1)
		{

			for(var i = 0; i < arguments.length; i++)
			{

				this.remove(arguments[i]);

			}

		}

		var index = this.children.indexOf(object);

		if(index !== -1)
		{

			object.parent = null;

			object.dispatchEvent({type: 'removed'});

			this.children.splice(index, 1);

		}

	}

	public getChildByName(name)
	{

		console.warn('Object3D: .getChildByName() has been renamed to .getObjectByName().');
		return this.getObjectByName(name);

	}

	public getObjectById(id)
	{

		return this.getObjectByProperty('id', id);

	}

	public getObjectByName(name)
	{

		return this.getObjectByProperty('name', name);

	}

	public getObjectByProperty(name, value)
	{

		if(this[name] === value)
		{
			return this;
		}

		for(var i = 0, l = this.children.length; i < l; i++)
		{

			var child = this.children[i];
			var object = child.getObjectByProperty(name, value);

			if(object !== undefined)
			{

				return object;

			}

		}

		return undefined;

	}

	public getWorldPosition(optionalTarget)
	{

		var result = optionalTarget || new Vector3();

		this.updateMatrixWorld(true);

		return result.setFromMatrixPosition(this.matrixWorld);

	}

	public getWorldQuaternion = function()
	{

		var position = new Vector3();
		var scale = new Vector3();

		return function(optionalTarget)
		{

			var result = optionalTarget || new Quaternion();

			this.updateMatrixWorld(true);

			this.matrixWorld.decompose(position, result, scale);

			return result;

		};

	}()

	public getWorldRotation = function()
	{

		var quaternion = new Quaternion();

		return function(optionalTarget)
		{

			var result = optionalTarget || new Euler();

			this.getWorldQuaternion(quaternion);

			return result.setFromQuaternion(quaternion, this.rotation.order, false);

		};

	}()

	public getWorldScale = function()
	{

		var position = new Vector3();
		var quaternion = new Quaternion();

		return function(optionalTarget)
		{

			var result = optionalTarget || new Vector3();

			this.updateMatrixWorld(true);

			this.matrixWorld.decompose(position, quaternion, result);

			return result;

		};

	}()

	public getWorldDirection = function()
	{

		var quaternion = new Quaternion();

		return function(optionalTarget)
		{

			var result = optionalTarget || new Vector3();

			this.getWorldQuaternion(quaternion);

			return result.set(0, 0, 1).applyQuaternion(quaternion);

		};

	}()

	public raycast()
	{
	}

	public traverse(callback)
	{

		callback(this);

		var children = this.children;

		for(var i = 0, l = children.length; i < l; i++)
		{

			children[i].traverse(callback);

		}

	}

	public traverseVisible(callback)
	{

		if(this.visible === false)
		{
			return;
		}

		callback(this);

		var children = this.children;

		for(var i = 0, l = children.length; i < l; i++)
		{

			children[i].traverseVisible(callback);

		}

	}

	public traverseAncestors(callback)
	{

		var parent = this.parent;

		if(parent !== null)
		{

			callback(parent);

			parent.traverseAncestors(callback);

		}

	}

	public updateMatrix()
	{

		this.matrix.compose(this.position, this.quaternion, this.scale);

		this.matrixWorldNeedsUpdate = true;

	}

	public updateMatrixWorld(force)
	{

		if(this.matrixAutoUpdate === true)
		{
			this.updateMatrix();
		}

		if(this.matrixWorldNeedsUpdate === true || force === true)
		{

			if(this.parent === null)
			{

				this.matrixWorld.copy(this.matrix);

			}
			else
			{

				this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);

			}

			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		for(var i = 0, l = this.children.length; i < l; i++)
		{

			this.children[i].updateMatrixWorld(force);

		}

	}

	public toJSON(meta)
	{

		var isRootObject = ( meta === undefined );

		var output:any = {};

		// meta is a hash used to collect geometries, materials.
		// not providing it implies that this is the root object
		// being serialized.
		if(isRootObject)
		{

			// initialize meta obj
			meta = {
				geometries: {},
				materials: {},
				textures: {},
				images: {}
			};

			output.metadata = {
				version: 4.4,
				type: 'Object',
				generator: 'Object3D.toJSON'
			};

		}

		// standard Object3D serialization

		var object:any = {};

		object.uuid = this.uuid;
		object.type = this.type;

		if(this.name !== '')
		{
			object.name = this.name;
		}
		if(JSON.stringify(this.userData) !== '{}')
		{
			object.userData = this.userData;
		}
		if(this.castShadow === true)
		{
			object.castShadow = true;
		}
		if(this.receiveShadow === true)
		{
			object.receiveShadow = true;
		}
		if(this.visible === false)
		{
			object.visible = false;
		}

		object.matrix = this.matrix.toArray();

		//

		if(this['geometry'] !== undefined)
		{

			if(meta.geometries[this['geometry'].uuid] === undefined)
			{

				meta.geometries[this['geometry'].uuid] = this['geometry'].toJSON(meta);

			}

			object.geometry = this['geometry'].uuid;

		}

		if(this['material'] !== undefined)
		{

			if(meta.materials[this['material'].uuid] === undefined)
			{

				meta.materials[this['material'].uuid] = this['material'].toJSON(meta);

			}

			object.material = this['material'].uuid;

		}

		//

		if(this.children.length > 0)
		{

			object.children = [];

			for(var i = 0; i < this.children.length; i++)
			{

				object.children.push(this.children[i].toJSON(meta).object);

			}

		}

		if(isRootObject)
		{

			var geometries = extractFromCache(meta.geometries);
			var materials = extractFromCache(meta.materials);
			var textures = extractFromCache(meta.textures);
			var images = extractFromCache(meta.images);

			if(geometries.length > 0)
			{
				output.geometries = geometries;
			}
			if(materials.length > 0)
			{
				output.materials = materials;
			}
			if(textures.length > 0)
			{
				output.textures = textures;
			}
			if(images.length > 0)
			{
				output.images = images;
			}

		}

		output.object = object;

		return output;

		// extract data from the cache hash
		// remove metadata on each item
		// and return as array
		function extractFromCache(cache)
		{

			var values = [];
			for(var key in cache)
			{

				var data = cache[key];
				delete data.metadata;
				values.push(data);

			}
			return values;

		}

	}

	clone(recursive)
	{
		return new Object3D().copy(this, recursive);
	}

	copy(source, recursive)
	{
		if(recursive === undefined)
		{
			recursive = true;
		}

		this.name = source.name;

		this.up.copy(source.up);

		this.position.copy(source.position);
		this.quaternion.copy(source.quaternion);
		this.scale.copy(source.scale);

		this.rotationAutoUpdate = source.rotationAutoUpdate;

		this.matrix.copy(source.matrix);
		this.matrixWorld.copy(source.matrixWorld);

		this.matrixAutoUpdate = source.matrixAutoUpdate;
		this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

		this.visible = source.visible;

		this.castShadow = source.castShadow;
		this.receiveShadow = source.receiveShadow;

		this.frustumCulled = source.frustumCulled;
		this.renderOrder = source.renderOrder;

		this.userData = JSON.parse(JSON.stringify(source.userData));

		if(recursive === true)
		{

			for(var i = 0; i < source.children.length; i++)
			{

				var child = source.children[i];
				this.add(child.clone());

			}

		}

		return this;

	}
}

export class Channels
{
	public mask:number = 1;

	set(channel:number):void
	{
		this.mask = 1 << channel;
	}

	enable(channel:number):void
	{
		this.mask |= 1 << channel;
	}

	toggle(channel:number):void
	{
		this.mask ^= 1 << channel;
	}

	disable(channel:number):void
	{
		this.mask &= ~( 1 << channel );
	}
}