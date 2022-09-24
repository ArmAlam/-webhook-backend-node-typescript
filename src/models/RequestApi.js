const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RequestApi extends Model {
        static associate(models) {
			RequestApi.belongsTo(models.collection, {
				foreignKey: 'collection_id',
				targetKey: 'id',
			});

		}
    }

    
    RequestApi.init(
        {
            name: DataTypes.STRING,
            collection_id: DataTypes.BIGINT,
            request_url: DataTypes.TEXT,
            request_type: DataTypes.SMALLINT, //{get=1,post=2,put=3,patch=4,delete=5}
            params: DataTypes.JSON,
            authorization_type:DataTypes.SMALLINT, //{no_auth=0,api_key=1,bearer_token=2,basic_auth=3}
            authorization_credentials: DataTypes.JSON,
            headers: DataTypes.JSON,
            body_type: DataTypes.SMALLINT, //{none=0,form_data=1,x_url_form_encoded=2,json=3}
            active_body_type: DataTypes.SMALLINT,
            body_data:DataTypes.JSON,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'request_api',
            underscored: true,
        }
    );
    return RequestApi;
};
