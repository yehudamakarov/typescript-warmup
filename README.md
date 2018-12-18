Programmable Web Scraper CLI and API
====================================

This is a web scraper that can take a number of days and scrape this amount of days' worth of content from Chabad.org's Daily Study section. This was made to aid me in prototyping a React Native App that would consume such an API.

* Run the scraper from the command line
* Specify the amount of days
* Your MongoDB now has a corresponding number of documents ready to be retrieved from an API

### Tour

`"start": "tsc && node build/scraperCli/index.js”`​ is the script in the package.json that runs the scraper:

![Screen Shot 2018-12-17 at 21.45.33.png](https://i.imgur.com/U0xNKjw.png)

You can enter anything to see the help menu which shows the available command:

![Screen Shot 2018-12-17 at 21.49.20.png](https://i.imgur.com/QeMzmd9.png)

Initiating the scrape will do something like this:

![Screen Shot 2018-12-17 at 23.58.07.png](https://i.imgur.com/zler2du.png)

If there is an error scraping it should be logged and explained, and the scraper will continue working.

Look around for the client, the server, and the rest of the npm scripts.
