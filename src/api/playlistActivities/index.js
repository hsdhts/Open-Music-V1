const PlaylistActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists_song_activities',
  versiom: '1.0.0',

  register: async (server, { playlistActivitiesService, playlistsService }) => {
    const playlistActivitiesHandler = new PlaylistActivitiesHandler(
      playlistActivitiesService,
      playlistsService,
    );
    server.route(routes(playlistActivitiesHandler));
  },
};