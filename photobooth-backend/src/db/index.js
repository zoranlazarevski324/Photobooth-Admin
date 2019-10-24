import Sequelize from 'sequelize';
import importDir from 'import-dir';
import dotenv from 'dotenv'

dotenv.config();
const sequelize = new Sequelize(
    process.env.DBNAME,
    process.env.DBUSERNAME,
    process.env.DBPASSWORD, 
    {
        host: process.env.DBHOST,
        port: process.env.DBPORT,
        dialect: 'mysql'
    }
);

const models = importDir('./models');

Object.keys(models).forEach((model) => {
    models[model] = models[model].init(sequelize);
});

Object.keys(models).forEach((model) => {
    if (typeof models[model].associate === 'function') {
        models[model].associate(models);
    }
});

models.sequelize = sequelize;

export default models;