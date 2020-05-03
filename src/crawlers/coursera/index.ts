import { CourseraCrawler } from './coursera';
import puppeteer from 'puppeteer';
import { loggerFactory } from '../../logger';

new CourseraCrawler(puppeteer, loggerFactory('Coursera')).crawl();
