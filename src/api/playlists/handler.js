const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(
    playlistsService,
    songService,
    playlistActivitiesService,
    validator,
  ) {
    this._playlistsService = playlistsService;
    this._songService = songService;
    this._playlistsActivitiesService = playlistActivitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist(
      credentialId,
      request.payload,
    );

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getAllPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlistsByCollab = await this._playlistsService.getAllPlaylistsByCollab(credentialId);
    const playlistsByOwner = await this._playlistsService.getAllPlaylists(
      credentialId,
    );

    const playlists = playlistsByOwner.concat(playlistsByCollab);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistsService.deletePlaylist(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._songService.getSongById(songId);
    await this._playlistsService.addSongToPlaylist(id, songId);
    await this._playlistsActivitiesService.addPlaylistActivities(
      id,
      songId,
      credentialId,
    );

    const response = h.response({
      status: 'success',
      message: 'Lagu Berhasil Ditambahkan Kedalam Playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    const detailPlaylist = await this._playlistsService.getPlaylistById(id);
    const songsPlaylist = await this._playlistsService.getSongsFromPlaylistById(
      id,
    );

    const result = {
      playlist: {
        id: detailPlaylist.id,
        name: detailPlaylist.name,
        username: detailPlaylist.username,
        songs: songsPlaylist,
      },
    };

    return {
      status: 'success',
      data: result,
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { songId } = request.payload;
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._songService.getSongById(songId);
    await this._playlistsService.deleteSongFromPlaylist(id, songId);
    await this._playlistsActivitiesService.deletePlaylistActivities(
      id,
      songId,
      credentialId,
    );

    return {
      status: 'success',
      message: 'Song berhasil dihapus dari playlist.',
    };
  }
}

module.exports = PlaylistsHandler;