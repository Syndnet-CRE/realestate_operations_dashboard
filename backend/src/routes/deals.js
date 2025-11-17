import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get all deals
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { stage, assigned_to, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT d.*, p.address as property_address, c.first_name || ' ' || c.last_name as contact_name
      FROM deals d
      LEFT JOIN properties p ON d.property_id = p.id
      LEFT JOIN contacts c ON d.contact_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (stage) {
      query += ` AND d.stage = $${paramCount}`;
      params.push(stage);
      paramCount++;
    }
    if (assigned_to) {
      query += ` AND d.assigned_to = $${paramCount}`;
      params.push(assigned_to);
      paramCount++;
    }

    query += ` ORDER BY d.expected_close_date ASC NULLS LAST, d.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json({ deals: result.rows });
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get deals by stage (for kanban view)
router.get('/by-stage', authenticateToken, async (req, res) => {
  try {
    const stages = ['lead', 'qualified', 'under_contract', 'due_diligence', 'closing', 'closed', 'dead'];
    const dealsByStage = {};

    for (const stage of stages) {
      const result = await pool.query(`
        SELECT d.*, p.address as property_address, c.first_name || ' ' || c.last_name as contact_name
        FROM deals d
        LEFT JOIN properties p ON d.property_id = p.id
        LEFT JOIN contacts c ON d.contact_id = c.id
        WHERE d.stage = $1
        ORDER BY d.expected_close_date ASC NULLS LAST
      `, [stage]);

      dealsByStage[stage] = result.rows;
    }

    res.json(dealsByStage);
  } catch (error) {
    console.error('Error fetching deals by stage:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single deal
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT d.*, p.address as property_address, p.city, p.state,
             c.first_name || ' ' || c.last_name as contact_name, c.email as contact_email, c.phone as contact_phone
      FROM deals d
      LEFT JOIN properties p ON d.property_id = p.id
      LEFT JOIN contacts c ON d.contact_id = c.id
      WHERE d.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create deal
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      property_id, deal_name, deal_type, stage, probability, expected_close_date,
      purchase_price, offer_price, estimated_value, down_payment, financing_type,
      estimated_repairs, estimated_arv, cap_rate, cash_on_cash_return, roi,
      contact_id, priority, tags, notes
    } = req.body;

    const result = await pool.query(
      `INSERT INTO deals (
        property_id, deal_name, deal_type, stage, probability, expected_close_date,
        purchase_price, offer_price, estimated_value, down_payment, financing_type,
        estimated_repairs, estimated_arv, cap_rate, cash_on_cash_return, roi,
        contact_id, assigned_to, priority, tags, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *`,
      [property_id, deal_name, deal_type, stage || 'lead', probability || 0, expected_close_date,
       purchase_price, offer_price, estimated_value, down_payment, financing_type,
       estimated_repairs, estimated_arv, cap_rate, cash_on_cash_return, roi,
       contact_id, req.user.id, priority || 'medium', JSON.stringify(tags), notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update deal
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const fields = Object.keys(updates).filter(k =>
      k !== 'id' && k !== 'created_at' && k !== 'property_address' && k !== 'contact_name'
    );
    const values = fields.map(f => updates[f]);

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    values.push(id);

    const result = await pool.query(
      `UPDATE deals SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update deal stage (for drag-and-drop)
router.patch('/:id/stage', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    if (!stage) {
      return res.status(400).json({ error: 'Stage is required' });
    }

    const updates = { stage, updated_at: new Date() };

    // If moving to 'closed', set closed_at
    if (stage === 'closed') {
      updates.closed_at = new Date();
      updates.actual_close_date = new Date();
    }

    const result = await pool.query(
      'UPDATE deals SET stage = $1, updated_at = CURRENT_TIMESTAMP, closed_at = $2 WHERE id = $3 RETURNING *',
      [stage, stage === 'closed' ? new Date() : null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete deal
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM deals WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json({ message: 'Deal deleted successfully', id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get deal statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) as total_deals,
        COUNT(*) FILTER (WHERE stage = 'lead') as leads,
        COUNT(*) FILTER (WHERE stage = 'qualified') as qualified,
        COUNT(*) FILTER (WHERE stage IN ('under_contract', 'due_diligence', 'closing')) as active,
        COUNT(*) FILTER (WHERE stage = 'closed') as closed,
        SUM(purchase_price) FILTER (WHERE stage = 'closed') as total_closed_value,
        AVG(purchase_price) FILTER (WHERE stage = 'closed') as avg_deal_size,
        SUM(purchase_price) FILTER (WHERE stage IN ('under_contract', 'due_diligence', 'closing')) as pipeline_value
      FROM deals
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get deals closing this month
router.get('/stats/closing-soon', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, p.address as property_address
      FROM deals d
      LEFT JOIN properties p ON d.property_id = p.id
      WHERE d.expected_close_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
      AND d.stage IN ('under_contract', 'due_diligence', 'closing')
      ORDER BY d.expected_close_date ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
