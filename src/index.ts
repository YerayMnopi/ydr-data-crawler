import { CourseraCrawler } from './crawlers/coursera/coursera';
import puppeteer from 'puppeteer-extra';
import { loggerFactory } from './logger';

new CourseraCrawler(puppeteer, loggerFactory('Coursera')).crawl();
