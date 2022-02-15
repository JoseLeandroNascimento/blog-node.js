const Sequelize = require("sequelize");
const connection = require("../database/database");

const Categoria = connection.define('categoria', {

    titulo: {

        type: Sequelize.STRING,
        allowNull: false,
    },
    slug: {

        type: Sequelize.STRING,
        allowNull: false,
    }
})

Categoria.sync({ force: false });

module.exports = Categoria;