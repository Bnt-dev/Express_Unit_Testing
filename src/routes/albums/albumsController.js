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

const postAlbums = async (req, res) => {
  const { title, genre, picture, artist } = req.body;

  // db.query(
  //   'INSERT INTO albums(title, genre, picture, artist) VALUES (?, ?, ?, ?)',
  //   [title, genre, picture, artist]
  // )
  // //   .then(() => res.sendStatus(201))
  //   .catch(() => res.status(500).send('Error in data'));

  try {
    const [resultInsert] = await db.query(
      'INSERT INTO albums(title, genre, picture, artist) VALUES (?, ?, ?, ?)',
      [title, genre, picture, artist]
    );

    const [[insertedAlbum]] = await db.query(
      'SELECT * FROM albums WHERE id = ?',
      [resultInsert.insertId]
    );

    res.status(201).json(insertedAlbum);
  } catch (e) {
    res.status(500).send('Error retrieving data from database');
  }
};

const updateAlbums = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, genre, picture, artist } = req.body;

  const columns = [];
  const params = [];

  if (title != undefined) {
    columns.push('title = ?');
    params.push(title);
  }

  if (genre != undefined) {
    columns.push('genre = ?');
    params.push(genre);
  }

  if (picture != undefined) {
    columns.push('picture = ?');
    params.push(picture);
  }

  if (artist != undefined) {
    columns.push('artist = ?');
    params.push(artist);
  }

  if (!params.length) {
    res.status(400).send('No columns to modify');
    return;
  }

  db.query(`UPDATE albums SET ${columns.join(', ')} WHERE id = ?`, [
    ...params,
    id,
  ])
    .then(([results]) => {
      if (results.affectedRows === 0) {
        res.status(404).send('Album not found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch(() => res.status(500).status('Error editing album'));
};

const deleteAlbums = (req, res) => {
  const id = parseInt(req.params.id);

  db.query('DELETE FROM albums WHERE id = ?', [id])
    .then(([results]) => {
      if (results.affectedRows === 0) {
        res.status(404).send('Not found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch(() => res.status(500).send('Error deleting albums'));
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};
