# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from scrapy import Field


class BooksItem(scrapy.Item):
    title = scrapy.Field()
    product_type = scrapy.Field()
    price = scrapy.Field()
    url = scrapy.Field()

class EarthQuakeItem(scrapy.Item):
    id = scrapy.Field()
    location = scrapy.Field()
    magnitude = scrapy.Field()
    depth = scrapy.Field()
    longitude = scrapy.Field()
    latitude = scrapy.Field()
