const crypto = require('crypto');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  generateId() {
    return crypto.randomBytes(16).toString('hex');
  }

  async addPlaylistActivities(playlistId, songId, userId) {
    const id = `activities-${this.generateId()}`;
    const action = 'add';
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Activities gagal ditambahkan');
    }
  }

  async deletePlaylistActivities(playlistId, songId, userId) {
    const id = `activities-${this.generateId()}`;
    const action = 'delete';
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Activities gagal ditambahkan');
    }
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: 'SELECT u.username AS username, s.title AS title, psa.action AS action, psa.time AS time FROM playlist_song_activities psa LEFT JOIN users u ON psa.user_id = u.id LEFT JOIN song s ON psa.song_id = s.id WHERE psa.playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistActivitiesService;
