const { DataTypes } = require('sequelize');
const sequelize = require('../Data/dbContext');


const User = sequelize.define('User', {
 
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hourlyPay: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 28.10
  }
}, {
  tableName: 'Users'
});

// --- Synchronizacja Modelu z bazą danych - tworzenie tabeli, jeżeli nie istnieje

User.sync({force: false})
  .then(() => {
    console.log("Tabela userów została zsynchornizowana.");
  })
  .catch((err) => {
    console.error("Błąd sychnronizacji bazy danych: ", err);
  })

  module.exports = User;