const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3033;
const DATA_FILE = path.join(__dirname, 'data.json');

// --- VARIÁVEIS DE REVELAÇÃO ---
// Quando descobrir o sexo, mude IS_REVEALED para true
// e altere REVEALED_BABY para 'Stella' ou 'Oliver'
const IS_REVEALED = false; 
const REVEALED_BABY = 'Oliver'; // ou 'Stella'
// ------------------------------

app.use(cors());
app.use(bodyParser.json());

// Adiciona middleware para suportar streaming de áudio corretamente e definir cabeçalhos para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.mp3')) {
            res.set('Accept-Ranges', 'bytes');
            res.set('Content-Type', 'audio/mpeg');
        } else if (path.endsWith('.ogg')) {
            res.set('Accept-Ranges', 'bytes');
            res.set('Content-Type', 'audio/ogg');
        }
    }
}));

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Endpoint to save a new result
app.post('/api/save', (req, res) => {
    try {
        const newData = req.body;
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        
        // Calculate score: Assume Stella = mostly option 1 (girl choices), Oliver = mostly option 2 (boy choices)
        // Or simply count boy vs girl choices to determine the result
        
        data.push({
            name: newData.name,
            choices: newData.choices,
            result: newData.result, // 'Stella' or 'Oliver'
            timestamp: new Date().toISOString()
        });
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Endpoint to get ranking
app.get('/api/ranking', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read ranking' });
    }
});

// Endpoint para verificar se o bebê já foi revelado
app.get('/api/reveal-status', (req, res) => {
    res.json({
        isRevealed: IS_REVEALED,
        babyName: IS_REVEALED ? REVEALED_BABY : null
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
