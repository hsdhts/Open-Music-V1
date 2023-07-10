const crypto = require('crypto');
const { Pool } = require('pg');

const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsService {
  constructor(collaborationService) {
    /* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  generateId() {
    return crypto.randomBytes(16).toString('hex');
  }

  async addPlaylist(credentialId, payload) {
    const id = `playlist-${this.generateId()}`;
    const { name } = payload;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAllPlaylists(id) {
    const query = {
      text: 'SELECT p.id, p.name, u.username FROM playlists p LEFT JOIN users u ON u.id = p.owner_id WHERE owner_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async getAllPlaylistsByCollab(id) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM collaborations LEFT JOIN playlists ON playlists.id = collaborations.playlist_id LEFT JOIN users ON users.id = playlists.owner_id WHERE collaborations.user_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlists gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist-song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke Playlist');
    }
    return result.rows[0].id;
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON users.id = playlists.owner_id WHERE playlists.id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getSongsFromPlaylistById(playlistId) {
    const query = {
      text: 'SELECT s.id AS id, s.title AS title, s.performer AS performer FROM playlist_songs ps LEFT JOIN song s ON ps.song_id = s.id WHERE ps.playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE from playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus dari playlist');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner_id !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;