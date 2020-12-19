import cheerio from 'cheerio';
import axios from 'axios';

let client;

interface Request {
  method: string;
  query: {
    place_id: string;
    search: string;
  };
}

const config = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html',
  },
};

export default async (req: Request, res) => {
  if (req.method === 'GET') {
    try {
      const url = `https://www.google.com/search?hl=en&q=${req.query.search}`;
      let data;
      data = (await axios.get(url, config)).data;
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

          if (!href.includes('yelp') && href.includes('http')) {
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
    } catch {
      res.status(500).json({ message: 'Error when retrieving data' });
    }
  } else {
    res.status(400).json({ status: 'invalid_request_type' });
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
