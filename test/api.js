const test = require('ava');
const api = require('../source/api');

test('get a single rant', t => {

    return api.getRant(33434).then(rant => {
        t.truthy(typeof rant === 'object');
    });
});

test('get a list of rants', t => {

    return api.getRants().then(rants => {
        t.truthy(rants.length > 0);
    });
});

test('search for a term on devRant', t => {

    return api.search('php').then(results => {
        t.truthy(results.length > 0);
    });
});

test('get a surprise rant', t => {

    return api.getSurpriseRant().then(rant => {
        t.truthy(typeof rant === 'object');
    });
});

test('get the weekly rants', t => {

    return api.getWeeklyRants().then(rants => {
        t.truthy(rants.length > 0);
    });
});
