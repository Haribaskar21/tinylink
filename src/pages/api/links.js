import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const result = await pool.query('SELECT * FROM links ORDER BY created_at DESC');
    return res.status(200).json(result.rows);
  } 

  if (req.method === 'POST') {
    const { url, code } = req.body;

    // Validate code
    if (!/^[A-Za-z0-9]{6,8}$/.test(code)) return res.status(400).json({ error: 'Invalid code' });
    // Validate URL
    try { new URL(url) } catch { return res.status(400).json({ error: 'Invalid URL' })}

    // Check unique code
    const existing = await pool.query('SELECT * FROM links WHERE code = $1', [code]);
    if (existing.rows.length > 0) return res.status(409).json({ error: 'Code exists' });

    // Insert
    const now = new Date();
    await pool.query(
      `INSERT INTO links(code, url, created_at, click_count, last_clicked) VALUES($1, $2, $3, 0, null)`,
      [code, url, now]
    );

    return res.status(201).json({ code, url });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}