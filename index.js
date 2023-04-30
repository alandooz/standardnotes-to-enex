// File to use: backup.txt from StandardNotes unencrypted backup
// Just copy the content text, no media, no tags.
// TO DO: Use a txt file directly or folder with multiple txt files, not only from StandardNotes.

const { writeFileSync, readFileSync } = require('fs');

function formatDate(dateParameter) {
  return dateParameter.replaceAll('-','').replaceAll(':','').split('.')[0]+'Z'
}

function formatText(textParamenter) {
  return (
    textParamenter
    .replace(/^\s+|\s+$/g, '')
    .split("\n")
    .map(phrase => `<div>${phrase === '' ? '<br />' : phrase}</div>`)
    .join('')
  )
}

const data = JSON.parse(readFileSync('./standardnotes/backup.txt', 'utf-8')); // TO DO: Select file of unzipped backup
const notes = data.items
.filter(item => item.content_type === 'Note')
.map(note => {
  return {
    // title: note?.content?.title,  // TO DO: Choose if title or not
    text: note?.content?.text,
    created_at: formatDate(note?.created_at),  // TO DO: Change date
    updated_at: formatDate(note?.updated_at)  // TO DO: Change date
  }
})

const enex = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE en-export SYSTEM "http://xml.evernote.com/pub/evernote-export4.dtd">
<en-export export-date="${formatDate(new Date().toISOString())}" application="Evernote" version="10.55.2">\n`
+
notes.map(note => {
  let noteString = '';
  noteString += `  <note>\n`;
  if (note?.title) noteString += `    <title>${note.title}</title>\n`;
  if (note?.created_at) noteString += `    <created>${note.created_at}</created>\n`;
  if (note?.updated_at) noteString += `    <updated>${note.updated_at}</updated>\n`;
  noteString += `    <note-attributes>\n`;
  noteString += `    </note-attributes>\n`;
  if (note?.text) noteString += `    <content>\n      <![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n      <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">\n      <en-note>\n        ${formatText(note.text)}\n      </en-note>      ]]>\n    </content>\n`;
  noteString += `  </note>\n`;
  return noteString;
}).join('')
+
`</en-export>`;

writeFileSync('./standardnotesToEnexOutput.enex', enex); // TO DO: Custom name