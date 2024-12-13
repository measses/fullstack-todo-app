module.exports = {
  development: {
    client: "pg", // PostgreSQL kullanıyoruz
    connection: {
      host: "127.0.0.1", // Yerel sunucu
      user: "mertaraz", // PostgreSQL kullanıcı adı
      password: "13122024", // PostgreSQL şifresi
      database: "todos", // Kullanmak istediğin veritabanı adı
      port: 5432, // PostgreSQL varsayılan portu
    },
    migrations: {
      directory: "./migrations", // Migration dosyalarının yolu
    },
    seeds: {
      directory: "./seeds", // Opsiyonel: Seed dosyalarının yolu
    },
  },
};
