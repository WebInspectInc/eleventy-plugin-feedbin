const fs = require('fs')
const fetch = require('node-fetch')
const unionBy = require('lodash/unionBy')

// Load .env variables
require('dotenv').config()

const API = 'https://api.feedbin.com';
const AUTH = process.env.FEEDLY_AUTH;
const ROUTES = {
	stars: '/v2/starred_entries.json',
	entries: '/v2/entries.json'
}
const CACHE_FILE_PATH = '_cache/favorites.json';

/**************************
 * Where the magic happens
\**************************/

module.exports = async function () {
	console.log('>>> Reading from cache...');
	let cache = readFromCache();

	if (cache.children.length) {
		console.log(`>>> ${cache.children.length} favorites loaded from cache`);
	}

	// Only fetch new mentions in production, otherwise we just use the cache
	if (process.env.NODE_ENV === 'production') {
		console.log('>>> Checking for new favorites...');
		const feed = await fetchFavoriteList();
		const newFavorites = checkForNewFavorites(cache.children, feed);
		if (newFavorites.length) {
			const text = await fetchEntries(newFavorites);
			if (text.length) {
				const favorites = {
					lastFetched: new Date().toISOString(),
					children: mergeFavorites(cache.children, text)
				}

				writeToCache(favorites);
				cache = favorites;
				return favorites;
			}
		}
	}

	return cache;
}


/**************************
 * API access with auth
\**************************/
async function fetchFeedbinFeed(name, route) {
	// If we dont have a domain name, token, or route, abort
	if (!API || !AUTH || !route) {
		console.warn(`>>> unable to fetch ${name}: missing domain or auth`);
		return false;
	}

	let url = `${API}${route}`;

	const response = await fetch(url, { headers: { 'Authorization': 'Basic ' + Buffer.from(AUTH).toString('base64') }});
	if (response.status === 200) {
		const feed = await response.json();
		console.log(`>>> ${feed.length} ${name} fetched from ${url}`)
		return feed;
	}

	return null;
}


/************************************\
 * Only two routes implemented so far
\************************************/
function fetchFavoriteList() {
	return fetchFeedbinFeed('favorites', ROUTES.stars);
}

function fetchEntries(favorites) {
	let route = `${ROUTES.entries}?ids=` + favorites.join();
	return fetchFeedbinFeed('entries', route);
}

function checkForNewFavorites(oldFavorites, feed) {
	// compares the recently fetched list to our cached list, discards any entries previously fetched
	var newFavorites = [];
	for (var i = feed.length - 1; i >= 0; i--) {
		var id = feed[i];
		newFavorites.push(id);
		oldFavorites.forEach(oldFav => {
			if (id === oldFav.id) {
				newFavorites.pop();
			}
		});
	}

	if (newFavorites.length) {
		console.log(`>>> ${newFavorites.length} new favorites found`);
	} else {
		console.log(`>>> no new favorites found`);
	}

	return newFavorites;
}

// allows us to merge new entries into our cache, based on ID
function mergeFavorites(a, b) {
	return unionBy(a, b, 'id');
}


/************************************\
 * Caching utilities
\************************************/
function writeToCache(data) {
	const dir = '_cache';
	const fileContent = JSON.stringify(data, null, 2);
	// create cache folder if it doesnt exist already
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	// write data to cache json file
	fs.writeFile(CACHE_FILE_PATH, fileContent, err => {
		if (err) throw err;
		console.log(`>>> favorites cached to ${CACHE_FILE_PATH}`);
	})
}

function readFromCache() {
	if (fs.existsSync(CACHE_FILE_PATH)) {
		const cacheFile = fs.readFileSync(CACHE_FILE_PATH);
		return JSON.parse(cacheFile);
	}

	return {
		lastFetched: null,
		children: []
	}
}