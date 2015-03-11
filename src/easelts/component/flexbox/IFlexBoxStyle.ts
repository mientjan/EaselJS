/**
 * Created by pieters on 11-Mar-15.
 */

interface IFlexBoxStyle
{
	width?:number;
	height?:number;

	left?:number;
	right?:number;
	top?:number;
	bottom?:number;

	margin?:number;
	marginLeft?:number;
	marginRight?:number;
	marginTop?:number;
	marginBottom?:number;

	padding?:number;
	paddingLeft?:number;
	paddingRight?:number;
	paddingTop?:number;
	paddingBottom?:number;

	borderWidth?:number;
	borderLeftWidth?:number;
	borderRightWidth?:number;
	borderTopWidth?:number;
	borderBottomWidth?:number;

	flexDirection?:string;

	justifyContent?:string;

	alignItems?:string;
	alignSelf?:string;

	flex?:number;

	flexWrap?:string;

	position?:string;
}

export = IFlexBoxStyle;