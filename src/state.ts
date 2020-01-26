import { set } from 'dot-prop';
import { Node } from 'unist';
import { inspect } from 'util';

export interface TagNode extends Node {
  type: string;
  attributes?: object;
  children?: TagNode[];
  name?: string;
  value?: string;
}

export const knownTags = [
  'add',
  'b',
  'book',
  'c',
  'd',
  'f',
  'fr',
  'ft',
  'h',
  'id',
  'languagecode',
  'nd',
  'p',
  'q',
  's',
  'tl',
  'toc',
  'usfx',
  'v',
  've',
  'w',
  'wj'
];

export interface State {
  path: string[];
  syntaxTree: TagNode;
  unknownTags: Set<string>;
}

export const state: State = {
  path: ['children', '0'],
  syntaxTree: {
    type: 'root',
    children: []
  },
  unknownTags: new Set()
};

export function dumpState(): string {
  const output = {
    path: state.path,
    syntaxTree: state.syntaxTree,
    unknownTags: Array.from(state.unknownTags)
  };

  return JSON.stringify(output, null, 2);
}

export const filterNodes = (
  rootNode: TagNode,
  filterNode: TagNode
): TagNode[] => selectAll(`[name=${filterNode.name}]`, rootNode);

export const nodes: { [key: string]: TagNode } = {
  add: { type: 'element', name: 'add' },
  b: { type: 'element', name: 'b' },
  book: { type: 'element', name: 'book' },
  c: { type: 'element', name: 'c' },
  d: { type: 'element', name: 'd' },
  f: { type: 'element', name: 'f' },
  fr: { type: 'element', name: 'fr' },
  ft: { type: 'element', name: 'ft' },
  h: { type: 'element', name: 'h' },
  id: { type: 'element', name: 'id' },
  languagecode: { type: 'element', name: 'languagecode' },
  nd: { type: 'element', name: 'nd' },
  p: { type: 'element', name: 'p' },
  q: { type: 'element', name: 'q' },
  s: { type: 'element', name: 's' },
  text: { type: 'text' },
  tl: { type: 'element', name: 'tl' },
  toc: { type: 'element', name: 'toc' },
  usfx: { type: 'element', name: 'usfx' },
  v: { type: 'element', name: 'v' },
  ve: { type: 'element', name: 've' },
  w: { type: 'element', name: 'w' },
  wj: { type: 'element', name: 'wj' }
};

type action = {
  type: string;
  isBeginning?: boolean;
  attributes?: any;
  value?: string;
};

function addChildToState(child: TagNode): void {
  set(state.syntaxTree, state.path.join('.'), child);
}

function incrementPointer(): void {
  const lastElement = parseInt(state.path[state.path.length - 1]);
  state.path[state.path.length - 1] = (lastElement + 1).toString();
}

const whitespaceRegExp = /^\s+$/;
const isWhitespace = (value: string): boolean => whitespaceRegExp.test(value);

export function updateState(tag: action): void {
  switch (tag.type) {
    case 'add':
    case 'book':
    case 'd':
    case 'p':
    case 'q':
    case 'v':
    case 'w':
    case 'wj':
      if (tag.isBeginning) {
        addChildToState({
          ...nodes[tag.type],
          ...(tag.attributes && { attributes: tag.attributes }),
          children: []
        });
        state.path.push('children', '0');
      } else {
        // HACK: clean up path since chapters don't have an ending tag.
        if (tag.type === 'book') {
          state.path.splice(2);
          incrementPointer();
        } else {
          state.path.splice(state.path.length - 2);
          incrementPointer();
        }
      }
      break;

    case 'b':
      addChildToState(nodes.b);
      incrementPointer();
      break;

    case 'c':
      // HACK: clean up path since chapters don't have an ending tag.
      if (tag.attributes.id !== '1') {
        state.path.splice(state.path.length - 2);
        incrementPointer();
      }

      addChildToState({
        ...nodes[tag.type],
        ...(tag.attributes && { attributes: tag.attributes }),
        children: []
      });
      state.path.push('children', '0');
      break;

    case 'text':
      if (isWhitespace(tag.value)) break;

      addChildToState({
        ...nodes.text,
        value: tag.value
      });
      incrementPointer();
      break;

    case 've':
      // Verse ends should close the verse object
      state.path.splice(state.path.length - 2);
      incrementPointer();
      break;

    case 'f':
    case 'fr':
    case 'ft':
    case 'h':
    case 'id':
    case 'languagecode':
    case 'nd':
    case 's':
    case 'toc':
    case 'tl':
    case 'usfx':
      break;

    default:
      state.unknownTags.add(tag.type);
  }
}
