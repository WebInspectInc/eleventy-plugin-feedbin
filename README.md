# The Absolutely Unofficial 11ty Plugin for Using the Excellent Feedbin API

> Inspired by [Uncle Dave Rupert](https://twitter.com/davatron5000/status/1228497094308179968) (thanks!)

This is a plug-and-play example of how to use the Feedbin API to build a _static_ list of your favorite RSS articles on your 11ty-powered website. A few features:

* This is a _static_ list, so even if the Feedbin API goes down or is removed, your page will still work.
* This implementation is very gentle on the Feedbin API. It only requests articles once: once the article is saved in your repo, there's no need to ask for it again, so we don't.
* Not only does this store links to your favorite articles, but it also stores the article itself. This way if you end up with broken links someday, you can fall back on your own cached content (with attribution, of course!)
* You _own your own content_. Once these favorites are stored in your codebase, you'll have them forever, even if Feedbin goes belly up. Hopefully that won't happen, but if it does, you'll be prepared.

You can see an example of this code at work on my own [likes page](https://timothymiller.dev/likes/).

---

## Requirements

For this plugin to work you need an [11ty](https://www.11ty.dev/)-powered site and a [Feedbin](https://feedbin.com/) account.

## Getting Started

This is as close to plug-and-play as I could figure out how to make using 11ty. You shouldn't have to do much to get this working on your site. Here are the basic steps:

### 1. Install dependencies

Copy the `devDependencies` from [`package.json`](package.json) into _your_ `package.json`, and run `npm install`. Or, you can run this command:

```
npm install --save-dev @11ty/eleventy node-fetch dotenv
```

### 2. Copy/create .env file

Rename the [`sample.env`](sample.env) file to `.env`, place in your project, and add your Feedbin credentials. It should look like this:

```
FEEDLY_AUTH="youremail@email.com:FeedbinPassword"
```

### 3. Copy the data file

Copy [`_data/favorites.js`](_data/favorites.js) into your `_data` folder (create the folder if it doesn't exist).

### 4. Create your view

There's an example of how to use the data in the [`index.njk`](index.njk) file. Basically, all information give by the [Feedbin Entries API](https://github.com/feedbin/feedbin-api/blob/master/content/entries.md) is available to you in the `favorites.children` array. Pretty sweet!

### 5. Build your site!

The data will only be retrieved on building for production, so you can run `NODE_ENV=production npx eleventy` to build your data store. If `NODE_ENV` doesn't equal production, 11ty will used whatever data you have cached.

### 6. Profit...?

That's pretty much it! Here is an example of the data created (stored in [`_cache/favorites.example.json`](_cache/favorites.example.json)):

```
  "children": [
    {
      "id": 2065741235,
      "feed_id": 1256917,
      "title": "3D Glasses with Perspective Origin",
      "author": null,
      "summary": "This is the fifth article in a series discussing different optical illusions & mechanical toys and how we can recreate them on the web (and learn from them). Unlike the other articles in this series, the full effects require a physical item — specifically",
      "content": "article content...",
      "url": "https://danielcwilson.com/blog/2019/04/optical-fun-3d-glasses/",
      "extracted_content_url": "https://extract.feedbin.com/parser/feedbin/a645d4f7e223a34360cdbd9441ad69560625f0a5?base64_url=aHR0cHM6Ly9kYW5pZWxjd2lsc29uLmNvbS9ibG9nLzIwMTkvMDQvb3B0aWNhbC1mdW4tM2QtZ2xhc3Nlcy8=",
      "published": "2019-04-15T12:30:30.000000Z",
      "created_at": "2019-04-15T12:47:36.934714Z"
    }
  ]
```

Once you have your data store created, then you can use any of this data inside any template in your project. You can see an example implementation in the [`index.njk`](index.njk) file.

---

## More to come!

I'm amazed at how easy this was to set up with 11ty. I'm definitely going to experiment with more features of the Feedbin API, and undoubtedly some of that experimentation will trickle into this repo. Stay in touch!

One feature that definitely will come at some point: I want to automatically check to make sure there are no broken links. If there are any broken links, I want to fallback on the content stored in our cache. I suspect this too will be surprisingly easy once I get around to implementing it.