# Intent tools

Tools for processing intents from RASA JSONs to Facebook fast-text learning sets.

Because there is good GUI: [Rasa NLU Trainer](https://rasahq.github.io/rasa-nlu-trainer/)

## CLI Usage

  - **Convert RASA json to fast-text learning set**

```bash
$ intools jsonToText ./testData.json ./testData.txt
```

  - **Convert RASA json to fast-text learning set and multiply by entities**

```bash
$ intools jsonToText -m ./testData.json ./testData.txt
```

  - **Make word vectors learning set from wiki XML export**

```bash
$ intools wikiToText ./testData.xml ./testData.txt
```
-----------------

# API
## Classes

<dl>
<dt><a href="#MultiplicatorStream">MultiplicatorStream</a></dt>
<dd></dd>
<dt><a href="#MultiplicatorStream">MultiplicatorStream</a></dt>
<dd></dd>
<dt><a href="#Pipeline">Pipeline</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#jsonToText">jsonToText(input, output, [pipeline], [mapFn])</a> ⇒ <code>Promise</code></dt>
<dd><p>Create fast-text learning set from Rasa intents json</p>
</dd>
<dt><a href="#wikiToText">wikiToText(input, output, [mapFn])</a> ⇒ <code>Promise</code></dt>
<dd><p>Create a pretrained word vectors learning set from Wikipedia XML dump</p>
</dd>
<dt><a href="#normalize">normalize(str)</a></dt>
<dd><p>Preserves only letters (with or withour diacritics) and makes everything lowercased</p>
</dd>
</dl>

<a name="MultiplicatorStream"></a>

## MultiplicatorStream
**Kind**: global class

* [MultiplicatorStream](#MultiplicatorStream)
    * [new MultiplicatorStream()](#new_MultiplicatorStream_new)
    * [new MultiplicatorStream(getVariants)](#new_MultiplicatorStream_new)

<a name="new_MultiplicatorStream_new"></a>

### new MultiplicatorStream()
Multiplicates a learning set data with available entities information

**Example**
```javascript
const path = require('path');
const { EntitiesFromJson, MultiplicatorStream, jsonToText } = require('intent-tools');

const from = path.resolve(process.cwd(), 'sample.json');
const to = path.resolve(process.cwd(), 'trainingData.txt');

const entities = new main.EntitiesFromJson(from);

const pipeline = [
    new MultiplicatorStream((cat, word) => entities.getWordList(cat, word))
];

entities.loadEntities()
    .then(() => main.jsonToText(from, to, pipeline))
    .catch(e => console.error(e));
```
<a name="new_MultiplicatorStream_new"></a>

### new MultiplicatorStream(getVariants)

| Param | Type |
| --- | --- |
| getVariants | <code>function</code> |

<a name="MultiplicatorStream"></a>

## MultiplicatorStream
**Kind**: global class

* [MultiplicatorStream](#MultiplicatorStream)
    * [new MultiplicatorStream()](#new_MultiplicatorStream_new)
    * [new MultiplicatorStream(getVariants)](#new_MultiplicatorStream_new)

<a name="new_MultiplicatorStream_new"></a>

### new MultiplicatorStream()
Multiplicates a learning set data with available entities information

**Example**
```javascript
const path = require('path');
const { EntitiesFromJson, MultiplicatorStream, jsonToText } = require('intent-tools');

const from = path.resolve(process.cwd(), 'sample.json');
const to = path.resolve(process.cwd(), 'trainingData.txt');

const entities = new main.EntitiesFromJson(from);

const pipeline = [
    new MultiplicatorStream((cat, word) => entities.getWordList(cat, word))
];

entities.loadEntities()
    .then(() => main.jsonToText(from, to, pipeline))
    .catch(e => console.error(e));
```
<a name="new_MultiplicatorStream_new"></a>

### new MultiplicatorStream(getVariants)

| Param | Type |
| --- | --- |
| getVariants | <code>function</code> |

<a name="Pipeline"></a>

## Pipeline
**Kind**: global class

* [Pipeline](#Pipeline)
    * [new Pipeline()](#new_Pipeline_new)
    * [.add(pipe)](#Pipeline+add) ⇒ <code>this</code>
    * [.promise()](#Pipeline+promise) ⇒ <code>promise</code>

<a name="new_Pipeline_new"></a>

### new Pipeline()
Simple tool, which creates a Promise from pipeline of streams

<a name="Pipeline+add"></a>

### pipeline.add(pipe) ⇒ <code>this</code>
Append a stream

**Kind**: instance method of [<code>Pipeline</code>](#Pipeline)

| Param | Type | Description |
| --- | --- | --- |
| pipe | <code>ReadableStream</code> \| <code>Writable</code> | the transform stream |

<a name="Pipeline+promise"></a>

### pipeline.promise() ⇒ <code>promise</code>
Get a promise

**Kind**: instance method of [<code>Pipeline</code>](#Pipeline)
<a name="jsonToText"></a>

## jsonToText(input, output, [pipeline], [mapFn]) ⇒ <code>Promise</code>
Create fast-text learning set from Rasa intents json

**Kind**: global function

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>string</code> \| <code>ReadableStream</code> |  | path of Rasa intent set or stream |
| output | <code>string</code> \| <code>Writable</code> |  | path or stream to write fast-text learning set |
| [pipeline] | <code>Array</code> |  | array of transform streams to modify the learning set |
| [mapFn] | <code>function</code> | <code></code> | text normalizer function |

**Example**
```javascript
const path = require('path');
const { jsonToText } = require('intent-tools');

const from = path.resolve(process.cwd(), 'sample.json');
const to = path.resolve(process.cwd(), 'trainingData.txt');

main.jsonToText(from, to)
    .catch(e => console.error(e));
```
<a name="wikiToText"></a>

## wikiToText(input, output, [mapFn]) ⇒ <code>Promise</code>
Create a pretrained word vectors learning set from Wikipedia XML dump

**Kind**: global function

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>string</code> \| <code>ReadableStream</code> |  | path of Rasa intent set or stream |
| output | <code>string</code> \| <code>Writable</code> |  | path or stream to write fast-text learning set |
| [mapFn] | <code>function</code> | <code></code> | text normalizer function |

<a name="normalize"></a>

## normalize(str)
Preserves only letters (with or withour diacritics) and makes everything lowercased

**Kind**: global function
**Returs**: <code>string</code>

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | input string |

