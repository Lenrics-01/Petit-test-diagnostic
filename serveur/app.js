const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const filmsData = fs.readFileSync('data/films.json', 'utf8');
if (!filmsData) {
    console.error('Erreur: Impossible de lire le fichier films.json');
    process.exit(1);
}
const films = JSON.parse(filmsData);

app.get('/api/films', (req, res) => {
    res.status(200).json(films);
});

app.get('/api/films', (req, res) => {
    try {
        const annee = parseInt(req.query.annee);
        if (isNaN(annee)) {
            return res.status(400).json({ erreur: 'Année n\'est pas un entier' });
        }
        const films2010 = films.filter(film => film.annee === annee);
        res.status(200).json(films2010);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur interne du serveur' });
    }
});

app.get('/api/films/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erreur: 'ID n\'est pas un entier' });
    }
    const film = films.find(film => film.id === id);
    if (!film) {
        return res.status(404).json([]);
    }
    res.status(200).json(film);
});

app.post('/api/films', (req, res) => {
    try {
        const { titre, annee, realisateur } = req.body;
        const id = films.length + 1;
        if (!titre || !annee) {
            return res.status(400).json({ erreur: 'Champs manquants' });
        }
        const newFilm = {
            id: id,
            titre: titre,
            annee: annee,
            realisateur: realisateur || 'aucun'
        };
        films.push(newFilm);
        fs.writeFileSync('data/films.json', JSON.stringify(films, null, 2));
        res.status(201).json(newFilm);
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur interne du serveur' });
    }
});

app.delete('/api/films/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ erreur: 'ID n\'est pas un entier' });
        }
        const index = films.findIndex(film => film.id === id);
        if (index === -1) {
            return res.status(404).json({ erreur: 'Film non trouvé' });
        }
        films.splice(index, 1);
        fs.writeFileSync('data/films.json', JSON.stringify(films, null, 2));
        res.status(200).json({ message: 'Film supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ erreur: 'Erreur interne du serveur' });
    }
}
);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


