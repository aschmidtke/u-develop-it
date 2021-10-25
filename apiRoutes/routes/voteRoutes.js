const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCHeck');


router.post('/vote', ({ body }, res) => {
    // data validation
    const errors = inputCheck(body, 'voter_id', 'candidate_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO votes (voter_id, candidate_id) VALUES (?,?)`;
    const params = [body.voter_id, body.candidate_id];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
            changes: results.affectedRows
        });
    });
});

router.get('/votes', ({ body }, res) => {
    const sql = `SELECT candidates.*, parties.name AS party_name, COUNT(candidate_id) AS count
                    FROM votes
                    LEFT JOIN candidates ON votes.candidate_id = candidates.id
                    LEFT JOIN parties ON candidates.party_id = parties.id
                    GROUP BY candidate_id ORDER BY count DESC`;
    const params = [body.candidate_id, body.party_name];

    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

module.exports = router;