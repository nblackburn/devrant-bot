import request from 'request';

export const baseRequest = request.defaults({
    json: true,
    gzip: true,
    qs: {
        app: 3
    }
});

/**
 * Search for a particular term.
 * 
 * @param term The term to search for.
 *
 * @return Promise Returns the callback.
 */
export const search = (term) => {
    
    return new Promise((resolve, reject) => {
        
        baseRequest.get({

            url: 'https://www.devrant.io/api/devrant/search',
            qs: {
                limit: 10,
                term: term
            }
        
        }, (error, response, body) => {

            if (error || response.statusCode !== 200 || !body.success) {
                const reason = (!body) ? error : body.error;
                
                reject(reason); 
            }
            
            // Resolve the promise.
            resolve(body.results);
        });
    });
};

/**
 * Get a single rant.
 *
 * @return Promise Returns the callback.
 */
export const getRant = (id) => {

    return new Promise((resolve, reject) => {

        baseRequest.get({

            url: `https://www.devrant.io/api/devrant/rants/${id}`

        }, (error, response, body) => {

            if (error || response.statusCode !== 200 || !body.success) {
                const reason = (!body) ? error : body.error;

                reject(reason);
            }

            // Resolve the promise.
            resolve(body.rant);
        });
    });
};

/**
 * Get a list of all rants.
 *
 * @param sort The algorithm in which results are sorted.
 * 
 * @return Promise Returns the callback.
 */
export const getRants = (sort) => {
    
    return new Promise((resolve, reject) => {
        
        baseRequest.get({

            url: 'https://www.devrant.io/api/devrant/rants',
            qs: {
                limit: 10,
                sort: sort
            }
        
        }, (error, response, body) => {
            
            if (error || response.statusCode !== 200 || !body.success) {
                const reason = (!body) ? error : body.error;
                
                reject(reason); 
            }
            
            // Resolve the promise.
            resolve(body.rants);
        });
    });
};

/**
 * Get a surprise (random) rant.
 *
 * @return Promise Returns the callback.
 */
export const getSurpriseRant = () => {

    return new Promise((resolve, reject) => {

        baseRequest.get({

            url: 'https://www.devrant.io/api/devrant/rants/surprise'

        }, (error, response, body) => {

            if (error || response.statusCode !== 200 || !body.success) {
                const reason = (!body) ? error : body.error;

                reject(reason);
            }

            // Resolve the promise.
            resolve(body.rant);
        });
    });
};

/**
 * Get the rants of the week.
 *
 * @returns {Promise}
 */
export const getWeeklyRants = () => {

    return new Promise((resolve, reject) => {

        baseRequest.get({

            url: 'https://www.devrant.io/api/devrant/weekly-rants',
            qs: {
                limit: 10,
                sort: 'recent'
            }

        }, (error, response, body) => {

            if (error || response.statusCode !== 200 || !body.success) {
                const reason = (!body) ? error : body.error;

                reject(reason);
            }

            // Resolve the promise.
            resolve(body.rants);
        });
    });
};
