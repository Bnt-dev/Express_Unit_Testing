const connexion = require('../../../db-config');
const db = connexion.promise();





const getOne = (req, res) => {
  const id = parseInt(req.params.id)

  db
    .query("SELECT * FROM track WHERE id = ?", [id])
    .then(([track]) => {
      if (track[0] != null) {
        res.json(track[0]).sendStatus(200)
      }
      else {
        res.status(404).send('Error track not found')
      }
    })
    .catch((err) => res.status(500).send('Error retrieving data from database'))
};





const getAll = (req, res) => {
  db
    .query("SELECT * FROM track")
    .then(([alltracks]) => res.json(alltracks).sendStatus(201))
    .catch((err) => res.status(500).send('Error retrieving data from database'))
};





const postTracks = (req, res) => {
  const { title, youtube_url, id_album } = req.body

  db
    .query('INSERT INTO track(title, youtube_url, id_album) VALUES (?, ?, ?)', [title, youtube_url, id_album])
    .then(([trackAdd]) => {
      res.location(`/api/tracks/${trackAdd.insertId}`).sendStatus(201);
    })
    .catch((err) => res.status(500).send('Error retrieving data from database'))
};





const updateTracks = (req, res) => {
  res.status(200).send('Update route is OK');
};





const deleteTracks = (req, res) => {
  res.status(200).send('Delete route is OK');
};

module.exports = { getOne, getAll, postTracks, updateTracks, deleteTracks };
