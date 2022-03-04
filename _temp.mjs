import { selectAll } from 'unist-util-select';
import { inspect } from 'util';
import data from './data/output.json';

function pipe(...[fn, ...fns]) {
  // All arguments have been exhausted
  if (fns.length === 0) {
    return fn;
  }

  // Reduce arguments
  return (...args) => {
    const value = fn(...args);

    if (value instanceof Promise) {
      return Promise.resolve(value).then(value => pipe(...fns)(value));
    }

    return pipe(...fns)(value);
  };
}

pipe(
  () => selectAll('book[id=GEN] chapter[id=1] verse[id=1] text', data),
  // textNodes => textNodes.map(n => n.value).join(''),
  tree => console.log(inspect(tree, false, 2, true))
)();
