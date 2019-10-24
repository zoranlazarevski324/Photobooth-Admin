import Sequelize from 'sequelize';
import Model from '../../utils/Model';
import models from "../../db";

class User extends Model {
    static get fields() {
        return {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            email: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            },
            roll: {
                type: Sequelize.INTEGER
            },
            company_name: {
                type: Sequelize.STRING
            },
            contact_first_name: {
                type: Sequelize.STRING
            },
			contact_last_name: {
                type: Sequelize.STRING
            },
            contact_phone: {
                type: Sequelize.STRING
            },
            logo: {
                type: Sequelize.STRING
            },
            active: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                type: Sequelize.DATE
            }
        }
    }

    static get params() {
        return {
            tableName: 'users',
            timestamps: true,
            freezeTableName: true,
            paranoid: true,
        };
    }

    getInstance() {
        return {
            id: this.id,
            email: this.email,
            company_name: this.company_name,
            contact_first_name: this.contact_first_name,
			contact_last_name: this.contact_last_name,
            contact_phone: this.contact_phone,
            logo: this.logo,
            active: this.active,
            createdAt: this.createdAt
        }
    }
}

export default User