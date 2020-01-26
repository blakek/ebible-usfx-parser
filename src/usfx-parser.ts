import * as fs from 'fs';
import * as sax from 'sax';
import { Node } from './nodes';
import { state, updateState } from './state';

export function parseFile(inputFile: fs.PathLike): Promise<Node> {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(inputFile);
    const xmlParser = sax.createStream(false, { lowercase: true });

    xmlParser.on('error', reject);

    xmlParser.on('opentag', tag => {
      updateState({
        type: tag.name,
        attributes: tag.attributes,
        isBeginning: true
      });
    });

    xmlParser.on('closetag', tagName => {
      if (xmlParser._parser.tag.isSelfClosing) return;

      updateState({ type: tagName, isBeginning: false });
    });

    xmlParser.on('text', text => {
      updateState({ type: 'text', value: text });
    });

    xmlParser.on('end', () => {
      resolve(state.syntaxTree);
    });

    input.pipe(xmlParser);
  });
}
