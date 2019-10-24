import Sequelize from 'sequelize';
import Model from '../../utils/Model';
import models from "../../db";

class Submission extends Model {
    static get fields() {
        return {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING
            },
            logo: {
                type: Sequelize.STRING
            },
            event_id: {
                type: Sequelize.UUID,
                references: {
                    model: 'Event',
                    key: 'id'
                }
            },
	    createdAt: {
		type: Sequelize.DATE
	    }
        }
    }

    static get params() {
        return {
            tableName: 'submissions',
            timestamps: true,
            freezeTableName: true,
            paranoid: true,
        };
    }

    getInstance() {
        return {
            id: this.id,
            name: this.name,
            logo: this.logo,
            event_id: this.event_id,
	    createdAt: this.createdAt
        }
    }
}

export default Submission