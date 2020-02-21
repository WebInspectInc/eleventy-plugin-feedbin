const feedbin = require("./feedbin");

module.exports = function(eleventyConfig) {
	eleventyConfig.addFilter('cleanURL', (url) => {
		return new URL(url).hostname.replace("www.", "");
	});
};
