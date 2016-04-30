export class NumberUtil
{
	public static pair(x:number, y:number)
	{
		var value = x << 16 & 0xffff0000 | y & 0x0000ffff;

		if(Number.MAX_VALUE < value)
		{
			throw 'pair created greater than allowed max uint value';
		}

		return value;
	}

	public static depair(p:number):number[]
	{
		return [p >> 16 & 0xFFFF, p & 0xFFFF]
	}
}

