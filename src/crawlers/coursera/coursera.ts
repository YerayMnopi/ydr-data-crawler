import { BaseCrawler } from '../base-crawler.ts/base-crawler';
import { Course } from './course.interface';
import pino from 'pino';

/**
 * A scrapper for coursera.org main course list.
 */
export class CourseraCrawler extends BaseCrawler {
  constructor(pupeeteer: any, logger: pino.Logger) {
    super(pupeeteer, logger, 'https://www.coursera.org/courses', '.ais-InfiniteHits-item > div > a', 'coursera.json');
  }

  async onHomeLoaded(): Promise<void> {
    // this.login();
    this.logger.info('On home loaded hook start');

    const numberOfPages = await this.getNumberOfPages();

    const courseBoxSelector = '.ais-InfiniteHits-item > div > a';

    for (let i = 1; i <= numberOfPages; i++) {
      this.logger.info(`Crawling page ${i}`);
      this.crawledData = this.crawledData.concat(
        await this.page.evaluate(this.getCoursesInPage, courseBoxSelector),
      );

      const nextPageButtonSelector = '#pagination_right_arrow_button';
      await this.page.click(nextPageButtonSelector);
      await this.page.waitForSelector(courseBoxSelector);
    }

    this.logger.info('On home loaded hook finish');
  }

  private getCoursesInPage(courseBoxSelector: string): Course[]{
    const courseraHome = 'https://www.coursera.org';
    const courseNameSelector = '.card-info.vertical-box > h2';
    const courseBoxList = document.querySelectorAll(courseBoxSelector);

    const coursesInPage = [];
    for (let j = 0; j < courseBoxList.length; j++) {
      const courseBox = courseBoxList[j];
      const titleElement: HTMLElement = courseBox.querySelector(courseNameSelector) as HTMLElement;
      const institutionElement: HTMLElement = courseBox.querySelector('.partner-name') as HTMLElement;
      const studentsElement: HTMLElement = courseBox.querySelector('.enrollment-number') as HTMLElement;

      coursesInPage.push({
        title: titleElement && titleElement.innerText.trim(),
        link: `${courseraHome}${courseBox.getAttribute('href')}`,
        institution: institutionElement && institutionElement.innerText.trim(),
        students: studentsElement && studentsElement.innerText.trim(),
      });
    }
    return coursesInPage;
  }

  private async getNumberOfPages(): Promise<number> {
    return await this.page.evaluate(() => {
      const paginatorItemSelector = '#pagination_number_box_button';
      const paginatorItemsList = document.querySelectorAll(paginatorItemSelector);
      const lastPaginatorItem: HTMLElement = paginatorItemsList[paginatorItemsList.length - 1] as HTMLElement;

      return lastPaginatorItem ? parseInt(lastPaginatorItem.innerText) : 0;
    });
  }

  
  async login(): Promise<void> {
    const loginButtonSelector = '#c-ph-right-nav > ul > li.c-ph-right-nav-button.c-ph-log-in > a';
    const emailInputSelector = '#emailInput_8-input';
    const passwordInputSelector = '#passwordInput_9-input';
    const submitButton = '#authentication-box-content > div > div._1tu07i3a.AuthenticationModalContentV1 > div > div._1tu07i3a.rc-LoginForm > form > div._1tu07i3a.w-100.placeholder-contrast > button > span';
    const userEmail = 'yeraysonido@yahoo.es';
    const userPassword = 'bel-c89';

    await this.page.waitForSelector(loginButtonSelector);
    await this.page.click(loginButtonSelector);
    await this.page.waitForSelector(emailInputSelector);
    await this.page.type(emailInputSelector, userEmail);
    await this.page.type(passwordInputSelector, userPassword);
    await this.page.click(submitButton);
  }
    
}
