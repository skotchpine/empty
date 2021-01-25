/**
 * @jest-environment node
 */
import compiler from './compiler.js';
import fs from 'fs';
import path from 'path';

// Get all the files from the './cases' directory
const files = fs.readdirSync(path.join(__dirname, 'cases'))

// Build a table of test cases (use an object for O(1) row lookup)
const table = files.reduce((t, file) => {
  // Turn '01-test.mt' and '01-test.js' into 'test' (the name of the test)
  const name = file.replace(/\..*/i, '').replace(/\d+-/i, '');

  // Let's call the '*.mt' file the "source"
  const isSource = file.endsWith('.mt');

  // If we don't already have a row for this name, start a new one
  if (!t[name]) t[name] = {};

  // When we have a "source" file, save it as "sourceFile", otherwise as "expectedFile"
  t[name][isSource ? 'sourceFile' : 'expectedFile'] = file;

  // Continue configuring the table with other filenames
  return t;
}, {});

// For every row in the table, run a new test case
test.each(Object.values(table))('cases', async ({sourceFile, expectedFile}) => {
  // Read the expected file from the test case (fail if no expected file is available)
  const expected = fs.readFileSync(path.join(__dirname, 'cases', expectedFile), 'utf-8', 'r+')
  
  // Compile the source file
  const stats = await compiler(path.join('cases', sourceFile), {});
  // We only care to test the "source" attribute from the results
  const result = stats.toJson({source: true}).modules[0].source;

  // The test passes if the compiler created a matching file
  expect(result).toBe(expected);
});