import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

interface SearchQuery {
  input: string;
  key: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { key, input } = req.query;

  if (key === process.env.SECRET_KEY) {
    if (req.method === 'GET') {
      try {
        const { data } = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?${input}`
        );
        res.status(200).json({ result: data });
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
