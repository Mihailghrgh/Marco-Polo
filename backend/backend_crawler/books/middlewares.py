# Define here the models for your spider middleware
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/spider-middleware.html

from scrapy import signals

# useful for handling different item types with a single interface
from itemadapter import ItemAdapter


class BooksSpiderMiddleware:
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the spider middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(self, response, spider):
        # Called for each response that goes through the spider
        # middleware and into the spider.

        # Should return None or raise an exception.
        return None

    def process_spider_output(self, response, result, spider):
        # Called with the results returned from the Spider, after
        # it has processed the response.

        # Must return an iterable of Request, or item objects.
        for i in result:
            yield i

    def process_spider_exception(self, response, exception, spider):
        # Called when a spider or process_spider_input() method
        # (from other spider middleware) raises an exception.

        # Should return either None or an iterable of Request or item objects.
        pass

    async def process_start(self, start):
        # Called with an async iterator over the spider start() method or the
        # maching method of an earlier spider middleware.
        async for item_or_request in start:
            yield item_or_request

    def spider_opened(self, spider):
        spider.logger.info("Spider opened: %s" % spider.name)


class BooksDownloaderMiddleware:
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the downloader middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_request(self, request, spider):
        # Called for each request that goes through the downloader
        # middleware.

        # Must either:
        # - return None: continue processing this request
        # - or return a Response object
        # - or return a Request object
        # - or raise IgnoreRequest: process_exception() methods of
        #   installed downloader middleware will be called
        return None

    def process_response(self, request, response, spider):
        # Called with the response returned from the downloader.

        # Must either;
        # - return a Response object
        # - return a Request object
        # - or raise IgnoreRequest
        return response

    def process_exception(self, request, exception, spider):
        # Called when a download handler or a process_request()
        # (from other downloader middleware) raises an exception.

        # Must either:
        # - return None: continue processing this exception
        # - return a Response object: stops process_exception() chain
        # - return a Request object: stops process_exception() chain
        pass

    def spider_opened(self, spider):
        spider.logger.info("Spider opened: %s" % spider.name)


from urllib.parse import urlencode
from random import randint
import requests

class  ScrapeOpFakeUserAgentMiddleware:
    @classmethod
    def from_crawler(cls, crawler):
        return cls(crawler.settings)
    
    def __init__(self, settings):
        self.scrape_ops_api_key = settings.get('SCRAPE_OPS_API_KEY')
        self.scrape_ops_endpoint = settings.get('SCRAPE_OPS_FAKE_USER_AGENT_ENDPOINT', "https://headers.scrapeops.io/v1/user-agents")
        self.scrape_ops_fake_user_agents_active = settings.get('SCRAPE_OPS_FAKE_USER_AGENT_ENABLED', False)
        self.scrape_ops_num_results = settings.get('SCRAPE_OPS_NUM_RESULTS')
        self.headers_list = []
        self._get_user_agents_list()
        self._scrape_ops_fake_user_agents_enabled()

    def _get_user_agents_list(self):
        payload = {'api_key' : self.scrape_ops_api_key}
        if(self.scrape_ops_num_results is not None):
            payload['num_results'] = self.scrape_ops_num_results
        response = requests.get(self.scrape_ops_endpoint, params=urlencode(payload))
        json_response = response.json()
        self.user_agents_list = json_response.get('result', [])
    
    def _get_random_user_agent(self):
        random_index = randint(0, len(self.user_agents_list) - 1)
        random_user = self.user_agents_list[random_index]
        return random_user
    
    def _scrape_ops_fake_user_agents_enabled(self):
        if(self.scrape_ops_api_key is None or self.scrape_ops_api_key == ''):
            self.scrape_ops_fake_user_agents_active = False
        else:
            self.scrape_ops_fake_user_agents_active = True
    
    def process_request(self, request, spider):
        random_user_agent = self._get_random_user_agent()
        request.headers['User-Agent'] = random_user_agent
        print('****************** NEW HEADER ATTACHED *****************')

class ScrapeOpFakeBrowserHeaderAgentMiddleware:
    @classmethod
    def from_crawler(cls, crawler):
        return cls(crawler.settings)
    
    def __init__(self, settings):
        self.scrape_ops_api_key = settings.get('SCRAPE_OPS_API_KEY')
        self.scrape_ops_endpoint = settings.get('SCRAPE_OPS_FAKE_BROWSER_AGENTS_ENDPOINT', "https://headers.scrapeops.io/v1/browser-headers")
        self.scrape_ops_fake_browser_agents_active = settings.get('SCRAPE_OPS_FAKE_BROWSER_AGENTS_ENABLED', False)
        self.scrape_ops_num_results = settings.get('SCRAPE_OPS_NUM_RESULTS')
        self.headers_list = []
        self._get_headers_list()
        self._scrape_ops_fake_browser_headers_enabled()
    
    def _get_headers_list(self):
        payload = {"api-key": self.scrape_ops_api_key}
        if(self.scrape_ops_num_results is not None):
            payload['num_results'] = self.scrape_ops_num_results
        response = requests.get(self.scrape_ops_endpoint, params=urlencode(payload))
        json_response = response.json()
        self.headers_list = json_response.get('result' , [])
        
    def _get_random_browser_header(self):
        random_index = randint(0, len(self.headers_list) - 1)
        return self.headers_list[random_index]
    
    def _scrape_ops_fake_browser_headers_enabled(self):
        if(self.scrape_ops_api_key is None or self.scrape_ops_api_key == ''):
            self.scrape_ops_fake_browser_agents_active = False
        else:
            self.scrape_ops_fake_browser_agents_active = True

    def process_request(self, request, spider):
        random_browser_header = self._get_random_browser_header()

        request.headers['accept-language'] = random_browser_header['accept-language']
        request.headers['sec-fetch-user'] = random_browser_header.get('sec-fetch-dest', 'document')
        request.headers['sec-fetch-mod'] = random_browser_header.get('sec-fetch-mod' , 'navigate')
        request.headers['sec-fetch-site'] = random_browser_header.get('sec-fetch-site', 'none')
        request.headers['sec-ch-ua-platform'] = random_browser_header.get('sec-ch-ua-platform', '"Windows"')
        request.headers['sec-ch-ua-mobile'] = random_browser_header.get('sec-ch-ua-mobile', '?0')
        request.headers['sec-ch-ua'] = random_browser_header.get('sec-ch-ua', '"Not A;Brand";v="99"')
        request.headers['accept'] = random_browser_header['accept'] 
        request.headers['User-Agent'] = random_browser_header.get('user-agent', 'Mozilla/5.0')
        request.headers['upgrade-insecure-requests'] = random_browser_header.get('upgrade-insecure-requests' , '1' )


#This is useful for DECODE AI for the future but im broke at the moment :((
import base64
class CustomProxyMiddleware(object):
    @classmethod
    def from_crawler(cls, crawler):
        return (cls, crawler.settings)
    def __init__(self, settings):
        self.user = settings.get('PROXY_USER')
        self.password = settings.get('PROXY_PASSWORD')
        self.endpoint = settings.get('PROXY_ENDPOINT')
        self.port = settings.get('PROXY_PORT')
    
    def process_request(self, request, spider):
        self.user_credentials = '{user}:{passw}'.format(user = self.user, passw = self.password)
        basic_authentication = 'Basic' + base64.b64encode(self.user_credentials.encode()).decode()
        host = 'http://{endpoint}'.format(endpoint=self.endpoint, port=self.port)
        request.meta['proxy'] = host
        request.headers['Proxy-Authorization'] = basic_authentication

        