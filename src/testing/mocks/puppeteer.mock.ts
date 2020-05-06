export class PageMock {

  async goto(url: string) {
    return null;
  }

  async waitForSelector() {
    return null;
  }

  async evaluate() {
    return null;
  }

  async setViewport() {
    return null;
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

export class PuppeteerMock {
  async launch() {
    return new BrowserMock();
  }
}

