import scrapy
from books.items import BooksItem
from parsel import Selector
import json
from urllib.parse import urljoin
from openai import OpenAI
import pandas as pd


class PlagueSpider(scrapy.Spider):
    name = "plague"
    allowed_domains = [
        "wikipedia.com",
        "en.wikipedia.org",
        "wikipedia.org",
        "api.scrapestack.com",
        "api.deepseek.com",
    ]
    start_urls = ["https://en.wikipedia.org/wiki/Black_Death"]
    custom_settings = {"FEEDS": {"data/black_plague_data.json": {"format": "json"}}}

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super().from_crawler(crawler, *args, **kwargs)
        spider.SCRAPE_OPS_KEY = crawler.settings.get("SCRAPE_STACK_API_KEY")
        spider.SCRAPE_OPS_URL = crawler.settings.get("SCRAPE_STACK_URL")
        spider.ANTHROPIC_BASE_URL = crawler.settings.get("ANTHROPIC_BASE_URL")
        spider.ANTHROPIC_API_KEY = crawler.settings.get("ANTHROPIC_API_KEY")
        spider.ANTHROPIC_MESSAGE = crawler.settings.get("ANTHROPIC_MESSAGE")
        return spider

    async def start(self):
        for target in self.start_urls:
            relative_url = (
                f"{self.SCRAPE_OPS_URL}?access_key={self.SCRAPE_OPS_KEY}&url={target}"
            )
            yield scrapy.Request(self.start_urls[0], callback=self.parse)

    def parse(self, response):
        df = pd.read_excel(
            "C:/Users/gawst/Map/marco/backend/backend_crawler/data/Wards.xlsx"
        )
        client = OpenAI(
            api_key=self.ANTHROPIC_API_KEY, base_url=self.ANTHROPIC_BASE_URL
        )

        seventh_response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {
                    "role": "user",
                    "content": """I need to write a Python script to geocode 680 addresses from an Excel file. Please generate complete, ready-to-run code.

                    TASK DETAILS:
                    - Input: Excel file with columns: Name, Code, Borough
                    - Output: Same Excel file with two new columns: Latitude and Longitude
                    - Number of records: 680
                    - Prefer using free geocoding service like OpenStreetMap Nominatim

                    SCRIPT REQUIREMENTS:
                    1. Use pandas to read/write Excel files
                    2. Use geopy with Nominatim geocoder
                    3. Add 1-second delay between requests to respect rate limits
                    4. Handle errors gracefully (missing data, failed lookups)
                    5. Save results to a new Excel file
                    6. Include progress reporting

                    Please provide the complete Python script with:
                    - All necessary import statements
                    - Detailed comments explaining each step
                    - Error handling for common geocoding issues
                    - Clear print statements to track progress

                    The script should be fully functional - I'll just need to update the input filename if necessary.""",
                }
            ],
            max_tokens=8000,
        )

        print(seventh_response.choices[0].message.content)
        pass
