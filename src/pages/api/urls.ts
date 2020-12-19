import cheerio from 'cheerio';
import axios from 'axios-https-proxy-fix';

let client;

interface Request {
  method: string;
  query: {
    place_id: string;
    search: string;
    key: string;
  };
}

const config = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html',
  },
};

const search_engines = [
  'https://www.google.com/search?hl=en&q=',
  'https://search.yahoo.com/search?p=',
  'https://www.bing.com/search?q=',
  'https://www.bing.com/maps?q=',
];

export default async (req: Request, res) => {
  if (req.query.key === process.env.SECRET_KEY) {
    if (req.method === 'GET') {
      try {
        const url = `${search_engines[1]}${req.query.search}&atb=v177-1&ia=web`;
        const { data } = await axios.get(url, config);
        const $ = cheerio.load(data);

        let url_list: string[] = [];
        const links = $('a');

        $($('a')).each((i, link) => {
          const link_title = $(link).text();
          if (
            link_title.includes('Delivery') ||
            link_title.includes('Order') ||
            link_title.includes('Website')
          ) {
            let website_url: string;
            const href = $(link).attr('href');

            if (
              !href.includes('yelp') &&
              !href.includes('yahoo') &&
              !href.includes('bing') &&
              !href.includes('mapquest') &&
              href.includes('http')
            ) {
              if (href.startsWith('http')) {
                website_url = href;
              } else {
                website_url = href.substr(
                  7,
                  $(link).attr('href').indexOf('&sa') - 7
                );
              }

              url_list = Array.from(new Set([...url_list, website_url]));
            }
          }
        });
        res.status(200).json({ urls: url_list });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error when retrieving data' });
      }
    } else {
      res.status(400).json({ message: 'invalid_request_type' });
    }
  } else {
    res.status(401).json({ message: 'invalid_key' });
  }
};

const findURLsDocument = async (place_id: string) => {
  let urls: string[] = [];
  const query = { place_id: place_id };
  const collection = client.db('restaurants').collection('urls');

  const data = await collection.findOne(query);
  if (data !== null) {
    urls = data.urls;
  }

  return urls;
};

const insertURLsDocument = async (place_id: string, url_list: string[]) => {
  const collection = client.db('restaurants').collection('urls');

  const document = { place_id: place_id, urls: url_list };
  const result = await collection.insert(document);
};
