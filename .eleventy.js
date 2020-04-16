const feedbin = require("./feedbin");
const URL = require('url');

module.exports = function(eleventyConfig) {
	eleventyConfig.addFilter('cleanURL', (url) => {
    	return new URL(url).hostname.replace("www.", "");
  	});

	eleventyConfig.addNunjucksAsyncShortcode("favorites", async() => {
		await feedbin.getAllFavorites()
		return '';
	});
};
