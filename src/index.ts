import { createReadStream, createWriteStream } from 'fs';
import { createStream as createXMLStream } from 'sax';

const inputFilePath = './data/eng-kjv2006_usfx/eng-kjv2006_usfx.xml';
const outputFilePath = './data/output.txt';
const outputStream = createWriteStream(outputFilePath);

const xmlParser = createXMLStream(false, { lowercase: true });

const knownTags = {
  p: 'p'
};

const isInStanza = false;
const output: any[] = [];
const unknownTags = new Set();

function addCommand(type, ...props): void {
  output.push({ type, ...props });
}

function write(): void {
  outputStream.write(JSON.stringify(output, null, 2));
}

const command = {
  break: 'break',
  lineBreak: 'line break',
  lineText: 'line text',
  paragraphStart: 'paragraph start',
  paragraphEnd: 'paragraph end',
  paragraphText: 'paragraph text',
  stanzaStart: 'stanza start',
  stanzaEnd: 'stanza end'
};

xmlParser.on('error', e => {
  console.error('!ERROR!');
  console.error(e);
});

xmlParser.on('text', function() {
  if (isInStanza) {
    addCommand(command.lineText);
    return;
  }

  addCommand(command.paragraphText);
});

xmlParser.on('opentag', ({ name, attributes }) => {
  if (!(name in knownTags)) {
    unknownTags.add(name);
    return;
  }

  switch (name) {
    case knownTags.p:
      addCommand(command.paragraphStart);
  }
});

xmlParser.on('closetag', name => {
  if (!(name in knownTags)) {
    unknownTags.add(name);
    return;
  }

  switch (name) {
    case knownTags.p:
      addCommand(command.paragraphEnd);
  }
});

// xmlParser.on('attribute', ({ name, value }) => {
//   console.log({ attribute });
// });

xmlParser.on('end', write);

createReadStream(inputFilePath).pipe(xmlParser);
