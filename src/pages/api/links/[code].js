import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { code } = req.query;

  if (req.method === 'GET') {
    // Fetch the link
    const result = await pool.query('SELECT * FROM links WHERE code = $1', [code]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    // Update click count + last clicked timestamp
    await pool.query(
      `UPDATE links 
       SET click_count = click_count + 1, last_clicked = NOW() 
       WHERE code = $1`,
      [code]
    );

    // Return the full updated row
    const updated = await pool.query('SELECT * FROM links WHERE code = $1', [code]);

    return res.status(200).json(updated.rows[0]);
  }

  if (req.method === 'DELETE') {
    const del = await pool.query('DELETE FROM links WHERE code = $1 RETURNING *', [code]);
    if (del.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
