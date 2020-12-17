const cheerio = require('cheerio');
const axios = require('axios').default;

export default async (req, res) => {
  if (req.method === 'GET') {
    const url = `https://www.google.com/search?hl=en&q=${req.query.search}`;

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let urlList = [];
    const links = $('a');
    $($('a')).each((i, link) => {
      const linkTitle = $(link).text();
      if (linkTitle.includes('Delivery') || linkTitle.includes('Order')) {
        let websiteURL: string;
        const href = $(link).attr('href');
        if (href.startsWith('http')) {
          websiteURL = href;
        } else {
          websiteURL = href.substr(7, $(link).attr('href').indexOf('&sa') - 7);
        }
        urlList = Array.from(new Set([...urlList, websiteURL]));
      }
    });

    res.status(200).json({ urls: urlList });
  } else {
    res.sendStatus(400);
  }
};
