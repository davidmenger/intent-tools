/*
 * @author David Menger
 */
'use strict';

const xmlNodes = require('xml-nodes');
const xmlObjects = require('xml-objects');
const eventStream = require('event-stream');
const fs = require('fs');
const filters = require('./filters');
const Pipeline = require('./Pipeline');

/**
 * Create a pretrained word vectors learning set from Wikipedia XML dump
 *
 * @param {string|ReadableStream} input - path of Rasa intent set or stream
 * @param {string|Writable} output - path or stream to write fast-text learning set
 * @param {Function} [mapFn] - text normalizer function
 * @returns {Promise}
 */
function wikiToText (input, output, mapFn = null) {
    let inp;
    let out;
    const map = mapFn || filters.normalize;

    if (typeof input === 'string') {
        inp = fs.createReadStream(input);
    } else {
        inp = input;
    }

    if (typeof output === 'string') {
        out = fs.createWriteStream(output, { encoding: 'utf8' });
    } else {
        out = output;
    }

    const pipes = new Pipeline();

    pipes.add(inp);

    pipes.add(xmlNodes('page'));

    pipes.add(xmlObjects({
        explicitRoot: false,
        explicitArray: false,
        mergeAttrs: true
    }));

    let cleanText;
    pipes.add(eventStream.mapSync((r) => {
        cleanText = (r.revision.text._ || '')
            .replace(/(<([^>]+)>)/ig, '')
            .replace(/\{\|.+?\|\}/g, '');

        return `${map(r.title)} ${map(cleanText)}\n`;
    }));

    pipes.add(out);

    return pipes.promise();
}

module.exports = wikiToText;
