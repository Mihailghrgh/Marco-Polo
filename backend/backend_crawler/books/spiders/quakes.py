import scrapy
from scrapy import Selector
from books.items import EarthQuakeItem

class QuakesSpider(scrapy.Spider):
    name = "quakes"
    allowed_domains = ["infp.ro"]
    start_urls = ["https://www.infp.ro/"]
    custom_settings = {'FEEDS' :{ 'data/earth_quakes.json' : {'format' : 'json'}}}

    def parse(self, response):
        scripts = response.css('script').getall()
        for script in scripts:
            if any(keyword in script for keyword in ['/api/', '/ajax/', 'loadMore', 'nextPage']):
                print("Potential API in script:", script[:500])

        page_number = 0

        for page in range(1, 50): 
            yield scrapy.FormRequest(url='https://www.infp.ro/list.php', formdata={'pagina': {str(page)}, 'lang': 'ro', 'zone': 'ALL'}, callback=self.page_parsing)
            
        
    

    def page_parsing(self, response): 
        
        tr = response.css('tr.item').getall()
        print(tr)
        for i, tr_items in enumerate(tr):
            html = Selector(text=tr_items)
            table = html.css('table.w3-table-all')
            td = table.css('td::text').getall()
            if(len(td) > 1):
                
                earth_quake_id = td[1]
                earth_quake_magnitude = td[7].replace('mb', '').replace('ml' , '').lstrip()
                earth_quake_region = td[13]
                earth_quake_latitude = td[15].replace('°N', '').lstrip()
                earth_quake_longitude = td[17].replace('°E', '').lstrip()

                new_Item = EarthQuakeItem(id=earth_quake_id, location=earth_quake_region, magnitude=earth_quake_magnitude, latitude=earth_quake_latitude, longitude=earth_quake_longitude)
                yield new_Item
            
