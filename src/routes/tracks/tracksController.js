const connexion = require('../../../db-config');
const db = connexion.promise();

const getOne = (req, res) => {
  const id = parseInt(req.params.id);

  db.query('SELECT * FROM track WHERE id = ?', [id])
    .then(([track]) => {
      if (track[0] != null) {
        res.json(track[0]);
      } else {
        res.status(404).send('Error track not found');
      }
    })
    .catch(() => res.status(500).send('Error retrieving data from database'));
};

const getAll = (req, res) => {
  db.query('SELECT * FROM track')
    .then(([alltracks]) => res.json(alltracks))
    .catch(() => res.status(500).send('Error retrieving data from database'));
};

// Route POST

const postTracks = async (req, res) => {
  const { title, youtube_url, id_album } = req.body;

  // db
  //   .query('INSERT INTO track(title, youtube_url, id_album) VALUES (?, ?, ?)', [title, youtube_url, id_album])
  //   .then(([trackAdd]) => {
  //     db
  //       .query("SELECT * FROM track WHERE id = ?", [trackAdd.insertId])
  //       .then(([[result]]) => {
  //         res.status(201).json(result)
  //       })
  //   })
  //   .catch((err) => res.status(500).send('Error retrieving data from database'))

  try {
    const [resultInsert] = await db.query(
      'INSERT INTO track(title, youtube_url, id_album) VALUES (?, ?, ?)',
      [title, youtube_url, id_album]
    );

    const [[insertedTrack]] = await db.query(
      'SELECT * FROM track WHERE id = ?',
      [resultInsert.insertId]
    );

    res.status(201).json(insertedTrack);
  } catch (e) {
    res.status(500).send('Error retrieving data from database');
  }
};

const updateTracks = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, youtube_url, id_album } = req.body;

  const params = [];
  const columns = [];

  if (title != undefined) {
    columns.push('title = ?');
    params.push(title);
  }

  if (youtube_url != undefined) {
    columns.push('youtube_url = ?');
    params.push(youtube_url);
  }

  if (id_album != undefined) {
    columns.push('id_album = ?');
    params.push(id_album);
  }

  if (!params.length) {
    res.status(400).send('No columns to modify');
    return;
  }

  db.query(`UPDATE track SET ${columns.join(', ')} WHERE id = ?`, [
    ...params,
    id,
  ])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch(() => res.status(500).send('Error editing track'));
};

const deleteTracks = (req, res) => {
  const id = parseInt(req.params.id);

  db.query('DELETE from track WHERE id = ?', [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send('Not found');
      } else {
        res.sendStatus(204);
      }
    })
    .catch(() => res.status(500).send('Error deleting track'));
};

module.exports = { getOne, getAll, postTracks, updateTracks, deleteTracks };
