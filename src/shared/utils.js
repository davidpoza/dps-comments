export function paragraphTags(content){
  const updatedContent = '<p>' + content.replace(/\r?\n([ \t]*\r?\n)+/g, '</p><p>').replace(/\r?\n/g, '<br />') + '</p>';
  return updatedContent;
}