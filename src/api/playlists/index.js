const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  versiom: '1.0.0',

  register: async (
    server,
    {
      playlistsService, songService, playlistActivitiesService, validator,
    },
  ) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService,
      songService,
      playlistActivitiesService,
      validator,
    );
    server.route(routes(playlistsHandler));
  },
};