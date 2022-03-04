# USFX Parser

> 🎄 Parses [USFX] from [ebible.org] into a JSON-ified syntax tree

🚧 **NOTE:** This is a work-in-progress. I'm checking the output for errors and
iterating when something is found. The output format is very likely to change
so it's simpler to use in real projects. Eventually, I'd like this format to be
easy to segment so individual books could be downloaded as-needed. Any thoughts
or help with development would be appreciated!

This project reads a USFX file and outputs a JavaScript object. The output
follows the [Universal Syntax Tree] format.

The output is a tree with a lot of information. It may take a bit more work to
get information than most simpler Bible formats. However, the primary goal is
accuracy of content.

## Why

I looked all over open-source land for a Bible format that differentiated
between paragraphs, verses, stanza lines, etc.

A majority of formats I found had raw verse text but no formatting information.
Some had detailed formatting information, but were difficult to work with or
would require extra libraries to get basic text. The only project that really
met what I was looking for was [`TehShrike/world-english-bible`]. I wanted more
translations, and that project pointed me to [ebible.org] and its [USFX] format.

## Install

This package has not been published yet. When it is, instructions to install
will be added here.

<!--
Using [Yarn]:

```bash
$ yarn add ebible-usfx-parser
```

…or using [npm]:

```bash
$ npm i --save ebible-usfx-parser
```
-->

## Usage

```js
import fs from 'fs/promises';
import { selectAll } from 'unist-util-select';
import * as usfxParser from 'usfx-parser';

// USFX files available from https://ebible.org/download.php
const inputFile = './eng-kjv2006_usfx.xml';

// Parse the USFX file into a JavaScript object
const bible = await usfxParser.parseFile(inputFile);

// Example: get all books
selectAll('book', bible);
/**
 * [
 *   {
 *     type: 'book',
 *     attributes: { id: 'GEN' },
 *     children: [ ... chpater data ]
 *   },
 *   ... snippet
 * ]
 */
```

## Acknowledgments

- [`tehshrike/world-english-bible`] - for pointing me in the right direction and
  general inspiration for this project
- [ebible.org] - for all the work put into providing the numerous translations
  available
- [@syntax-tree] - for a solid syntax tree standard and awesome tools to go
  along with it

## See Also

coming soon…

## License

MIT

[ebible.org]: https://ebible.org/
[npm]: https://www.npmjs.com/
[`tehshrike/world-english-bible`]: https://github.com/TehShrike/world-english-bible
[universal syntax tree]: https://github.com/syntax-tree/unist
[@syntax-tree]: https://github.com/syntax-tree
[usfx]: https://ebible.org/usfx/
[yarn]: https://yarnpkg.com/
