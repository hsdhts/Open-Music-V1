const routes = (handler) => [
    {
      method: 'GET',
      path: '/playlists/{id}/activities',
      handler: handler.getPlaylistActivitiesHandler,
      options: {
        auth: 'musicapi_jwt',
      },
    },
  ];
  
  module.exports = routes;