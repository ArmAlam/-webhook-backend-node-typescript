'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('request_apis', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT,
            },
            name: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            collection_id: {
                allowNull: true,
                type: Sequelize.BIGINT,
            },
            request_url: {
                allowNull: true,
                type: Sequelize.TEXT,
            },
            request_type: {
                allowNull: true,
                type: Sequelize.SMALLINT,
                comment: 'get=1,post=2,put=3,patch=4,delete=5',
            },
            params: {
                allowNull: true,
                type: Sequelize.JSON,
            },
            authorization_type: {
                allowNull: true,
                type: Sequelize.SMALLINT,
                comment: 'no_auth=0,api_key=1,bearer_token=2,basic_auth=3',
            },
            authorization_credentials: {
                allowNull: true,
                type: Sequelize.JSON,
            },
            headers: {
                allowNull: true,
                type: Sequelize.JSON,
            },
            body_type: {
                allowNull: true,
                type: Sequelize.SMALLINT,
                comment: 'none=0,form_data=1,x_url_form_encoded=2,json=3',
            },
            active_body_type: {
                allowNull: true,
                type: Sequelize.SMALLINT,
            },
            body_data: {
                allowNull: true,
                type: Sequelize.JSON,
            },
            created_at: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('request_apis');
    },
};
