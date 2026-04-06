declare module 'rss-parser/dist/rss-parser.min.js' {
  class RSSParser {
    constructor(options?: unknown);
    parseString(xml: string): Promise<unknown>;
  }

  export default RSSParser;
}
