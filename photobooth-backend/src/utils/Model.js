import Sequelize from 'sequelize';

class Model extends Sequelize.Model {
  static init(sequelize) {
    const options = Object.assign(this.params, this.config);
    options.sequelize = sequelize;
    super.init(this.fields, options);
    return this;
  }

  static pagination(count, limit = 20, offset = 0) {
    return {
      totalCount: count,
      limit,
      offset,
    };
  }
}

export default Model;
