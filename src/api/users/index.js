const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'user',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const userHandler = new UsersHandler(service, validator);
    server.route(routes(userHandler));
  },
};