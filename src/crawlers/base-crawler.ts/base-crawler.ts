import { promises as fs } from 'fs';
import puppeteer from 'puppeteer';
import pino from 'pino';
import { BrowserMode } from './browser-mode.enum';
/**
 * Base class for common functionality shared by crawlers
 */
export abstract class BaseCrawler {
  /**
   * Browser given by puppeteer.
   */
  protected browser!: puppeteer.Browser;

  /**
   * Current page rendered in the browser.
   */
  protected page!: puppeteer.Page;

  /**
   * The data scraped from the page. This data can be saved to a json file with
   * the saveToJson() method.
   */
  protected crawledData: any[] = [];

  private viewportSizes = {
    [BrowserMode.Desktop]: {
      width: 1440,
      height: 960
    },
    [BrowserMode.Mobile]: {
      width: 414,
      height: 736
    }
  }

  constructor(

    /**
     * Puppeteer library
     */
    private readonly puppeteer: any,

    /**
     * A pino logger instance.
     */
    protected logger: pino.Logger,

    /**
     * The home url of the web to crawl.
     */
    protected readonly baseUrl: string,

    /**
     * This selector is used to check that the page is loaded correctly.
     */
    protected readonly baseUrlSelector: string,

    /**
     * The name of the file where the crawledData property is going to be saved.
     */
    protected readonly fileToSaveData: string,
  ) {}

  /**
   * The main method of the class. Starts the crawling process and calls the hooks.
   */
  async crawl(): Promise<void> {
    this.logger.info('Crawling start');

    (async () => {
      try {
        await this.open();
        await this.onHomeLoaded();
        await this.saveToJson();
      } catch (err) {
        this.logger.error(err);
      }
      await this.close();
    })();
  }

  /**
   * A hook to implement each crawler specific code.
   */
  abstract async onHomeLoaded(): Promise<void>;

  /**
   * Instantiates puppeteer and loads the home page.
   */
  protected async open(): Promise<void> {
    this.logger.info('Opening home page');

    const browserMode: BrowserMode = process.argv.slice(2)[0] as BrowserMode || BrowserMode.Desktop;

    if (browserMode === BrowserMode.Headless) {
      this.browser = await this.puppeteer.launch({
        headless: true,
      });
      this.page = await this.browser.newPage();
    } else {
      this.browser = await this.puppeteer.launch({
        headless: false,
      });

      this.page = await this.browser.newPage();
      await this.page.setViewport({
        width: this.viewportSizes[browserMode].width,
        height: this.viewportSizes[browserMode].height,
        deviceScaleFactor: 1,
      });

    }
    await this.page.goto(this.baseUrl);
    await this.page.waitForSelector(this.baseUrlSelector);
    this.logger.info('Home page ready');
  }

  /**
   * Closes the puppeteer instance.
   */
  protected async close(): Promise<void> {
    await this.browser.close();
    this.logger.info('Browser closed');
  }

  /**
   * Saves the data stored in crawledData in a json file.
   */
  protected async saveToJson(): Promise<void> {
    this.logger.info(`Saving crawled data to ${this.fileToSaveData}`);
    await fs.writeFile(`crawled-data/${this.fileToSaveData}`, JSON.stringify(this.crawledData));
    this.logger.info(`Crawled data saved to ${this.fileToSaveData}`);
  }
}
