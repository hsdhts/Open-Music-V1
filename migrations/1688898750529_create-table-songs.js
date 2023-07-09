exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
          type: 'VARCHAR(55)',
          primaryKey: true,
        },
        title: {
          type: 'VARCHAR(55)',
          notNull: true
        },
        year: {
          type: 'INT',
          notNull: true
        },
        performer: {
          type: 'VARCHAR(30)',
          notNull: true,
        },
        genre: {
          type: 'VARCHAR(15)',
          notNull: true
        },
        duration: {
          type: 'INT',
        },
        albumId: {
          type: 'VARCHAR(55)'
        }
      });
};

exports.down = pgm => {
    pgm.dropTable('songs');
};