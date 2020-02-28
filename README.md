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

## 1. Installation

Available on npm. Install by running this command in your terminal:

```
npm install --save eleventy-plugin-feedbin
```

Open your Eleventy config file (probably `.eleventy.js`) and use `addPlugin` to enable:

```
const pluginFeedbin = require("eleventy-plugin-feedbin");
module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginFeedbin);
}
```

In addition, you'll need to call the `favorites` shortcode from a view in order to generate the data. That looks like this:

```
{% favorites %}
```

Just include this before you use the data, and it will kick off the processes required to create and maintain the data.

### 2. Copy/create .env file

Create a file in you project named `.env`, and add your Feedbin credentials. It should look like this:

```
FEEDLY_AUTH="youremail@email.com:FeedbinPassword"
```


### 3. Build your site!

The data will only be retrieved on building for production, so you can run `NODE_ENV=production npx eleventy` to build your data store. If `NODE_ENV` doesn't equal production, 11ty will use whatever data you have cached.

Your favorites are stored in your [global data](https://www.11ty.dev/docs/data-global/). You can look at the data there, and you can access the data using `feedbin.favorites`. For an example view, see [sample/index.njk](sample/index.njk).

### 4. Profit...?

That's pretty much it! Here is an example of the data created:

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

Once you have your data store created, then you can use any of this data inside any template in your project. You can see an example implementation in the [`sample/index.njk`](sample/index.njk) file.

## Troubleshooting:

If you get an error that says `_data/feedbin.json` cannot be parsed, it might have to do with nunjucks data processing. If you run into this issue, try returning `dataTemplateEngine: false` in your 11ty config.

---

## More to come!

I'm amazed at how easy this was to set up with 11ty. I'm definitely going to experiment with more features of the Feedbin API, and undoubtedly some of that experimentation will trickle into this plugin. Stay in touch!

One feature that definitely will come at some point: I want to automatically check to make sure there are no broken links. If there are any broken links, I want to fallback on the content stored in our cache.