const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const SITE = { name: '太陽光発電ナビ', url: 'https://solar-media.vercel.app' };
const AFFILIATE_TOP = `
<div style="background:#fefce8;border:2px solid #ca8a04;border-radius:8px;padding:16px;margin:24px 0;">
  <p style="font-weight:bold;color:#92400e;margin:0 0 8px;">【PR】太陽光発電 無料見積もり</p>
  <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;">
    <li><a href="https://px.a8.net/svt/ejp?a8mat=SOLAR_PLACEHOLDER_1" rel="nofollow" style="display:inline-block;background:#ca8a04;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">▶ タイナビ（無料一括見積もり）</a></li>
    <li><a href="https://px.a8.net/svt/ejp?a8mat=SOLAR_PLACEHOLDER_2" rel="nofollow" style="display:inline-block;background:#a16207;color:#fff;padding:8px 16px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px;">▶ グリエネ（補助金シミュレーションあり）</a></li>
  </ul>
</div>`;
const AFFILIATE_BOTTOM = `
<div style="background:#fffbeb;border:2px solid #d97706;border-radius:8px;padding:16px;margin:24px 0;">
  <p style="font-weight:bold;color:#92400e;margin:0 0 12px;">📚 太陽光発電の参考書</p>
  <ul style="list-style:none;padding:0;margin:0;">
    <li><a href="https://www.amazon.co.jp/s?k=%E5%A4%AA%E9%99%BD%E5%85%89%E7%99%BA%E9%9B%BB&linkCode=ll2&tag=mirainikibouw-22" rel="nofollow" target="_blank" style="color:#1d4ed8;text-decoration:underline;">▶ 太陽光発電関連書籍【Amazon】</a></li>
  </ul>
</div>`;
async function generateArticle() {
  const topicsPath = path.join(__dirname, '..', 'unused-topics.json');
  const contentDir = path.join(__dirname, '..', 'content');
  fs.mkdirSync(contentDir, { recursive: true });
  const topics = JSON.parse(fs.readFileSync(topicsPath, 'utf-8'));
  const existingFiles = new Set(fs.readdirSync(contentDir));
  const topic = topics.find(t => !existingFiles.has(t.filename));
  if (!topic) { console.log('全トピック生成完了'); process.exit(0); }
  console.log(`生成中: ${topic.title}`);
  const today = new Date().toISOString().split('T')[0];
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001', max_tokens: 6000,
    messages: [{ role: 'user', content: `あなたは太陽光発電メディア「${SITE.name}」の専門ライターです。以下のJSON形式のみで出力してください:\n{"title":"タイトル(40〜60文字)","description":"説明(120文字以内)","category":"${topic.category}","date":"${today}","content":"HTMLコンテンツ"}\nトピック:${topic.title}\ncontent要件:1500文字程度のHTML、h2×3〜5個、ul/table活用、具体的な費用・補助金含む、JSON全体を必ず完結させる` }],
  });
  const text = message.content[0].text.trim();
  console.log('レスポンス先頭200文字:', text.slice(0, 200));
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('レスポンスにJSONが見つかりません');
  const article = JSON.parse(jsonMatch[0]);
  article.content = article.content.includes('<h2') ? article.content.replace('<h2', AFFILIATE_TOP + '<h2') : AFFILIATE_TOP + article.content;
  article.content = article.content + AFFILIATE_BOTTOM;
  fs.writeFileSync(path.join(contentDir, topic.filename), JSON.stringify(article, null, 2));
  fs.writeFileSync(topicsPath, JSON.stringify(topics.filter(t => t.filename !== topic.filename), null, 2));
  console.log(`完了: ${topic.filename}`);
}
generateArticle().catch(err => { console.error('エラー:', err.message); process.exit(1); });
