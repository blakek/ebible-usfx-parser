import { set } from 'dot-prop';
import { Node, nodes } from './nodes';

enum TextActions {
  CreateNode,
  Ignore,
  SetLanguageCode
}

export interface State {
  path: string[];
  syntaxTree: Node;
  textAction: TextActions;
  unknownTags: Set<string>;
}

export const state: State = {
  path: ['children', '0'],
  syntaxTree: {
    type: 'root',
    children: []
  },
  textAction: TextActions.CreateNode,
  unknownTags: new Set()
};

type Action = {
  type: string;
  isTagOpen?: boolean;
  attributes?: { id?: string };
  value?: string;
};

function addChildToState(child: Node): void {
  set(state.syntaxTree, state.path.join('.'), child);
}

function incrementPointer(): void {
  const lastElement = parseInt(state.path[state.path.length - 1]);
  state.path[state.path.length - 1] = (lastElement + 1).toString();
}

const whitespaceRegExp = /^\s+$/;
const isWhitespace = (value: string): boolean => whitespaceRegExp.test(value);

export function updateState(action: Action): void {
  switch (action.type) {
    case 'add':
    case 'book':
    case 'd':
    case 'p':
    case 'q':
    case 'v':
    case 'w':
    case 'wj':
      if (action.isTagOpen) {
        addChildToState({
          ...nodes[action.type],
          ...(action.attributes && { attributes: action.attributes }),
          children: []
        });
        state.path.push('children', '0');
      } else {
        // HACK: clean up path since chapters don't have an ending tag.
        if (action.type === 'book') {
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
      if (action.attributes.id !== '1') {
        state.path.splice(state.path.length - 2);
        incrementPointer();
      }

      addChildToState({
        ...nodes[action.type],
        ...(action.attributes && { attributes: action.attributes }),
        children: []
      });
      state.path.push('children', '0');
      break;

    case 'languagecode':
      if (action.isTagOpen) {
        state.textAction = TextActions.SetLanguageCode;
      } else {
        state.textAction = TextActions.CreateNode;
      }
      break;

    case 'text':
      // Handle when text should be ignored
      if (
        state.textAction === TextActions.Ignore ||
        isWhitespace(action.value)
      ) {
        break;
      }

      // Handle when text should set the language code
      if (state.textAction === TextActions.SetLanguageCode) {
        set(state.syntaxTree, 'attributes.languageCode', action.value);
        break;
      }

      // Create a new text node
      addChildToState({ ...nodes.text, value: action.value });
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
    case 'nd':
    case 's':
    case 'toc':
    case 'tl':
    case 'usfx':
      break;

    default:
      state.unknownTags.add(action.type);
  }
}
