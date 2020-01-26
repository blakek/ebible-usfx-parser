import test from 'ava';
import { bookVerseCount } from './book-meta';
import { isNodeOfType, nodes, State, TagNode } from './state';
import { parseFile } from './usfx-parser';

let output: State;

function books(): TagNode[] {
  return output.syntaxTree.children.filter(isNodeOfType(nodes.book));
}

function chaptersForBook(book: TagNode): TagNode[] {
  return book.children.filter(isNodeOfType(nodes.c));
}

// function versesForChapter(chapter: TagNode): TagNode[] {
//   // Left off - need to walk tree and find nodes.
//   // Verse nodes may be nested within other nodes (e.g. `p`)
//   return chapter.children.filter(isNodeOfType(nodes.v));
// }

// The output file is large and takes a while to load, so it's just created once
// for the tests.
test.before('create output', () => {
  return parseFile('./data/eng-kjv2006_usfx/eng-kjv2006_usfx.xml').then(obj => {
    output = obj;
  });
});

test('parseFile creates a state object from a USFX file', t => {
  t.is(typeof output, 'object');
  t.truthy(output.path);
  t.truthy(output.syntaxTree);
  t.truthy(output.unknownTags);
});

test('has the correct number of books', t => {
  const bookCount = books().length;
  t.is(bookCount, bookVerseCount.length);
});

test('has the correct number of chapters per book', t => {
  books().forEach((book, index) => {
    const expectedChapterCount = bookVerseCount[index][1].length;
    const actualChapterCount = chaptersForBook(book).length;
    t.is(actualChapterCount, expectedChapterCount, `Failed at index ${index}`);
  });
});

// test('has the correct number of verses per chapter', t => {
//   books().forEach((book, bookIndex) => {
//     chaptersForBook(book).forEach((chapter, chapterIndex) => {
//       const expectedVerseCount = bookVerseCount[bookIndex][1][chapterIndex];
//       const actualVerseCount = versesForChapter(chapter).length;

//       t.log({ children: chapter.children });

//       if (actualVerseCount !== expectedVerseCount)
//         throw Error(`${actualVerseCount} !== ${expectedVerseCount}`);

//       t.is(
//         actualVerseCount,
//         expectedVerseCount,
//         `Failed on book ${bookIndex}, chapter ${chapterIndex}`
//       );
//     });
//   });
// });
