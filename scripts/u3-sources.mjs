#!/usr/bin/env node
/**
 * Fetch IM's teacher pages for the Unit 3 rebuild and keep them as text.
 *
 *   node scripts/u3-sources.mjs [lesson ...]      default: 5 6 7 8 9
 *
 * Source: IM 6–8 Math, CC BY edition, teacher view on im.kendallhunt.com
 * (course 1 = grade 6). The web pages keep mathematics as \( … \) text, which
 * the Teacher Guide PDF's text layer loses. Student responses and cool-downs
 * are not on these pages; they come from the Teacher Guide PDF, read as images.
 *
 * Writes content/u3/source/6.3.<n>-{index,preparation,practice}.txt and
 * 6.3-unit.txt. Re-running overwrites them; the extraction checker compares
 * every line tagged "im" against these files, so they must not be hand-edited.
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('content/u3/source');
const BASE = 'https://im.kendallhunt.com/MS/teachers/1/3';
const lessons = process.argv.slice(2).length ? process.argv.slice(2) : ['5', '6', '7', '8', '9'];

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&#8217;/g, '’')
    .replace(/&lsquo;|&#8216;/g, '‘')
    .replace(/&ldquo;|&#8220;/g, '“')
    .replace(/&rdquo;|&#8221;/g, '”')
    .replace(/&mdash;|&#8212;/g, '—')
    .replace(/&ndash;|&#8211;/g, '–')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

export function htmlToText(html) {
  let s = (/<main[\s\S]*?<\/main>/.exec(html) ?? /<body[\s\S]*?<\/body>/.exec(html) ?? [html])[0];
  s = s.replace(/<(script|style|nav|svg|footer|header)\b[\s\S]*?<\/\1>/g, '');
  s = s.replace(/<math[\s\S]*?<annotation[^>]*>([\s\S]*?)<\/annotation>[\s\S]*?<\/math>/g, ' \\($1\\) ');
  s = s.replace(/<img[^>]*alt="([^"]*)"[^>]*>/g, ' [image: $1] ');
  s = s.replace(/<\/?h[1-6][^>]*>/g, '\n## ');
  s = s.replace(/<(br|\/p|\/li|\/div|\/tr|\/td|\/th)[^>]*>/g, '\n');
  s = s.replace(/<(td|th)[^>]*>/g, ' | ');
  s = s.replace(/<[^>]+>/g, '');
  s = decode(s);
  s = s.replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').replace(/\n## \n/g, '\n');
  s = s.replace(/\n \[image: Expand image\] /g, '');
  return s.trim() + '\n';
}

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

fs.mkdirSync(OUT, { recursive: true });
const jobs = [['6.3-unit', `${BASE}/index.html`]];
for (const n of lessons) for (const p of ['index', 'preparation', 'practice']) jobs.push([`6.3.${n}-${p}`, `${BASE}/${n}/${p}.html`]);
for (const [name, url] of jobs) {
  const text = `Source: ${url}\n\n` + htmlToText(await get(url));
  fs.writeFileSync(path.join(OUT, `${name}.txt`), text);
  console.log(name.padEnd(20), text.length);
}
