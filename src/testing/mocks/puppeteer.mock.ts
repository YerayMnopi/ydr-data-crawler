export class PuppeteerMock {
  async lauch() {
    return new BrowserMock();
  }
}

export class BrowserMock {
  async newPage() {
    return new PageMock();
  }

  async close() {
    return null;
  }
}

export class PageMock {

  async goto(url: string) {
    return null;
  }

  async waitForSelector() {
    return null;
  }

  async evaluate() {
    return null
  }
}