/*
 * @author David Menger
 */
'use strict';

const { Transform } = require('stream');
const { multiplicator } = require('./multiplicator');

/**
 * Multiplicates a learning set data with available entities information
 *
 * @class MultiplicatorStream
 * @example
 * const path = require('path');
 * const { EntitiesFromJson, MultiplicatorStream, jsonToText } = require('intent-tools');
 *
 * const from = path.resolve(process.cwd(), 'sample.json');
 * const to = path.resolve(process.cwd(), 'trainingData.txt');
 *
 * const entities = new main.EntitiesFromJson(from);
 *
 * const pipeline = [
 *     new MultiplicatorStream((cat, word) => entities.getWordList(cat, word))
 * ];
 *
 * entities.loadEntities()
 *     .then(() => main.jsonToText(from, to, pipeline))
 *     .catch(e => console.error(e));
 */
class MultiplicatorStream extends Transform {

    /**
     *
     * @param {Function} getVariants
     */
    constructor (getVariants = (category, w) => [w]) {
        super({ objectMode: true });

        this._getVariants = getVariants;
    }

    _transform (data, enc, callback) {
        multiplicator(data, this._getVariants)
            .then((variants) => {
                variants.forEach(variant => this.push(variant));
                callback();
            })
            .catch(callback);
    }

}

module.exports = MultiplicatorStream;
