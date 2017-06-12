/*
 * @author David Menger
 */
'use strict';

/**
 * Simple tool, which creates a Promise from pipeline of streams
 *
 * @class Pipeline
 */
class Pipeline {

    constructor () {
        this.pipes = [];
        this._promise = new Promise((resolve, reject) => {
            this._onEnd = (err) => {
                this.pipes.forEach((pipe) => {
                    pipe.removeListener('error', this._onEnd);
                });

                this._lastPipe().removeListener('close', this._onEnd);

                this._promise = null;
                this._onEnd = null;

                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            };
        });
    }

    _lastPipe () {
        if (this.pipes.length === 0) {
            return null;
        }
        return this.pipes[this.pipes.length - 1];
    }

    /**
     * Append a stream
     *
     * @param {ReadableStream|Writable} pipe - the transform stream
     * @returns {this}
     */
    add (pipe) {
        if (this._onEnd === null) {
            throw new Error('Pipeline has been used! Create new!');
        }

        if (Array.isArray(pipe)) {
            pipe.forEach(p => this.add(p));
            return this;
        }

        const last = this._lastPipe();

        pipe.on('close', this._onEnd);
        pipe.on('error', this._onEnd);

        if (last !== null) {
            last.removeListener('close', this._onEnd);
            last.pipe(pipe);
        }

        this.pipes.push(pipe);
        return this;
    }

    /**
     * Get a promise
     *
     * @returns {promise}
     */
    promise () {
        return this._promise;
    }

}

module.exports = Pipeline;
