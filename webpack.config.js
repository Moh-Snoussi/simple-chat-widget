module.exports = {
	mode        : "development",
	devtool     : "inline-source-map",
	experiments : {
		outputModule: true
	},
	watchOptions: {
		poll   : 1000, // Check for changes every second
		ignored: [
			"node_modules"
		]
	},
	entry       : "./src/ChatWidget.ts",
	output      : {
		library: {
			type: "module"
		}
	},
	resolve     : {
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: [".ts"]
		// Add support for TypeScripts fully qualified ESM imports.
	},
	module      : {
		rules: [
			// all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
			{test: /\.ts$/, loader: "ts-loader"},
			{
				test  : /\.html$/i,
				loader: "html-loader"
			}
		]

	}
};
