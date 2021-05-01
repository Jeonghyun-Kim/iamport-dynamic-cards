import { NextApiRequest, NextApiResponse } from 'next';

const imp_key = process.env.IAMPORT_API_KEY;
const imp_secret = process.env.IAMPORT_API_SECRET;

if (!imp_key || !imp_secret) throw new Error('Missing iamport key or secret.');

const handler: (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void> = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { imp_uid, merchant_uid } = req.body;

      const {
        response: { access_token },
      } = await fetch(`https://api.iamport.kr/users/getToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imp_key, imp_secret }),
      }).then((res) => res.json());

      const { response: paymentData } = await fetch(
        `https://api.iamport.kr/payments/${imp_uid}`,
        {
          method: 'GET',
          headers: {
            Authorization: access_token,
          },
        },
      ).then((res) => res.json());

      return res.json({ merchant_uid, paymentData });
    }

    return res.status(404).end();
  } catch (err) {
    console.error(`ERROR ${req.url} ${req.method}`, err);

    return res.status(500).send(err.message);
  }
};

export default handler;
