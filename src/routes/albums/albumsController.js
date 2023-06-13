const connexion = require('../../../db-config');
const db = connexion.promise();

const getAll = (req, res) => {
  db
    .query("SELECT * FROM albums")
    .then(([results]) => res.json(results))
    .catch((err) => res.status(500).send('Error retrieving data from database'))
};





const getOne = (req, res) => {
  const id = parseInt(req.params.id)

  db
    .query('SELECT * FROM albums WHERE id = ?', [id])
    .then(([results]) => {
      if (results.length) {
        res.json(results)
      }
      else { res.status(404).send('Not found') }
    })
    .catch((err) => res.status(500).send('Error retrieving data from database'))
};





const getTracksByAlbumId = (req, res) => {
  const id = parseInt(req.params.id)

  db
    .query('SELECT title FROM tracks WHERE id = ?', [id])
    .then(([results]) => res.json(results))
    .catch((err) => res.send(404).send('found'))
};

const postAlbums = (req, res) => {
  res.status(200).send('Post route is OK');
};

const updateAlbums = (req, res) => {
  res.status(200).send('Update route is OK');
};

const deleteAlbums = (req, res) => {
  res.status(200).send('Delete route is Ok');
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};
