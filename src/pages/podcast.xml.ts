import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { parseAuthors, formatAuthorNames } from '../utils/authors';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function escapeCdata(value: string): string {
  return value.replaceAll(']]>', ']]]]><![CDATA[>');
}

export async function GET(context: APIContext) {
  const siteOrigin = (context.site?.toString() || 'https://xueq.in').replace(/\/+$/, '');
  const teachatUrl = `${siteOrigin}/teachat/`;
  const feedUrl = `${siteOrigin}/podcast.xml`;
  const coverUrl = `${siteOrigin}/podcast-cover.png`;

  const allPosts = await getCollection('blog');
  const episodes = allPosts
    .filter((post) => post.data.category === 'weekly_podcast' && Boolean(post.data.audio_url))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const lastBuildDate = (episodes[0]?.data.pubDate ?? new Date()).toUTCString();
  const copyrightYear = (episodes[0]?.data.pubDate ?? new Date()).getUTCFullYear();

  const itemsXml = episodes
    .map((post) => {
      const postUrl = `${siteOrigin}/blog/${post.id}/`;
      const audioUrl = post.data.audio_url!;
      const audioSize = Math.max(0, Math.round(post.data.audio_size ?? 0));
      const duration = post.data.audio_duration || '05:00';
      const guestNames = formatAuthorNames(
        parseAuthors(post.data.guest_authors || post.data.guest_author)
      );
      const guestLabel = post.data.resident_snapshot?.name || guestNames || '甄仁岛民';
      const authorLine = guestNames ? `公孙雅 × ${guestLabel}` : post.data.curator || '公孙雅';
      const title = post.data.title;
      const summary = post.data.description || post.data.title;

      const emailHtml = post.data.resident_snapshot?.email
        ? `<p>✉️ 给本期嘉宾 ${escapeXml(guestLabel)} 写信：<a href="mailto:${escapeXml(post.data.resident_snapshot.email)}">${escapeXml(post.data.resident_snapshot.email)}</a>（首次来信的岛外朋友，请先给 <a href="mailto:new@digg.cafe">new@digg.cafe</a> 发信，标题注明【注册用户名 你的称呼】激活通行证）。</p>`
        : '';
      const encodedHtml = `<p>${escapeXml(summary)}</p>${emailHtml}<p><a href="${escapeXml(postUrl)}">前往学勤网查看完整对话实录与延伸导览 →</a></p>`;

      const episodeTag =
        typeof post.data.episode === 'number' && post.data.episode > 0
          ? `\n      <itunes:episode>${post.data.episode}</itunes:episode>`
          : '';

      const categoriesXml = (post.data.tags ?? [])
        .map((tag) => `\n      <category>${escapeXml(tag)}</category>`)
        .join('');

      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${escapeXml(post.data.pubDate.toUTCString())}</pubDate>
      <description>${escapeXml(summary)}</description>
      <enclosure url="${escapeXml(audioUrl)}" length="${audioSize}" type="audio/mpeg" />
      <itunes:title>${escapeXml(post.data.title)}</itunes:title>
      <itunes:author>${escapeXml(authorLine)}</itunes:author>
      <itunes:summary>${escapeXml(summary)}</itunes:summary>
      <itunes:duration>${escapeXml(duration)}</itunes:duration>${episodeTag}
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>false</itunes:explicit>
      <itunes:image href="${escapeXml(coverUrl)}" />${categoriesXml}
      <content:encoded><![CDATA[${escapeCdata(encodedHtml)}]]></content:encoded>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:podcast="https://podcastindex.org/namespace/1.0">
  <channel>
    <title>甄仁茶叙</title>
    <link>${escapeXml(teachatUrl)}</link>
    <description>趁定格咖啡馆晚九点半打烊后借桌录制，每周三晚随周刊同步上线。甄仁岛市长公孙雅借吧台一盏黄铜温光油灯，与一位轮值岛民泡茶对谈，聊聊岛内公共议题与岛外人间烟火。</description>
    <language>zh-CN</language>
    <copyright>© ${copyrightYear} 公孙雅</copyright>
    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <itunes:author>公孙雅</itunes:author>
    <itunes:summary>趁定格咖啡馆晚九点半打烊后借桌录制，每周三晚随周刊同步上线。甄仁岛市长公孙雅与一位轮值岛民泡茶对谈，聊岛内公共议题，也聊岛外人间真实处境。</itunes:summary>
    <itunes:owner>
      <itunes:name>公孙雅</itunes:name>
      <itunes:email>mayor@digg.cafe</itunes:email>
    </itunes:owner>
    <itunes:type>episodic</itunes:type>
    <itunes:explicit>false</itunes:explicit>
    <podcast:locked owner="mayor@digg.cafe">yes</podcast:locked>
    <itunes:image href="${escapeXml(coverUrl)}" />
    <image>
      <url>${escapeXml(coverUrl)}</url>
      <title>甄仁茶叙</title>
      <link>${escapeXml(teachatUrl)}</link>
    </image>
    <itunes:category text="Society &amp; Culture">
      <itunes:category text="Personal Journals" />
    </itunes:category>
${itemsXml}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
