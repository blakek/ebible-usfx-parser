import * as unist from 'unist';
import { selectAll } from 'unist-util-select';

export interface Node extends unist.Node {
  type: string;
  attributes?: object;
  children?: Node[];
  value?: string;
}

export const filterNodes = (rootNode: Node, filterNode: Node): Node[] =>
  selectAll(filterNode.type, rootNode);

export const nodes: Record<string, Node> = {
  add: { type: 'addedText' },
  b: { type: 'blankLine' },
  book: { type: 'book' },
  c: { type: 'chapter' },
  d: { type: 'psalmTitle' },
  f: { type: 'footnote' },
  fr: { type: 'unknown_fr' },
  ft: { type: 'unknown_ft' },
  h: { type: 'shortBookName' },
  id: { type: 'bookIdentifier' },
  languagecode: { type: 'languageCode' },
  nd: { type: 'unknown_nd' },
  p: { type: 'paragraph' },
  q: { type: 'poetryStanza' },
  s: { type: 'sectionHeading' },
  text: { type: 'text' },
  tl: { type: 'unknown_tl' },
  toc: { type: 'tableOfContents' },
  usfx: { type: 'root' },
  v: { type: 'verse' },
  ve: { type: 'unused_verseEnding' },
  w: { type: 'wordAttributes' },
  wj: { type: 'wordsOfJesus' }
};
