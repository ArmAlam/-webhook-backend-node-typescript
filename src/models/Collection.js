const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Collection extends Model {

    }

    Collection.init(
        {
            name: DataTypes.STRING,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'collection',
            underscored: true,
        }
    );
    return Collection;
};
