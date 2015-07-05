interface IShaderMaterialOptions {
	uniforms: {
		[name: string]: {type: string; value: any;}
	};

	attributes: {
		[name: string]: {type: string; value: any;}
	};
	vertexShader: string;
	fragmentShader: string;
}

export = IShaderMaterialOptions;