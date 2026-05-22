export interface NotePost {
  title: string;
  link: string;
  date: string;
  rawDate: Date;
  excerpt: string;
  image?: string;
  category?: string;
}

function extractCdata(xml: string, tag: string): string {
  const cdata = xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
  if (cdata) return cdata[1].trim();
  const plain = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return plain ? plain[1].trim() : '';
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export async function fetchNotePosts(username: string): Promise<NotePost[]> {
  try {
    const res = await fetch(`https://note.com/${username}/rss`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AstroBot/1.0)' },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const posts: NotePost[] = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/g;
    let m: RegExpExecArray | null;

    while ((m = itemRe.exec(xml)) !== null) {
      const item = m[1];

      const title = extractCdata(item, 'title');

      const link =
        item.match(/<link>(https?:\/\/[^<]+)<\/link>/)?.[1]?.trim() ||
        item.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/)?.[1]?.trim() ||
        '';

      const pubDateStr = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? '';
      const rawDate = new Date(pubDateStr);

      const rawDesc = extractCdata(item, 'description');
      const plainText = rawDesc
        .replace(/<table-of-contents[\s\S]*?<\/table-of-contents>/gi, '')
        .replace(/<a[^>]*>続きをみる<\/a>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      const excerpt = plainText.length > 100 ? plainText.slice(0, 100) + '…' : plainText;

      const image =
        item.match(/<media:thumbnail>(https?:\/\/[^<]+)<\/media:thumbnail>/)?.[1]?.trim() ||
        item.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] ||
        item.match(/<enclosure[^>]*url="([^"]+)"/)?.[1] ||
        rawDesc.match(/<img[^>]*src="([^"]+)"/)?.[1];

      if (title && link) {
        posts.push({ title, link, date: formatDate(rawDate), rawDate, excerpt, image, category: 'note' });
      }
    }

    return posts;
  } catch {
    return [];
  }
}
