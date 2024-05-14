// app.js

const express = require('express');
const connectDB = require('./db');
const ShortURL = require('./models/ShortURL');
const shortid = require('shortid');
const validUrl = require('valid-url');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conectar ao banco de dados
connectDB();

// Rota raiz - Servir a página inicial
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath);
});

// Rota para encurtar uma URL
app.post('/encurtar', async (req, res) => {
    const { url } = req.body;

    // Validar a URL
    if (!validUrl.isUri(url)) {
        return res.status(400).json({ error: 'URL inválida' });
    }

    const shortCode = shortid.generate();
    const shortUrl = `http://localhost:${PORT}/${shortCode}`;

    try {
        await ShortURL.create({ originalUrl: url, shortCode });
        res.json({ shortUrl });
    } catch (err) {
        console.error('Erro ao encurtar URL:', err);
        res.status(500).send('Erro ao encurtar URL');
    }
});

// Rota para redirecionar para a URL original usando o código curto
app.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;
    const url = await ShortURL.findOneAndUpdate({ shortCode }, { $inc: { clicks: 1 } });

    if (url) {
        res.redirect(url.originalUrl);
    } else {
        res.status(404).send('URL não encontrada');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
