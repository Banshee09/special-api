const API_PORT = 3000;
//const API_URL = "http://localhost:3000"
const API_URL = 'http://special-api.ap-southeast-2.elasticbeanstalk.com';
//const DB_URL = `mongodb://localhost/special-api`;
const DB_URL = 'mongodb://sam:3821869@cluster0-shard-00-00-jqqte.mongodb.net:27017,cluster0-shard-00-01-jqqte.mongodb.net:27017,cluster0-shard-00-02-jqqte.mongodb.net:27017/special-api?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'

function getUsage(route, id='_id') {
    const response = [
        {
            Method: 'GET',
            URL: `${API_URL}/${route}`
        },
        {
            Method: 'POST',
            URL: `${API_URL}/${route}`
        },
        {
            Method: 'GET',
            URL: `${API_URL}/${route}/${id}`
        },
        {
            Method: 'PATCH',
            URL: `${API_URL}/${route}/${id}`
        },
        {
            Method: 'DELETE',
            URL: `${API_URL}/${route}/${id}`
        }
    ]
    return response;
}


module.exports = {
    DB_URL: DB_URL,
    API_PORT: API_PORT,
    getAPI(route, id) {
        switch (route) {
            case 'categories':
                return getUsage(route, id);

            case 'products':
                return getUsage(route, id);

            case 'stores':
                return getUsage(route, id);

            case 'offers':
                return getUsage(route, id);

            default:
                return '';
        }
    }
};