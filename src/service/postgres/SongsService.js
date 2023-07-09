const crypto = require('crypto');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { filterPerformerSongByParam, filterTitleSongByParam, mapSongDB } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  _generateId() {
    return crypto.randomBytes(16).toString('hex');
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${this._generateId()}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs({ title = '', performer = '' }) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 and performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }
  
  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const fetch = await this._pool.query(query);
    if (fetch.rowCount === 0) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return fetch.rows.map(mapSongDB)[0];
  }

  async editSongById(id, { title, year, performer, genre, duration }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, performer, genre, duration, id],
    };

    const fetch = await this._pool.query(query);
    if (fetch.rowCount === 0) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const fetch = await this._pool.query(query);
    if (fetch.rowCount === 0) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
