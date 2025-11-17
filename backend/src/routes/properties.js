import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get all properties
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, city, state, property_type, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM properties WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    if (city) {
      query += ` AND city ILIKE $${paramCount}`;
      params.push(`%${city}%`);
      paramCount++;
    }
    if (state) {
      query += ` AND state = $${paramCount}`;
      params.push(state);
      paramCount++;
    }
    if (property_type) {
      query += ` AND property_type = $${paramCount}`;
      params.push(property_type);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    const countQuery = 'SELECT COUNT(*) FROM properties WHERE 1=1' +
      (status ? ` AND status = '${status}'` : '') +
      (city ? ` AND city ILIKE '%${city}%'` : '') +
      (state ? ` AND state = '${state}'` : '') +
      (property_type ? ` AND property_type = '${property_type}'` : '');
    const countResult = await pool.query(countQuery);

    res.json({
      properties: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single property
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create property
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      address, city, state, zip_code, property_type, bedrooms, bathrooms,
      square_feet, lot_size, year_built, asking_price, estimated_value,
      status, description, notes, mls_number, images, amenities, google_drive_folder_id
    } = req.body;

    const result = await pool.query(
      `INSERT INTO properties (
        address, city, state, zip_code, property_type, bedrooms, bathrooms,
        square_feet, lot_size, year_built, asking_price, estimated_value,
        status, description, notes, mls_number, images, amenities,
        google_drive_folder_id, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`,
      [address, city, state, zip_code, property_type, bedrooms, bathrooms,
       square_feet, lot_size, year_built, asking_price, estimated_value,
       status || 'prospect', description, notes, mls_number,
       JSON.stringify(images), JSON.stringify(amenities), google_drive_folder_id, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update property
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const fields = Object.keys(updates).filter(k => k !== 'id' && k !== 'created_at' && k !== 'created_by');
    const values = fields.map(f => updates[f]);

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    values.push(id);

    const result = await pool.query(
      `UPDATE properties SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete property
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully', id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get property statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) as total_properties,
        COUNT(*) FILTER (WHERE status = 'prospect') as prospects,
        COUNT(*) FILTER (WHERE status = 'under_contract') as under_contract,
        COUNT(*) FILTER (WHERE status = 'closed') as closed,
        AVG(asking_price) as avg_asking_price,
        SUM(asking_price) FILTER (WHERE status = 'closed') as total_closed_value
      FROM properties
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
