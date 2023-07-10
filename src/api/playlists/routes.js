const routes = (handler) => [
    {
      method: 'POST',
      path: '/playlists',
      handler: handler.postPlaylistHandler,
      options: {
        auth: 'musicapi_jwt',
      },
    },
    {
      method: 'GET',
      path: '/playlists',
      handler: handler.getAllPlaylistHandler,
      options: {
        auth: 'musicapi_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/playlists/{id}',
      handler: handler.deletePlaylistHandler,
      options: {
        auth: 'musicapi_jwt',
      },
    },
    {
      method: 'POST',
      path: '/playlists/{id}/songs',
      handler: handler.postSongToPlaylistHandler,
      options: {
        auth: 'musicapi_jwt',
      },
    },
    {
      method: 'GET',
      path: '/playlists/{id}/songs',
      handler: handler.getSongsFromPlaylistHandler,
      options: {
        auth: 'musicapi_jwt',
      },
    },
    {
      method: 'DELETE',
      path: '/playlists/{id}/songs',
      handler: handler.deleteSongFromPlaylistHandler,
      options: {
        auth: 'musicapi_jwt',
      },
    },
  ];
  
  module.exports = routes;