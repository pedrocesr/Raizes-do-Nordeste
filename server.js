require('dotenv').config();

const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const obraRoutes = require('./routes/obraRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(obraRoutes);

app.get('/', (req, res) => {

    res.send('API funcionando!');

});

app.listen(3000, () => {

    console.log('Servidor rodando na porta 3000');

});