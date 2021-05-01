import { NextApiRequest, NextApiResponse } from 'next';

const imp_key = process.env.IAMPORT_API_KEY;
const imp_secret = process.env.IAMPORT_API_SECRET;

if (!imp_key || !imp_secret) throw new Error('Missing iamport key or secret.');

const handler: (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void> = async (req, res) => {
  try {
    if (req.method === 'GET') {
      return res.send('ok');
    }

    return res.status(404).end();
  } catch (err) {
    console.error(`ERROR ${req.url} ${req.method}`, err);

    return res.status(500).send(err.message);
  }
};

export default handler;
