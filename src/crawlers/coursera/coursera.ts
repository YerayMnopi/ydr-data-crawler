import { BaseCrawler } from '../base-crawler.ts/base-crawler';
import pino from 'pino';
import { default as axios } from 'axios';
import numeral from 'numeral';
import { CourseCreateDTO } from 'ydr-course-artifact';
import { CourseraListPage } from './list-page';
import { CourseList } from './course-list.interface';

/**
 * A scrapper for coursera.org main course list.
 */
export class CourseraCrawler extends BaseCrawler {
  homepage = 'https://www.coursera.org';
  baseUrl = 'https://www.coursera.org/courses?query=javascript&page=1&index=prod_all_products_term_optimization';
  listPage = new CourseraListPage();
  baseUrlSelector = this.listPage.selectors.paginator.next;
  platformName = 'Coursera';

  constructor(pupeeteer: any, logger: pino.Logger) {
    super(pupeeteer, logger, 'coursera.json');
  }

  async onHomeLoaded(): Promise<void> {
    // this.login();
    this.logger.info('On home loaded hook start');

    await this.page.waitForSelector(this.baseUrlSelector);
    const numberOfPages = await this.getNumberOfPages();
    // const numberOfPages = 50;


    // Tell Puppeteer what to do with intercepted responses
    this.page.on('response', async response => {

      if(response.request().method() !== 'POST') {
        return;
      }

      if (response.url().includes('queries')) {
          const body = await response.json() as {results: {hits: []}[]};

          if (body.results[1].hits) {
            console.log('-------> COURSES <-------');
            this.crawledData = this.crawledData.concat(
              body.results[1].hits.map((course: CourseList) => this.mapFromResponse(course))
            );
          }
      }
    });

    for (let i = 1; i <= numberOfPages; i++) {
      this.logger.info(`Crawling page ${i}`);
      // this.crawledData = this.crawledData.concat(await this.page.evaluate(this.getCoursesInPage, this.listPage.selectors, this.homepage, this.platformName));
      
      
      /*this.crawledData = this.crawledData
        .map(
          (course) => {
            return {
              ...course,
              ...{students: numeral(course.students).value()}
            };
          }
        );
        */
      await this.page.waitForSelector(this.baseUrlSelector);
      await this.page.click(this.listPage.selectors.paginator.next);
      await this.page.waitForSelector(this.listPage.selectors.course.box);
    }

    this.crawledData.forEach((course) => this.save(course));

    this.logger.info('On home loaded hook finish');
  }

  private getCoursesInPage(listPageSelectors: any, homepage: string, platformName: string): CourseCreateDTO[] {

    const courseBoxList = document.querySelectorAll(listPageSelectors.course.box);

    const coursesInPage = [];

    for (let j = 0; j < courseBoxList.length; j++) {
      const courseBox = courseBoxList[j];
      const titleElement: HTMLElement = courseBox.querySelector(listPageSelectors.course.name) as HTMLElement;
      const institutionElement: HTMLElement = courseBox.querySelector(listPageSelectors.course.institution) as HTMLElement;
      const studentsElement: HTMLElement = courseBox.querySelector(listPageSelectors.course.students) as HTMLElement;
      const type: HTMLElement = courseBox.querySelector(listPageSelectors.course.type) as HTMLElement;
      
      const course: any = {
        name: titleElement && titleElement.innerText.trim(),
        price: 0,
        students: studentsElement && studentsElement.innerText.trim(),
        url: `${homepage}/${courseBox.getAttribute('href')}`,
        teachers: [],
        categories: [],
        platform: platformName,
        institution: institutionElement && institutionElement.innerText.trim(),
        type: type && type.innerText.trim().toLowerCase()
      };

      coursesInPage.push(course);
    }

    return coursesInPage;
  }

  private mapFromResponse(course: CourseList): CourseCreateDTO {
    return {
      name: course.name,
      image: course.imageUrl,
      price: 0,
      students: course.enrollments,
      url: `${this.homepage}/${course.objectUrl}`,
      teachers: [],
      categories: course.skills,
      platform: this.platformName,
      institution: course.partners[0],
      type: course.entityType
    };

  }

  private async getNumberOfPages(): Promise<number> {
    return await this.page.evaluate(
      (listPageSelectors) => {
        const paginatorItemsList = document.querySelectorAll(listPageSelectors.paginator.last);
        const lastPaginatorItem: HTMLElement = paginatorItemsList[paginatorItemsList.length - 1] as HTMLElement;

        return lastPaginatorItem ? parseInt(lastPaginatorItem.innerText) : 0;
      },
      this.listPage.selectors
    );
  }

  async login(): Promise<void> {
    const loginButtonSelector = '#c-ph-right-nav > ul > li.c-ph-right-nav-button.c-ph-log-in > a';
    const emailInputSelector = '#emailInput_8-input';
    const passwordInputSelector = '#passwordInput_9-input';
    const submitButton =
      '#authentication-box-content > div > div._1tu07i3a.AuthenticationModalContentV1 > div > div._1tu07i3a.rc-LoginForm > form > div._1tu07i3a.w-100.placeholder-contrast > button > span';
    const userEmail = 'yeraysonido@yahoo.es';
    const userPassword = '';

    await this.page.waitForSelector(loginButtonSelector);
    await this.page.click(loginButtonSelector);
    await this.page.waitForSelector(emailInputSelector);
    await this.page.type(emailInputSelector, userEmail);
    await this.page.type(passwordInputSelector, userPassword);
    await this.page.click(submitButton);
  }

  save(course: CourseCreateDTO) {
    this.logger.info(`Saving ${course.name} course`)
    axios.post(
      // 'http://ydr-course-service.default:3000/courses',
      'http://localhost:3000/courses',
      course
    )
    .then(() => this.logger.info(`Course ${course.name} created`))
    .catch(() => this.logger.error(`Course ${course.name} creation failed`));
  }
}
