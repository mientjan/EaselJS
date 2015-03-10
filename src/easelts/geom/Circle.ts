/**
 * Created by pieters on 10-Mar-15.
 */

class Circle
{
	public x:number;
	public y:number;
	public radius:number;


	constructor(x, y, radius)
	{
		this.x = x;
		this.y = y;
		this.radius = radius;
	}

	public setProperies(x:number, y:number, radius:number):Circle
	{
		this.x = x;
		this.y = y;
		this.radius = radius;

		return this;
	}

	/**
	 * Copies all properties from the specified circle to this circle.
	 * @method copy
	 * @param {Circle} circle The circle to copy properties from.
	 * @return {Circle} This circle. Useful for chaining method calls.
	 */
	public copy(circle:Circle):Circle
	{
		return this.setProperies(circle.x, circle.y, circle.radius);
	}

	/**
	 * Determines whether the specified point is contained within the circular region defined by this Circle object.
	 * @method contains
	 * @param {number} x The x coordinate (horizontal position) of the point.
	 * @param {number} y The y coordinate (vertical position) of the point.
	 * @return {boolean} A value of true if the Circle object contains the specified point; otherwise false.
	 */
	public contains(x:number, y:number):boolean
	{
		x -= this.x;
		y -= this.y;

		return (x * x + y * y < this.radius * this.radius);
	}

	/**
	 * Returns a clone of the Circle instance.
	 * @method clone
	 * @return {Circle} a clone of the Circle instance.
	 **/
	public clone():Circle
	{
		return new Circle(this.x, this.y, this.radius);
	}

	/**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
	public toString():string
	{
		return "[Circle (x=" + this.x + " y=" + this.y + " radius=" + this.radius + ")]";
	}
}

export = Circle;