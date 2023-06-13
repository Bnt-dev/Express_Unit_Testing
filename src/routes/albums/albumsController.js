const connexion = require('../../../db-config');
const db = connexion.promise();

const getAll = (req, res) => {
  db.query('SELECT * FROM albums')
    .then(([results]) => res.json(results))
    .catch(() => res.status(500).send('Error retrieving data from database'));
};

const getOne = (req, res) => {
  const id = parseInt(req.params.id);

  db.query('SELECT * FROM albums WHERE id = ?', [id])
    .then(([[results]]) => {
      if (results) {
        res.json(results);
      } else {
        res.status(404).send('Not found');
      }
    })
    .catch(() => res.status(500).send('Error retrieving data from database'));
};

const getTracksByAlbumId = (req, res) => {
  const id_album = parseInt(req.params.id);

  db.query('SELECT * FROM track WHERE id_album = ?', [id_album])
    .then(([results]) => res.json(results))
    .catch(() => res.status(404).send('Not found'));
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
