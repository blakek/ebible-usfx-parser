import * as unist from 'unist';
import { selectAll } from 'unist-util-select';

export interface Node extends unist.Node {
  type: string;
  attributes?: object;
  children?: Node[];
  value?: string;
}

export const filterNodes = (rootNode: Node, nodeType: USFXNodeType): Node[] =>
  selectAll(nodeType, rootNode);

export enum USFXNodeType {
  add = 'addedText',
  b = 'blankLine',
  book = 'book',
  c = 'chapter',
  d = 'psalmTitle',
  languagecode = 'languageCode',
  nd = 'unknown_nd',
  p = 'paragraph',
  q = 'poetryStanza',
  text = 'text',
  usfx = 'root',
  v = 'verse',
  w = 'wordAttributes',
  wj = 'wordsOfJesus'
}
