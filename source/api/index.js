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
 * @param limit The maximum results to return.
 *
 * @return Promise Returns the callback.
 */
export const search = (term, limit) => {
    
    return new Promise((resolve, reject) => {
        
        baseRequest.get({
        
            qs: {term, limit},
            url: 'https://www.devrant.io/api/devrant/search'
        
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
 * @param skip The number of results to skip.
 * @param limit The maximum results to return.
 * @param sort The algorithm in which results are sorted.
 * 
 * @return Promise Returns the callback.
 */
export const getRants = (skip, limit, sort) => {
    
    return new Promise((resolve, reject) => {
        
        baseRequest.get({

            url: 'https://www.devrant.io/api/devrant/rants',
            qs: {
                skip,
                sort,
                limit
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
