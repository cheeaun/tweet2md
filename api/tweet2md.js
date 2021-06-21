const https = require('https');
const TurndownService = require('turndown');
const turndownService = new TurndownService();
const marked = require('marked');

module.exports = async (req, res) => {
  const { url } = req.query;

  https.get(
    `https://publish.twitter.com/oembed?url=${encodeURIComponent(
      url
    )}&buttonType=HashtagButton&partner=&hide_thread=false`,
    (response) => {
      let body = '';
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        const data = JSON.parse(body);
        const rawHTML = data.html
          .replace(/\?ref_src=[^\\"<>=]+/gi, '')
          .replace(/\?src=hash&amp;ref_src=[^\\"<>=()]+/gi, '');
        const markdown = turndownService.turndown(rawHTML);
        const html = marked(markdown);
        res.json({
          url,
          rawHTML,
          markdown,
          html,
        });
      });
    }
  );
};
