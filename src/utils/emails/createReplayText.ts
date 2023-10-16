type createReply = {
  body: string;
  date: string | Date;
  from: string;
};

// 返信のテキスト生成
export function createReplayText(original: createReply) {
  const quotedBody = original.body
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');
  const header = `On ${original.date}, ${original.from} wrote:\n`;
  return `${header}${quotedBody}`;
}
