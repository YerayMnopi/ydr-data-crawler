import { BaseCrawler } from './base-crawler';
import { PuppeteerMock } from '../../testing/mocks/puppeteer.mock';
import { LoggerMock } from '../../logger/logger.mock';
import { BrowserMode } from './browser-mode.enum';

class fakeCrawler extends BaseCrawler {

  async onHomeLoaded() {}
}

describe('Base Crawler', () => {
  let crawlerInstance: BaseCrawler;

  beforeEach(() => {
    // Disable typescript to pass mocked dependencies
    // @ts-ignore
    crawlerInstance = new fakeCrawler(new PuppeteerMock(), new LoggerMock(), 'url', 'selector', 'file');
  });

  test('Can instantiate', () => {
    expect(crawlerInstance).toBeTruthy();
  });

  test('has a logger instance', () => {
    expect(crawlerInstance['logger']).toBeTruthy();
  });

  describe('Crawl method', () => {
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
    
    test('should execute open method', () => {
      expect(openSpy).toHaveBeenCalled();
    });

    test('should execute onHomeLoaded method', () => {
      expect(onHomeLoadedSpy).toHaveBeenCalled();
    });

    test('should execute saveToJson method', () => {
      expect(saveToJsonSpy).toHaveBeenCalled();
    });

    test('should execute close method', () => {
      expect(closeSpy).toHaveBeenCalled();
    });

  });

  describe('Open method', () => {
    let puppeteerSpy: jest.SpyInstance;
    let pageSpy: jest.SpyInstance;

    beforeEach(() => {
      puppeteerSpy = jest.spyOn<any, any>(crawlerInstance['puppeteer'], 'launch');
      pageSpy = jest.spyOn<any, any>(crawlerInstance['page'], 'setViewport');
    });

    test('should accept headless mode', () => {
      process.argv[2] = BrowserMode.Headless;

      crawlerInstance['open']();

      expect(puppeteerSpy).toHaveBeenCalledWith({headless: true});
    });

    test('should use headless mode as default', () => {
      crawlerInstance['open']();

      expect(puppeteerSpy).toHaveBeenCalledWith({headless: false});
    });

    test('should accept desktop mode', () => {
      process.argv[2] = BrowserMode.Desktop;
  
      crawlerInstance['open']();
  
      expect(pageSpy).toHaveBeenCalledWith({
        width: crawlerInstance['viewportSizes'][BrowserMode.Desktop].width,
        height: crawlerInstance['viewportSizes'][BrowserMode.Desktop].height,
        deviceScaleFactor: 1,
      });
    });

    test('should accept mobile mode', () => {
      process.argv[2] = BrowserMode.Mobile;
  
      crawlerInstance['open']();
  
      expect(pageSpy).toHaveBeenCalledWith({
        width: crawlerInstance['viewportSizes'][BrowserMode.Mobile].width,
        height: crawlerInstance['viewportSizes'][BrowserMode.Mobile].height,
        deviceScaleFactor: 1,
      });
    });
  });

});