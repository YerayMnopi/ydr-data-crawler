# YDR Data Crawler
An abstraction based on puppeteer to scrape the web

(Docker image repo)https://hub.docker.com/repository/docker/belce/ydr-data-crawler

## Getting started
1. Clone the repo
2. `npm i`
3. `npm start`

## Commands

### Docker
Build de the docker image
`docker build -t belce/ydr-data-crawler .`

Push it to docker hub
`docker push belce/ydr-data-crawler:latest`

Create a pod in kubenetes
`helm upgrade --install ydr-data-crawler helm/.`

Watch pod logs
`kubectl logs --follow {podName}`

Delete all pods of this chart
`helm uninstall ydr-data-crawler`

## Libraries && Technologies
- [Puppeteer](https://pptr.dev/#?product=Puppeteer&version=v3.0.2&show=api-class-page)
- [Lint-staged](https://github.com/okonet/lint-staged)
- [Pino pretty](https://github.com/pinojs/pino-pretty)
- [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
- [YAML](https://www.commonwl.org/user_guide/yaml/)
- [Jest](https://jestjs.io/docs/en/getting-started)
- [Pino logger](https://blog.morizyun.com/javascript/library-typescript-pino-logger.html)
- [ts-jest: Using Jest with typescript](https://github.com/kulshekhar/ts-jest)
- [Commitlint](https://github.com/conventional-changelog/commitlint)
- [Numeral](http://numeraljs.com/)

## Tutorials
#### Puppeteer
- [Puppeteer example](https://blog.bitsrc.io/web-scraping-with-puppeteer-e73e5fee7474)
- [Puppeteer with typescript instalation](https://www.lewuathe.com/using-puppeteer-in-typescript.html)
- [Typescript with puppeteer example](https://www.lewuathe.com/simple-crawling-with-puppeteer-in-typescript.html)
- [Puppeteer with typescript example repo](https://github.com/Lewuathe/site-snapshot)
- [Puppeteer docker repo example](https://github.com/ebidel/try-puppeteer/blob/master/backend/Dockerfile)
- [Optimizing puppeteer](https://dev.to/waqasabbasi/optimizing-and-deploying-puppeteer-web-scraper-1nll)
- [Inspect request](https://blog.ramosly.com/how-ive-been-using-puppeteer-b8010e374ff7)
- [Microsoft playwrigth](https://github.com/microsoft/playwright)

#### Docker
- [Puppeteer with docker](https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker)
- [Puppeteer connect dockerized](https://github.com/skalfyfan/dockerized-puppeteer)
- [Pulling and pushing images](https://ropenscilabs.github.io/r-docker-tutorial/04-Dockerhub.html)
- [Removing containers](https://linuxize.com/post/how-to-remove-docker-images-containers-volumes-and-networks/)


#### Miscelanious
- [ESlint, prettier, lint-staged and husky](https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project)
- [Debugging typescript](https://medium.com/@PhilippKief/how-to-debug-typescript-with-vs-code-9cec93b4ae56)
- [Node commands](https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/)
#### Web scrapping
- [Scraping bot](https://www.scraping-bot.io/how-to-scrape-a-website-without-getting-blocked/)
- [Googlebot user agents](https://developers.whatismybrowser.com/useragents/explore/software_name/googlebot/)
- [Googlebot](https://support.google.com/webmasters/answer/182072)

## Issues
- [Sandbox issue](https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox)
- Mobile mode test not passing
- Puppeteer does not start on kubernetes
- [has not deployed release workaround](https://github.com/helm/helm/issues/7257)