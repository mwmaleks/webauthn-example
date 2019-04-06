import superagent from 'superagent';

const request = (options, payload) => new Promise((resolve, reject) => {
    const {
        httpMethod = 'GET',
        url,
        query,
        queryNoCache,
        rawQueryString,
        headers,
        type = 'form',
        attaches = [],
        timeout,
        withCredentials,
        onProgress,
        responseType
    } = options;

    const method = httpMethod.toLowerCase();
    const req = superagent[method](url);

    if (headers) {
        Object.keys(headers).forEach(key => req.set(key, headers[key]));
    }

    if (attaches.length) {
        Object.keys(payload).forEach(key => req.field(key, payload[key]));
    } else {
        req[method === 'get' ? 'query' : 'send'](payload);

        if (type !== 'multipart/form-data') {
            req.type(type);
        }
    }

    if (responseType) {
        req.responseType(responseType);
    }

    req.query(Object.assign({}, queryNoCache, query))
        .query(rawQueryString)
        .timeout({
            response: timeout,
            deadline: timeout * 1.5
        });

    if (withCredentials) {
        req.withCredentials();
    }

    if (onProgress) {
        req.on('progress', onProgress);
    }

    attaches.forEach(file => {
        if (!(file instanceof window.Blob)) {
            return;
        }

        const fileUploadName = file.uploadName || file.name;
        const fileFieldName = file.fieldName || 'file';

        req.attach(fileFieldName, file, encodeURIComponent(fileUploadName));
    });

    req.end((err, response) => {
        if (err) {
            reject(response.body);
        } else {
            resolve(response.body);
        }
    });
});

export default request;
