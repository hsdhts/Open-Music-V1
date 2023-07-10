exports.up = (pgm) => {
  pgm.createTable("playlists", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
    },
    owner_id: {
      type: "TEXT",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "playlists",
    "fk_playlists.owner_id_users.id",
    "FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("palylists");
};