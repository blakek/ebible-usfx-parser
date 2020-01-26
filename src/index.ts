import { promises as fs } from 'fs';
import { parseFile } from './usfx-parser';

const inputFile = './data/eng-kjv2006_usfx/eng-kjv2006_usfx.xml';
const outputFile = './data/output.txt';

parseFile(inputFile)
  .then(JSON.stringify)
  .then(syntaxTree => fs.writeFile(outputFile, syntaxTree));
