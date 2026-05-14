const express = require('express');

const router = express.Router();

const pool = require('../db/connection');


// LISTAR OBRAS

router.get('/obras', async (req, res) => {

    try {

        const resultado = await pool.query(
            'SELECT * FROM obras ORDER BY id DESC'
        );

        res.status(200).json(resultado.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao buscar obras'
        });

    }
});


// CADASTRAR OBRA

router.post('/obras', async (req, res) => {

    const {
        titulo,
        descricao,
        autor,
        tipo,
        estado_origem,
        ano
    } = req.body;

    try {

        const resultado = await pool.query(
            `
            INSERT INTO obras
            (
                titulo,
                descricao,
                autor,
                tipo,
                estado_origem,
                ano
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                titulo,
                descricao,
                autor,
                tipo,
                estado_origem,
                ano
            ]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao cadastrar obra'
        });

    }
});

module.exports = router;