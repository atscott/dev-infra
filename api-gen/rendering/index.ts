import {readFileSync, writeFileSync} from 'fs';
import path from 'path';
import {DocEntry} from './entities';
import {processEntryForRender} from './processing';
import {renderEntry} from './rendering';

/** The JSON data file format for extracted API reference info. */
interface EntryList {
  entries: DocEntry[];
}

/** Aggregate all JSON data source files into an array of docs entries. */
function aggregateEntries(srcs: string[]): DocEntry[] {
  return srcs.reduce((entries: DocEntry[], jsonDataFilePath: string) => {
    const fileContent = readFileSync(jsonDataFilePath, {encoding: 'utf8'});
    return entries.concat((JSON.parse(fileContent) as EntryList).entries) as DocEntry[];
  }, []);
}

function main() {
  const [srcs, outputFilenameExecRootRelativePath] = process.argv.slice(2);

  // Docs rendering happens in three phases that occur here:
  // 1) Aggregate all the raw extracted doc info.
  // 2) Transform the raw data to a renderable state.
  // 3) Render to HTML.

  // Each data file contains an array of entries,
  // so we aggregate the entries of all input data files.
  const entries = aggregateEntries(srcs.split(','));

  // Transform the data from its raw extracted form to its renderable form.
  // This includes any content processors such as markdown → html.
  const renderEntries = entries.map(processEntryForRender);

  // Render the processed data into the final HTML documents.
  const htmlOutputs = renderEntries.map(renderEntry);

  for (let i = 0; i < htmlOutputs.length; i++) {
    // TODO: de-duplicate identifiers by incorporating package entry point.
    const filename = `${renderEntries[i].name}.html`;
    writeFileSync(path.join(outputFilenameExecRootRelativePath, filename), htmlOutputs[i], {
      encoding: 'utf8',
    });
  }
}

main();