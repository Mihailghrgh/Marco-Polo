# Scrapy settings for books project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     https://docs.scrapy.org/en/latest/topics/settings.html
#     https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://docs.scrapy.org/en/latest/topics/spider-middleware.html

BOT_NAME = "books"

SPIDER_MODULES = ["books.spiders"]
NEWSPIDER_MODULE = "books.spiders"

ADDONS = {}

#This was used for the MIDDLEWARE with Scrape Ops API to get Headers and browser to rotate for Scraping in Case Needed
SCRAPE_OPS_API_KEY = '55c15f38-961e-46b4-b5b6-933eb806252d'
SCRAPE_OPS_FAKE_USER_AGENT_ENDPOINT = 'https://headers.scrapeops.io/v1/user-agents'
SCRAPE_OPS_FAKE_BROWSER_AGENTS_ENDPOINT = 'https://headers.scrapeops.io/v1/browser-headers'
SCRAPE_OPS_FAKE_USER_AGENT_ENABLED = True
SCRAPE_OPS_NUM_RESULTS = 50

#This was used for the MIDDLEWARE with Scrape STACK which is the same, but no need to create a custom middleware for it, it handle it itself
SCRAPE_STACK_API_KEY = '739765dec695273afa758f8685e92827'
SCRAPE_STACK_URL_PARAMS = 'http://scrapestack.com'
SCRAPE_STACK_URL = 'http://api.scrapestack.com/scrape'
SCRAP_PROXY_SETTINGS = { 'country': 'us'}


#DEEP-SEEK API CALL
ANTHROPIC_BASE_URL = "https://api.deepseek.com/"
ANTHROPIC_API_KEY = "sk-0915a43c6496424d84fd91d087e42e58"
SCRAPE_OPS_FAKE_BROWSER_AGENTS_ENABLED = True
# USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36' 


# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = "books (+http://www.yourdomain.com)"

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# Concurrency and throttling settings
#CONCURRENT_REQUESTS = 16
CONCURRENT_REQUESTS_PER_DOMAIN = 1
DOWNLOAD_DELAY = 1

# Disable cookies (enabled by default)
#COOKIES_ENABLED = False

# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False

# Override the default request headers:
#DEFAULT_REQUEST_HEADERS = {
#    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
#    "Accept-Language": "en",
#}

# Enable or disable spider middlewares
# See https://docs.scrapy.org/en/latest/topics/spider-middleware.html
#SPIDER_MIDDLEWARES = {
#    "books.middlewares.BooksSpiderMiddleware": 543,
#}

# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
DOWNLOADER_MIDDLEWARES = {
    # "books.middlewares.BooksDownloaderMiddleware": 543,
    # "books.middlewares.ScrapeOpFakeUserAgentMiddleware": 400,
    # "books.middlewares.ScrapeOpFakeBrowserHeaderAgentMiddleware": 300,
    # "rotating_proxies.middlewares.RotatingProxyMiddleware": 610,
    # "rotating_proxies.middlewares.BanDetectionMiddleware": 620,
}

PROXY_USER = ''
PROXY_PASSWORD = ''
PROXY_ENDPOINT = ''
PROXY_PORT = ''

ROTATING_PROXY_LIST = [
    '162.214.197.169:55059',
    '147.185.161.56:80',
    '84.195.180.164:3128',
]

# Enable or disable extensions
# See https://docs.scrapy.org/en/latest/topics/extensions.html
#EXTENSIONS = {
#    "scrapy.extensions.telnet.TelnetConsole": None,
#}

# Configure item pipelines
# See https://docs.scrapy.org/en/latest/topics/item-pipeline.html
#ITEM_PIPELINES = {
#    "books.pipelines.BooksPipeline": 300,
#}

# Enable and configure the AutoThrottle extension (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/autothrottle.html
#AUTOTHROTTLE_ENABLED = True
# The initial download delay
#AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
#AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
#AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
#AUTOTHROTTLE_DEBUG = False

# Enable and configure HTTP caching (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = "httpcache"
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = "scrapy.extensions.httpcache.FilesystemCacheStorage"

# Set settings whose default value is deprecated to a future-proof value
FEED_EXPORT_ENCODING = "utf-8"

