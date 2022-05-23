import { BasePage } from '../base-crawler.ts/base-page';

export class CourseraListPage implements BasePage {
    url = '/courses';
    selectors = {
        paginator: {
            next: '[data-e2e="pagination-controls-next"]',
            last: '[data-e2e="pagination-number-box"]'
        },
        course: {
            box: '[data-e2e="DesktopSearchCard"]',
            name: '.card-info.vertical-box h2',
            institution: '.partner-name',
            students: '.enrollment-number',
            type: '.card-info.vertical-box > div:nth-child(3) > div'
        }
    };
    actions = {};
}   