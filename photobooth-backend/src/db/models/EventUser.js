import Sequelize from 'sequelize';
import Model from '../../utils/Model';
import models from "../../db";

class EventUser extends Model {
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
            event_id: {
                type: Sequelize.UUID
            }
        }
    }

    static get params() {
        return {
            tableName: 'eventusers',
            timestamps: true,
            freezeTableName: true,
            paranoid: true,
        };
    }

    getInstance() {
        return {
            id: this.id,
            email: this.name,
            password: this.logo,
            event_id: this.event_id
        }
    }

    getEventIdInstance() {
	return this.event_id
    }
}

export default EventUser