module.exports = {
    localURL: "http://localhost:3000",

    getAPI(type, route, id){
        switch(type){
            case 'GETALL':
                return replyGetAll(route, id);
                break;
            case 'POST':
                return replyPost(route, id);
                break;
            case 'GET':
                return replyGet(route, id);
                break;
            case 'PATCH':
                return replyPatch(route, id);
                break;
            case 'DELETE':
                return replyUsage(route);
                break;
            default:
                return replyUsage(route);
        }

    }
};

const localURL = "http://localhost:3000";

function replyGetAll(route, id){
    const response = [
        {
            Method: 'POST',
            URL: `${localURL}/${route}`
        },
        {
            Method: 'GET',
            URL: `${localURL}/${route}/${id}`
        },
        {
            Method: 'PATCH',
            URL: `${localURL}/${route}/${id}`
        },
        {
            Method: 'DELETE',
            URL: `${localURL}/${route}/${id}`
        }
    ]
    return response;
}


function replyPost(route, id){
    const response = [
        {
            Method: 'GET',
            URL: `${localURL}/${route}`
        },
        {
            Method: 'GET',
            URL: `${localURL}/${route}/${id}`
        },
        {
            Method: 'PATCH',
            URL: `${localURL}/${route}/${id}`
        },
        {
            Method: 'DELETE',
            URL: `${localURL}/${route}/${id}`
        }
    ]
    return response;

}

function replyGet(route, id){
    const response = [
        {
            Method: 'GET',
            URL: `${localURL}/${route}`
        },
        {
            Method: 'POST',
            URL: `${localURL}/${route}`
        },
        {
            Method: 'PATCH',
            URL: `${localURL}/${route}/${id}`
        },
        {
            Method: 'DELETE',
            URL: `${localURL}/${route}/${id}`
        }
    ]
    return response;

}

function replyPatch(route, id){
    const response = [
        {
            Method: 'GET',
            URL: `${localURL}/${route}`
        },
        {
            Method: 'POST',
            URL: `${localURL}/${route}`
        },
        {
            Method: 'GET',
            URL: `${localURL}/${route}/${id}`
        },
        {
            Method: 'DELETE',
            URL: `${localURL}/${route}/${id}`
        }
    ]
    return response;

}


function replyUsage(route){
    const response = [
        {
            Method: 'GET',
            URL: `${localURL}/${route}`
        },
        {
            Method: 'POST',
            URL: `${localURL}/${route}`
        },
        {
            Method: 'GET',
            URL: `${localURL}/${route}/_id`
        },
        {
            Method: 'PATCH',
            URL: `${localURL}/${route}/_id`
        },
        {
            Method: 'DELETE',
            URL: `${localURL}/${route}/_id`
        }
    ]
    return response;
}