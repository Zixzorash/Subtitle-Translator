/**
 * Converts VTT content to SRT format.
 * @param vttContent The VTT subtitle string.
 * @returns The converted SRT subtitle string.
 */
export function vttToSrt(vttContent: string): string {
  if (!vttContent) return '';

  const cleanVtt = vttContent
    .replace(/^WEBVTT( .*)?\r?\n/, '')
    .replace(/NOTE .*\r?\n/g, '')
    .trim();

  const blocks = cleanVtt.split(/\r?\n\r?\n/);
  let counter = 1;

  const srtBlocks = blocks.map(block => {
    if (block.trim()) {
      const lines = block.split(/\r?\n/);
      const timestampIndex = lines.findIndex(line => line.includes('-->'));
      
      if (timestampIndex === -1) return null;
      
      const timestampLine = lines[timestampIndex].replace(/\./g, ',');
      const textLines = lines.slice(timestampIndex + 1).join('\n');
      
      return `${counter++}\n${timestampLine}\n${textLines}`;
    }
    return null;
  }).filter(Boolean);

  return srtBlocks.join('\n\n');
}

/**
 * Converts SRT content to VTT format.
 * @param srtContent The SRT subtitle string.
 * @returns The converted VTT subtitle string.
 */
export function srtToVtt(srtContent: string): string {
  if (!srtContent) return '';
  const blocks = srtContent.trim().split(/\r?\n\r?\n/);

  const vttBlocks = blocks.map(block => {
    const lines = block.trim().split(/\r?\n/);
    if (lines.length < 2) return null;

    const timestampIndex = lines.findIndex(line => line.includes('-->'));
    if (timestampIndex === -1) return null;

    const timestampLine = lines[timestampIndex].replace(/,/g, '.');
    const textLines = lines.slice(timestampIndex + 1).join('\n');

    return `${timestampLine}\n${textLines}`;
  }).filter(Boolean);

  return `WEBVTT\n\n${vttBlocks.join('\n\n')}`;
}

/**
 * Strips all formatting and timestamps from a subtitle file, leaving only the text.
 * @param subtitleContent The content of the subtitle file (VTT or SRT).
 * @returns A string containing only the dialogue.
 */
export function toTxt(subtitleContent: string): string {
  if (!subtitleContent) return '';
  const lines = subtitleContent.trim().split(/\r?\n/);
  const textLines = [];
  for (const line of lines) {
    const isTimestamp = line.includes('-->');
    const isVttHeader = line.trim().startsWith('WEBVTT');
    const isSrtCounter = /^\d+$/.test(line.trim());
    const isNote = line.trim().startsWith('NOTE');
    const isStyle = line.trim().startsWith('STYLE');

    if (!isTimestamp && !isVttHeader && !isSrtCounter && !isNote && !isStyle && line.trim() !== '') {
      textLines.push(line.trim());
    }
  }
  return textLines.join('\n');
}
