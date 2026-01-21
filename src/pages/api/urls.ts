import * as cheerio from 'cheerio';
import axios from 'axios-https-proxy-fix';

const config = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html',
    Referer: 'https://search.yahoo.com/search',
  },
  timeout: 10000, // 10 second timeout
};

const search_engines = [
  'https://www.google.com/search?hl=en&q=',
  'https://search.yahoo.com/search?p=',
  'https://www.bing.com/maps?q=',
];

// Get all delivery urls of restaurant
export default async (req, res) => {
  if (req.query.key === process.env.SECRET_KEY) {
    if (req.method === 'GET') {
      try {
        const url = encodeURI(`${search_engines[1]}${req.query.search}`);
        const { data } = await axios.get(url, config);
        const $ = cheerio.load(data);

        let url_list: string[] = [];

        const hrefs = getPossibleDeliveryHrefs($);
        // Check every link/url for if its a valid delivery link/url
        for (let href of hrefs) {
          // Get redirect url as it may be possible delivery app url
          if (href.includes('redirect')) {
            href = await getRedirectUrl(href);
          }

          // Get possible button url
          if (href.includes('locations')) {
            href = await getButtonUrl(href);
          }

          // Check if url is a delivery app url or not
          const all_apps = ['doordash', 'grubhub', 'ubereats', 'postmates', 'caviar', 'seamless', 'delivery.com'];
          if (!all_apps.some(app => href.includes(app))) {
            // Add non-delivery app url
            url_list = addToURLList(href, url_list);
          } else if (req.query['allowed_apps[]']) {
            let allowed_apps = req.query['allowed_apps[]'];
            typeof allowed_apps === 'string' ? (allowed_apps = [allowed_apps]) : null;

            if (allowed_apps.some(app => href.includes(app))) {
              // Add delivery app url
              url_list = addToURLList(href, url_list);
            }
          }
        }
        res.status(200).json({ urls: url_list });
      } catch (e) {
        console.log(`Failed to search restaurant: ${e}`);
        res.status(500).json({ message: 'Error when retrieving data' });
      }
    } else {
      res.status(400).json({ message: 'invalid_request' });
    }
  } else {
    res.status(401).json({ message: 'invalid_key' });
  }
};

const getPossibleDeliveryHrefs = $ => {
  let hrefs: string[] = [];

  $($('a')).each((i, link) => {
    const link_title = $(link).text();
    if (
      (link_title.includes('Delivery') || link_title.includes('Order') || link_title.includes('Website')) &&
      $(link).attr('href')
    ) {
      let href = $(link).attr('href');

      if (
        href.includes('http') &&
        !href.includes('yelp') &&
        !href.includes('yahoo') &&
        !href.includes('bing') &&
        !href.includes('mapquest')
      ) {
        if (href.includes('continue=')) {
          href = decodeURIComponent(href.substr(href.indexOf('continue=') + 9));
        }

        hrefs = [...hrefs, href];
      }
    }
  });

  return hrefs;
};

const addToURLList = (href, url_list) => {
  let website_url: string;

  if (href.startsWith('http')) {
    website_url = href;
  } else {
    website_url = href.substr(7, href.indexOf('&sa') - 7);
  }
  return Array.from(new Set([...url_list, website_url]));
};

const getRedirectUrl = async (href: string) => {
  let url = href;

  try {
    const response = await axios.get(href, config);
    if (response?.request?.res?.responseUrl) {
      url = response.request.res.responseUrl;
    }
  } catch (e) {
    console.log(`Failed to get redirect url: ${e}`);
  }

  return url;
};

const getPossibleButtonUrls = async (url: string) => {
  let hrefs = [];

  try {
    const { data } = await axios.get(url, config);
    const $ = cheerio.load(data);
    const links = $('a');

    // Check every link/url if it leads to another delivery link/url
    $(links).each((i, link) => {
      const link_title = $(link).text().toLowerCase();
      if (
        (link_title === 'order delivery' || link_title === 'order online' || link_title === 'order now') &&
        $(link).attr('href') &&
        $(link).attr('href').includes('http')
      ) {
        const href = $(link).attr('href');
        hrefs = [...hrefs, href];
      }
    });
  } catch (e) {
    console.log(url);
    console.log(`Failed to get button url: ${e}`);
  }

  return hrefs;
};

const getButtonUrl = async (url: string) => {
  const hrefs = await getPossibleButtonUrls(url);
  if (hrefs.length) {
    url = hrefs[0];
  }

  return url;
};
