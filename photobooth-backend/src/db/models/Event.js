import Sequelize from 'sequelize';
import Model from '../../utils/Model';
import models from "../../db";

class Event extends Model {
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
            start: {
                type: Sequelize.DATE
            },
            end: {
                type: Sequelize.DATE
            },
            capture_type: {
                type: Sequelize.STRING
            },
            camera_type: {
                type: Sequelize.STRING
            },
            cf_first_name: {
                type: Sequelize.STRING
            },
            cf_last_name: {
                type: Sequelize.STRING
            },
            cf_instagram_handle: {
                type: Sequelize.STRING
            },
            cf_email: {
                type: Sequelize.STRING
            },
            cf_telephone: {
                type: Sequelize.STRING
            },
            cf_print_num: {
                type: Sequelize.INTEGER
            },
            oo_email: {
                type: Sequelize.STRING
            },
            oo_sms: {
                type: Sequelize.STRING
            },
            oo_print: {
                type: Sequelize.STRING
            },
            photoframe1: {
                type: Sequelize.STRING
            },
            photoframe2: {
                type: Sequelize.STRING
            },
            photoframe3: {
                type: Sequelize.STRING
            },
            photoframe4: {
                type: Sequelize.STRING
            },
            email_subject: {
                type: Sequelize.STRING
            },
            email_body_copy: {
                type: Sequelize.STRING
            },
            sms_message: {
                type: Sequelize.STRING
            },
            client_id: {
                type: Sequelize.UUID,
                references: {
                    model: 'User',
                    key: 'id'
                }
            },
            active: {
                type: Sequelize.INTEGER
            }
        }
    }

    static get params() {
        return {
            tableName: 'events',
            timestamps: true,
            freezeTableName: true,
            paranoid: true,
        };
    }

    static associate(db) {
        Event.belongsTo(db.User, {foreignKey: 'client_id'})
    }

    getInstance() {
        return {
            id: this.id,
            name: this.name,
            logo: this.logo,
            start: this.start,
            end: this.end,
            capture_type: this.capture_type,
            camera_type: this.camera_type,
            cf_first_name: this.cf_first_name,
            cf_last_name: this.cf_last_name,
            cf_instagram_handle: this.cf_instagram_handle,
            cf_email: this.cf_email,
            cf_telephone: this.cf_telephone,
            cf_print_num: this.cf_print_num,
            oo_email: this.oo_email,
            oo_sms: this.oo_sms,
            oo_print: this.oo_print,
            photoframe1: this.photoframe1,
            photoframe2: this.photoframe2,
            photoframe3: this.photoframe3,
            photoframe4: this.photoframe4,
            email_subject: this.email_subject,
            email_body_copy: this.email_body_copy,
            sms_message: this.sms_message,
            client_id: this.client_id,
            active: this.active,
            client: this.full_name
        }
    }
}

export default Event