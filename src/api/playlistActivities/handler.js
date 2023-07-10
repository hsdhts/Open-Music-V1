const autoBind = require('auto-bind');

class PlaylistActivitiesHandler {
  constructor(playlistActivitiesService, playlistService) {
    this._playlistActivitiesService = playlistActivitiesService;
    this._playlistService = playlistService;
    autoBind(this);
  }

  async getPlaylistActivitiesHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    const activities = await this._playlistActivitiesService.getPlaylistActivities(id);

    const result = {
      playlistId: id,
      activities,
    };

    return {
      status: 'success',
      data: result,
    };
  }
}

module.exports = PlaylistActivitiesHandler;