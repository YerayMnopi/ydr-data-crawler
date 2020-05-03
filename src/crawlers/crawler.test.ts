import { Crawler } from './crawler';
import { PuppeteerMock } from '../testing/mocks/puppeteer.mock';
import { LoggerMock } from '../logger/logger.mock';

class fakeCrawler extends Crawler {

  async onHomeLoaded() {}
}

describe('Crawler', () => {
  let crawlerInstance: Crawler;

  beforeEach(() => {
    // @ts-ignore
    crawlerInstance = new fakeCrawler(new PuppeteerMock(), new LoggerMock(), 'url', 'selector', 'file');
  });

  test('Can instantiate', () => {
    expect(crawlerInstance).toBeTruthy();
  });

  test('has a logger instance', () => {
    expect(crawlerInstance['logger']).toBeTruthy();
  });

  describe('Crawl', () => {
    let openSpy: jest.SpyInstance;
    let onHomeLoadedSpy: jest.SpyInstance; 
    let saveToJsonSpy: jest.SpyInstance;
    let closeSpy: jest.SpyInstance;

    beforeAll(() => {
      openSpy = jest.spyOn<any, any>(crawlerInstance, 'open').mockImplementation(() => null);
      onHomeLoadedSpy = jest.spyOn<any, any>(crawlerInstance, 'onHomeLoaded').mockImplementation(() => null);
      saveToJsonSpy = jest.spyOn<any, any>(crawlerInstance, 'saveToJson').mockImplementation(() => null);
      closeSpy = jest.spyOn<any, any>(crawlerInstance, 'close').mockImplementation(() => null);
      
      crawlerInstance.crawl();
    });
    
    test('Calls to open method', () => {
      expect(openSpy).toHaveBeenCalled();
    });

    test('Calls to onHomeLoaded method', () => {
      expect(onHomeLoadedSpy).toHaveBeenCalled();
    });

    test('Calls to saveToJson method', () => {
      expect(saveToJsonSpy).toHaveBeenCalled();
    });

    test('Calls to close method', () => {
      expect(closeSpy).toHaveBeenCalled();
    });

  });


});