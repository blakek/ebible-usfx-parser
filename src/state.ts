import { set } from '@blakek/deep';
import { Node, USFXNodeType } from './nodes';

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

function stateStartChildren(): void {
  state.path.push('children', '0');
}

function stateEndChildren(): void {
  state.path.splice(state.path.length - 2);
}

function stateNextChild(): void {
  const lastElement = parseInt(state.path[state.path.length - 1]);
  state.path[state.path.length - 1] = (lastElement + 1).toString();
}

function stateNextSibling(): void {
  // Does the current node have children?
  const currentHasChildren = state.path.slice(-2, -1)[0] === 'children';

  if (currentHasChildren) {
    stateEndChildren();
  }

  stateNextChild();
}

function addChildToState(
  nodeType: USFXNodeType,
  props?: Record<string, unknown>,
  children?: unknown[]
): void {
  const newNode = {
    type: nodeType,
    ...props,
    ...(children && { children })
  };

  set(newNode, state.path, state.syntaxTree);

  if (children !== undefined) {
    stateStartChildren();
  }
}

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
        addChildToState(USFXNodeType[action.type], action.attributes, []);
        break;
      }

      // HACK: clean up path since chapters don't have an ending tag.
      if (action.type === 'book') {
        state.path.splice(2);
        stateNextChild();
        break;
      }

      stateNextSibling();
      break;

    case 'b':
      addChildToState(USFXNodeType.b);
      stateNextChild();
      break;

    case 'c':
      // HACK: clean up path since chapters don't have an ending tag.
      if (action.attributes.id !== '1') {
        stateNextSibling();
      }

      addChildToState(USFXNodeType.c, action.attributes, []);
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
      if (state.textAction === TextActions.Ignore) {
        break;
      }

      // Handle when text should set the language code
      if (state.textAction === TextActions.SetLanguageCode) {
        set(action.value, 'attributes.languageCode', state.syntaxTree);
        break;
      }

      // Create a new text node
      addChildToState(USFXNodeType.text, { value: action.value });
      stateNextChild();
      break;

    case 've':
      // Verse ends should close the verse object
      stateNextSibling();
      break;

    // Ignore these tags and their text content
    case 'f':
    case 'fr':
    case 'ft':
    case 'h':
    case 'id':
    case 's':
    case 'tl':
    case 'toc':
      if (action.isTagOpen) {
        state.textAction = TextActions.Ignore;
      } else {
        state.textAction = TextActions.CreateNode;
      }

      break;

    // Ignore these tags, but not their contents
    case 'nd':
    case 'usfx':
      break;

    default:
      state.unknownTags.add(action.type);
  }
}
