import { promises as fs } from 'fs';
import { parseFile } from './usfx-parser';

const inputFile = './data/eng-kjv2006_usfx/eng-kjv2006_usfx.xml';
const outputFile = './data/output.json';

parseFile(inputFile)
  .then(output => JSON.stringify(output, null, 2))
  .then(syntaxTree => fs.writeFile(outputFile, syntaxTree));
