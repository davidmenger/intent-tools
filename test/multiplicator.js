/*
 * @author David Menger
 */
'use strict';

const assert = require('assert');
const { multiplicator } = require('../src/multiplicator');

function getTexts () {
    return ['fox', 'dog', 'cat', 'mouse'];
}

describe('#multiplicator()', function () {

    it('should multiplicate single sentence into multiple sentences', function () {
        return multiplicator({
            text: 'The quick brown fox jumps over the lazy dog',
            intent: 'some',
            entities: [{
                start: 16,
                end: 19,
                value: 'fox',
                entity: 'animal'
            }, {
                start: 40,
                end: 43,
                value: 'dog',
                entity: 'animal'
            }]
        }, getTexts)
            .then((res) => {
                assert.equal(res.length, 16);
            });
    });

});
