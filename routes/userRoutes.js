const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const pool = require('../db/connection');


// CADASTRO

router.post('/cadastro', async (req, res) => {

    const {
        nome,
        email,
        senha,
        idade,
        data_nascimento
    } = req.body;

    try {

        const usuarioExistente = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (usuarioExistente.rows.length > 0) {

            return res.status(400).json({
                erro: 'Email já cadastrado'
            });

        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const resultado = await pool.query(
            `
            INSERT INTO usuarios
            (nome, email, senha, idade, data_nascimento)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, nome, email
            `,
            [
                nome,
                email,
                senhaCriptografada,
                idade,
                data_nascimento
            ]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao cadastrar usuário'
        });

    }
});


// LOGIN

router.post('/login', async (req, res) => {

    const {
        email,
        senha
    } = req.body;

    try {

        const resultado = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });

        }

        const usuario = resultado.rows[0];

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaCorreta) {

            return res.status(401).json({
                erro: 'Senha incorreta'
            });

        }

        res.status(200).json({
            mensagem: 'Login realizado com sucesso',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro no login'
        });

    }
});

module.exports = router;