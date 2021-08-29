import axios from 'axios';

interface Request {
  method: string;
  query: {
    input: string;
    key: string;
  };
}

export default async (req: Request, res) => {
  if (req.query.key === process.env.SECRET_KEY) {
    if (req.method === 'GET') {
      try {
        const { data } = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?${req.query.input}`
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
