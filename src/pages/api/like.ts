import { NextApiRequest, NextApiResponse } from 'next';
import { query as q } from 'faunadb';
import { fauna } from '../../services/fauna';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { postId } = req.body;

    try {
      fauna.query(
        q.Create(q.Collection('like'), { data: { countLikes: 1, postId } })
      );

      return res.json({ ok: 'success' });
    } catch (err) {
      return res.status(400).json({ message: 'error at insert' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).send('Method not allowed');
  }
};
