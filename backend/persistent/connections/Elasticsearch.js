import {parseElasticsearch} from '../../parse';
import fetch from 'node-fetch';

function request(relativeUrl, credentials, {body, method}) {
    const {host, port, username, password} = credentials;
    const url = `${host}:${port}/${relativeUrl}?format=json`;
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    if (username && password) {
        headers['Authorization'] = 'Basic ' + new Buffer(
            username + ':' + password
        ).toString('base64');
    }
    return fetch(url, {
        headers,
        method,
        body: body ? JSON.stringify(body) : null
    });
}

export function connect(credentials) {
    const {index} = credentials;
    return request(`_cat/indices/${index}`, credentials, {method: 'GET'});
}

export function query(queryObject, credentials) {
    const {index} = credentials;
    return request(`${index}/_search`, credentials, {body: queryObject, method: 'POST'})
    .then(res => res.json().then(results => {
        if (res.status === 200) {
            return parseElasticsearch(results.hits.hits)
        } else {
            throw new Error(results);
        }
    }));
}

export function elasticsearchMappings(credentials) {
    const {index} = credentials;
    return request(`${index}/_mappings`, credentials, {method: 'GET'});
}