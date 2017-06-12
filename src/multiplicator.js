/*
 * @author David Menger
 */
'use strict';

const assert = require('assert');

function expand (combinations, vector) {
    if (combinations.length === 0) {
        return vector.map(w => [w]);
    }
    return combinations
        .reduce((ret, combination) => {
            vector.forEach((word) => {
                ret.push([...combination, word]);
            });
            return ret;
        }, []);
}

function tokenizeText (intent) {
    let start = 0;
    let end;
    const tokens = [];

    for (let i = 0; i <= intent.entities.length; i++) {
        if (i < intent.entities.length) {
            end = intent.entities[i].start;
        } else {
            end = undefined;
        }

        tokens.push(intent.text.slice(start, end));

        if (i < intent.entities.length) {
            start = intent.entities[i].end;
        }
    }

    return tokens;
}

function generateOptions (intent, combinations) {
    const tokens = tokenizeText(intent);
    const expectedWordsLength = tokens.length - 1;
    const join = new Array(tokens.length + expectedWordsLength);
    let i;
    let pos;
    for (i = 0; i < tokens.length; i++) {
        pos = i * 2;
        join[pos] = tokens[i];
    }
    return combinations.map((words) => {
        assert(words.length === expectedWordsLength);
        for (i = 0; i < words.length; i++) {
            pos = i * 2;
            join[pos + 1] = words[i];
        }
        const text = join.join('');

        return Object.assign({}, intent, {
            text,
            entities: [] // not necessary now
        });
    });
}

function multiplicator (intent, getVariants) {
    if (!Array.isArray(intent.entities)) {
        return Promise.resolve([intent]);
    }

    intent.entities.sort((a, b) => (a.start < b.start ? -1 : 1));

    const variantsPromise = intent.entities
        .map(entity => getVariants(entity.entity, entity.value));

    return Promise.all(variantsPromise)
        .then((variants) => {
            const combinations = variants
                .reduce((c, entityVariants) => expand(c, entityVariants), []);

            return generateOptions(intent, combinations);
        });
}

module.exports = {
    multiplicator
};
