/*
 * @author David Menger
 */
'use strict';

const jsonToText = require('./src/jsonToText');
const wikiToText = require('./src/wikiToText');
const EntitiesFromJson = require('./src/EntitiesFromJson');
const MultiplicatorStream = require('./src/MultiplicatorStream');
const Pipeline = require('./src/Pipeline');
const { normalize } = require('./src/filters');


module.exports = {
    jsonToText,
    wikiToText,
    EntitiesFromJson,
    MultiplicatorStream,
    Pipeline,
    normalize
};
