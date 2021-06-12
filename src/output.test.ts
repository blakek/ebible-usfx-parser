import test from 'ava';
import { bookVerseCount } from './book-meta';
import { filterNodes, Node, USFXNodeType } from './nodes';
import { parseFile } from './usfx-parser';

let output: Node;

const books = (): Node[] => filterNodes(output, USFXNodeType.book);

const chaptersForBook = (book: Node): Node[] =>
  filterNodes(book, USFXNodeType.c);

const versesForChapter = (chapter: Node): Node[] =>
  filterNodes(chapter, USFXNodeType.v);

// The output file is large and takes a while to load, so it's just created once
// for the tests.
test.before('create output', async () => {
  const obj = await parseFile('./data/eng-kjv2006_usfx/eng-kjv2006_usfx.xml');
  output = obj;
});

test('parseFile creates a state object from a USFX file', t => {
  t.is(typeof output, 'object');
  t.is(output.type, 'root');
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

test('has the correct number of verses per chapter', t => {
  books().forEach((book, bookIndex) => {
    chaptersForBook(book).forEach((chapter, chapterIndex) => {
      const expectedVerseCount = bookVerseCount[bookIndex][1][chapterIndex];
      const actualVerseCount = versesForChapter(chapter).length;

      t.is(
        actualVerseCount,
        expectedVerseCount,
        `Differs for book ${bookIndex}, chapter ${chapterIndex}`
      );
    });
  });
});
