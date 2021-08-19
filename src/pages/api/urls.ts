import cheerio from 'cheerio';
import axios from 'axios-https-proxy-fix';

interface Request {
  method: string;
  query: {
    place_id: string;
    search: string;
    'allowed_apps[]'?: string[];
    key: string;
  };
}

const config = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html',
    'Referer': 'https://search.yahoo.com/search'
  },
};

const search_engines = [
  'https://www.google.com/search?hl=en&q=',
  'https://search.yahoo.com/search?p=',
  'https://www.bing.com/maps?q=',
];

// Get all delivery urls of restaurant
export default async (req: Request, res) => {
  if (req.query.key === process.env.SECRET_KEY) {
    if (req.method === 'GET') {
      try {
        const url = encodeURI(`${search_engines[1]}${req.query.search}`);
        const { data } = await axios.get(url, config);
        const $ = cheerio.load(data);

        let url_list: string[] = [];
        const links = $('a');

        // Check every link/url for if its a delivery link/url
        $($('a')).each(async (i, link) => {
          const link_title = $(link).text();
          if (
            link_title.includes('Delivery') ||
            link_title.includes('Order') ||
            link_title.includes('Website')
          ) {
            let href = $(link).attr('href');

            if (
              href.includes('http') &&
              !href.includes('yelp') &&
              !href.includes('yahoo') &&
              !href.includes('bing') &&
              !href.includes('mapquest')
            ) {
              // Get redirect url as it may be possible delivery app url
              if (href.includes('redirect')) {
                try {
                  href = await getRedirectUrl(href);
                } catch ({ response }) {
                  console.log(`Failed to get redirect url: ${response.statusText}`)
                }
              }

              const all_apps = ['doordash', 'grubhub', 'ubereats', 'postmates', 'caviar', 'seamless', 'delivery.com'];
              if (!all_apps.some(app => href.includes(app))) {
                // Add non-delivery app link
                url_list = addToURLList($, link, href, url_list);
              } else if (req.query['allowed_apps[]']) {
                let allowed_apps = req.query['allowed_apps[]'];
                (typeof allowed_apps === 'string') ? allowed_apps = [allowed_apps] : null;

                if (allowed_apps.some(app => href.includes(app))) {
                  // Add delivery app link
                  url_list = addToURLList($, link, href, url_list);
                }
              }
            }
          }
        });
        res.status(200).json({ urls: url_list });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error when retrieving data' });
      }
    } else {
      res.status(400).json({ message: 'invalid_request' });
    }
  } else {
    res.status(401).json({ message: 'invalid_key' });
  }
};

const addToURLList = ($, link, href, url_list: string[]): string[] => {
  let website_url: string;

  if (href.startsWith('http')) {
    website_url = href;
  } else {
    website_url = href.substr(
      7,
      $(link).attr('href').indexOf('&sa') - 7
    );
  }
  return url_list = Array.from(new Set([...url_list, website_url]));
}

const getRedirectUrl = async (href: string) => {
  const response = await axios.get(href, config);
  const url = response.request.res.responseUrl;
  return url;
}
