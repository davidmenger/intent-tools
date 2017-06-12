#!/usr/bin/env node
/*
 * @author David Menger
 */
'use strict';

const vorpal = require('vorpal')();
const path = require('path');
const main = require('../main');

const chalk = vorpal.chalk;

function errorHandler (ctx, s) {
    return (e) => {
        if (s) {
            s.stop(true);
        }
        ctx.log(chalk.red(`\nError: ${e.message}`));
        if (Array.isArray(e.errors)) {
            e.errors.forEach(err => ctx.log(chalk.yellow(` ${err.dataPath}: ${err.message}`)));
        }
    };
}

vorpal
    .command('jsonToText <fromJson> <toText>')
    .description(chalk.blue('Convert JSON to text format'))
    .option('-m, --multiply', 'Multiply the learning set with entities')
    .action(function (args) {
        const from = path.resolve(process.cwd(), args.fromJson);
        const to = path.resolve(process.cwd(), args.toText);

        const pipeline = [];
        let promise = Promise.resolve();

        if (args.options.multiply) {
            const entities = new main.EntitiesFromJson(from);

            promise = entities.loadEntities();

            pipeline.push(new main.MultiplicatorStream(
                (cat, w) => entities.getWordList(cat, w)
            ));
        }

        return promise
            .then(() => main.jsonToText(from, to, pipeline))
            .then(() => this.log(chalk.green('Done!')))
            .catch(errorHandler(this));
    });

vorpal
    .command('wikiToText <fromJson> <toText>')
    .description(chalk.blue('Convert JSON to text format'))
    .action(function (args) {
        const from = path.resolve(process.cwd(), args.fromJson);
        const to = path.resolve(process.cwd(), args.toText);

        main.wikiToText(from, to)
            .then(() => this.log(chalk.green('Done!')))
            .catch(errorHandler(this));
    });

vorpal
    .catch('[words...]', 'Catches incorrect commands')
    .action(function (args) {
        if (args.words) {
            const cmd = args.words.join(' ');
            this.log(`${cmd} is not a valid command.`);
            return null;
        }
        return vorpal.execSync('help');
    });

vorpal
    .delimiter('')
    .show()
    .parse(process.argv);
