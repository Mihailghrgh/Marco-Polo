import scrapy
from books.items import BooksItem
from parsel import Selector
import json
from urllib.parse import urljoin


class BookspiderSpider(scrapy.Spider):
    name = "bookspider"
    allowed_domains = ["books.toscrape.com" , "api.scrapestack.com"]
    start_urls = ["https://books.toscrape.com/"]
    custom_settings = { "FEEDS" : {"data/booksdata.json" : {"format": "json" , "overwrite": True}}}
    

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider =  super().from_crawler(crawler, *args, **kwargs)
        spider.API_KEY = crawler.settings.get("SCRAPE_STACK_API_KEY")
        spider.URL = crawler.settings.get('SCRAPE_STACK_URL')
        return spider


    async def start(self):
        for target in self.start_urls:
            api_format = f"{self.URL}?access_key={self.API_KEY}&url={target}"
            yield scrapy.Request(api_format, callback=self.parse)
        
    

    def parse(self, response):

        # used to check the response because it was weird either giving json or html, in the end its just HTML
        try:
            print(response.text)
            data = json.loads(response.text)
            print(data)
            select = data.get('response', '')
        except json.JSONDecodeError:
            select = response

        books = response.css('article.product_pod')
        for book in books:
            relative_url = book.css('h3 a::attr(href)').get() 

            if(relative_url and 'catalogue/' in relative_url):
                full_url = urljoin('https://books.toscrape.com/', relative_url)
                book_url = f"{self.URL}?access_key={self.API_KEY}&url={full_url}"
                yield scrapy.Request(book_url, callback = self.book_page_parse)


    def book_page_parse(self, response):
        table_rows = response.css('table tr')
        title = response.css('.product_main h1::text').get()
        price = table_rows[3].css('td ::text').get()
        url = response.url
        product_type = table_rows[1].css("td ::text").get()
        book_item = BooksItem(title = title, price = price, url = url , product_type = product_type)

        yield book_item
