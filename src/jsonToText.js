/*
 * @author David Menger
 */
'use strict';

const fs = require('fs');
const JSONStream = require('JSONStream');
const eventStream = require('event-stream');
const filters = require('./filters');
const Pipeline = require('./Pipeline');

/**
 * Create fast-text learning set from Rasa intents json
 *
 * @param {string|ReadableStream} input - path of Rasa intent set or stream
 * @param {string|Writable} output - path or stream to write fast-text learning set
 * @param {Array} [pipeline] - array of transform streams to modify the learning set
 * @param {Function} [mapFn] - text normalizer function
 * @returns {Promise}
 *
 * @example
 * const path = require('path');
 * const { jsonToText } = require('intent-tools');
 *
 * const from = path.resolve(process.cwd(), 'sample.json');
 * const to = path.resolve(process.cwd(), 'trainingData.txt');
 *
 * main.jsonToText(from, to)
 *     .catch(e => console.error(e));
 */
function jsonToText (input, output, pipeline = [], mapFn = null) {
    let inp;
    let out;
    const map = mapFn || filters.normalize;

    if (typeof input === 'string') {
        inp = fs.createReadStream(input, { encoding: 'utf8' });
    } else {
        inp = input;
    }

    if (typeof output === 'string') {
        out = fs.createWriteStream(output);
    } else {
        out = output;
    }

    const pipes = new Pipeline();
    let tag;
    let mapped;

    pipes.add(inp);

    pipes.add(eventStream.mapSync(data => data.toString().replace(/^\s|\s+$/g, ' ')));

    pipes.add(JSONStream.parse('rasa_nlu_data.common_examples.*'));


    if (pipeline) {
        pipes.add(pipeline);
    }

    pipes.add(eventStream.mapSync((data) => {
        tag = `__label__${data.intent}`;
        mapped = map(data.text);
        return `${tag} ${mapped}\n`;
    }));

    pipes.add(out);

    return pipes.promise();
}

module.exports = jsonToText;
