import { createReadStream, createWriteStream } from 'fs';
import { createStream as createXMLStream } from 'sax';
import { dumpState, updateState } from './state';

const inputFilePath = './data/eng-kjv2006_usfx/eng-kjv2006_usfx.xml';
const outputFilePath = './data/output.txt';
const input = createReadStream(inputFilePath);
const output = createWriteStream(outputFilePath);

const xmlParser = createXMLStream(false, { lowercase: true });

function write(): void {
  output.write(dumpState());
}

xmlParser.on('error', e => {
  console.error('!ERROR!');
  console.error(e);
});

xmlParser.on('text', text => {
  updateState({
    type: 'text',
    value: text
  });
});

xmlParser.on('opentag', tag => {
  updateState({
    type: tag.name,
    attributes: tag.attributes,
    isBeginning: true
  });
});

xmlParser.on('closetag', tagName => {
  if (xmlParser._parser.tag.isSelfClosing) return;

  updateState({
    type: tagName,
    isBeginning: false
  });
});

xmlParser.on('end', write);

input.pipe(xmlParser);
