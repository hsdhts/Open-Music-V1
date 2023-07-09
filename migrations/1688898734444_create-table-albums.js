exports.up = pgm => {
  pgm.createTable('albums', {
      id: {
        type: 'VARCHAR(55)',
        primaryKey: true,
      },
      name: {
        type: 'TEXT',
        notNull: true
      },
      year: {
        type: 'INTEGER',
        notNull: true,
      }
    });
};

exports.down = pgm => {
  pgm.dropTable('albums');
};
