/*
 * @author David Menger
 */
'use strict';

const fs = require('fs');
const JSONStream = require('JSONStream');
const eventStream = require('event-stream');
const Pipeline = require('./Pipeline');

/**
 * Extracts entities from Rasa learning set
 *
 * @class EntitiesFromJson
 */
class EntitiesFromJson {

    /**
     *
     * @param {string|ReadableStream} input - path of json file or readable stream
     */
    constructor (input) {
        this._setMap = new Map();
        if (typeof input === 'string') {
            this._inputStream = fs.createReadStream(input, { encoding: 'utf8' });
        } else {
            this._inputStream = input;
        }
    }

    /**
     * Process entities loading (reads the stream)
     *
     * @returns {Promise}
     */
    loadEntities () {
        const pipes = new Pipeline();

        pipes.add(this._inputStream);

        pipes.add(eventStream.mapSync(data => data.toString().replace(/^\s|\s+$/g, ' ')));

        pipes.add(JSONStream.parse('rasa_nlu_data.common_examples.*'));

        pipes.add(eventStream.mapSync((data) => {
            if (!Array.isArray(data.entities)) {
                return data;
            }
            let set;
            data.entities.forEach((entity) => {
                set = this._setMap.get(entity.entity);
                if (!set) {
                    set = new Set();
                    this._setMap.set(entity.entity, set);
                }
                set.add(entity.value);
            });

            return data;
        }));

        return pipes.promise()
            .then(() => this._normalizeMap());
    }

    _normalizeMap () {
        let key;
        for (key of this._setMap.keys()) {
            this._setMap.set(key, Array.from(this._setMap.get(key)));
        }
    }

    /**
     * Get list of words in category
     *
     * @param {string} type - the entity name (category)
     * @param {string} [word] - current value
     * @returns {string[]}
     */
    getWordList (type, word) {
        return this._setMap.get(type) || [word];
    }
}

module.exports = EntitiesFromJson;
