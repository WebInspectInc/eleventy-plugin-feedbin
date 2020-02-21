
module.exports = function(eleventyConfig) {
	eleventyConfig.addFilter('cleanURL', (url) => {
		return new URL(url).hostname.replace("www.", "");
	});

	return {
		templateFormats: [
			"njk"
		],
		pathPrefix: "/"
	};
};
