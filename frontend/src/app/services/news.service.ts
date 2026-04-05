import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, map, switchMap } from 'rxjs';
import Parser from 'rss-parser/dist/rss-parser.min.js';

type ParserFeed = {
  title?: string;
  source?: string;
  items?: Array<{
    title?: string;
    link?: string;
    pubDate?: string;
    description?: string;
    contentSnippet?: string;
    content?: string;
    creator?: string;
    author?: string;
  }>;
};

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source?: string;
  description?: string;
}

export interface NewsFeed {
  query: string;
  fetchedAt: string;
  items: NewsItem[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly newsRssProxyUrl = '/api/news/rss';
  private readonly parser = new Parser({
    customFields: {
      feed: ['source'],
      item: ['description', 'author']
    }
  });

  constructor(private readonly http: HttpClient) {}

  getNewsByQuery(query: string): Observable<NewsFeed> {
    const rssUrl = this.buildRssProxyUrl(query);

    return this.http.get(rssUrl, { responseType: 'text' }).pipe(
      switchMap((xml) => from(this.parser.parseString(xml) as Promise<ParserFeed>)),
      map((feed) => {
        const items: NewsItem[] = (feed.items ?? []).map((item) => ({
          title: this.htmlToText(item.title ?? ''),
          link: item.link ?? '',
          pubDate: item.pubDate ?? '',
          description: this.htmlToText(item.description ?? item.contentSnippet ?? item.content ?? ''),
          source: this.htmlToText(item.creator || item.author || feed.source || feed.title || 'Google News')
        }));

        return {
          query,
          fetchedAt: new Date().toISOString(),
          items
        };
      })
    );
  }

  private buildRssProxyUrl(query: string): string {
    const params = new URLSearchParams({ query });
    return `${this.newsRssProxyUrl}?${params.toString()}`;
  }

  private decodeHtml(input: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = input;
    return txt.value;
  }

  private htmlToText(input: string): string {
    const decoded = this.decodeHtml(input);
    const parser = new DOMParser();
    const doc = parser.parseFromString(decoded, 'text/html');
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
  }
}
