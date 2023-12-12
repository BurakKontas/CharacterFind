import json
import os
import time
import threading
import concurrent

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup

from loguru import logger
from Enums.ScrapModlari import ScrapModlari

from Scrap.Scrapers import scrap_titles, scrap_description, scrap_characters, scrap_episodes, scrap_genres_themes, scrap_information, scrap_pictures, scrap_recommendations, scrap_studios,  scrap_trailer_urls, scrap_producers


class Anime_Scraper:
    def __init__(self, url: str, driver: webdriver.Chrome, options: Options, file_path: str):
        self.__url = url
        self.__driver = driver
        self.__chrome_options = options
        self.__file_path = file_path
        self.urls = []

    def start_anime_scraping(self):
        try:
            check = False
            exists = self.__check_if_exists()
            if exists and check:
                return
            anime_data = self.__scrap_anime()
            self.__create_anime_json(anime_data)
        except Exception as ex:
            logger.error(ex)
            self.__driver = webdriver.Chrome(options=self.__chrome_options)

    def __link_yaratici(self, mode: ScrapModlari):
        link = rf"{self.__url}/{mode.value}"
        return link

    def __get_soup(self):
        soup = BeautifulSoup(self.__driver.page_source, "html.parser")
        return soup

    # ? this function will call all the other private scraping functions
    def __scrap_anime(self):
        self.__driver_get(ScrapModlari.MAIN)
        main = self.__scrap_main()

        self.__driver_get(ScrapModlari.CHARACTERS)
        characters = self.__scrap_characters()

        self.__driver_get(ScrapModlari.RECOMMENDATIONS)
        recommendations = self.__scrap_recommendations()

        self.__driver_get(ScrapModlari.PICTURES)
        pictures = self.__scrap_pictures()

        self.__driver_get(ScrapModlari.VIDEO)
        trailer_url = self.__scrap_trailer_urls()

        self.__driver_get(ScrapModlari.EPISODES)
        episodes = self.__scrap_episodes()

        anime_data = {
            'titles': main['titles'],
            'information': main['information'],
            'description': main['description'],
            'genres_themes': main['genres_themes'],
            'studios': main['studios'],
            'producers': main['producers'],
            'characters': characters,
            'recommendations': recommendations,
            'pictures': pictures,
            'trailer_url': trailer_url,
            'episodes': episodes
        }

        return anime_data

    def __scrap_main(self):
        titles = self.__scrap_titles()
        information = self.__scrap_information()
        description = self.__scrap_description()
        genres_themes = self.__scrap_genres_themes()
        studios = self.__scrap_studios()
        producers = self.__scrap_producers()

        obj = {
            'titles': titles,
            'information': information,
            'description': description,
            'genres_themes': genres_themes,
            'studios': studios,
            'producers': producers
        }

        return obj

    def __scrap_titles(self):  # ? main
        soup = self.__get_soup()
        title = scrap_titles(soup)
        return title

    def __scrap_information(self):  # ? main
        soup = self.__get_soup()
        information = scrap_information(soup)
        return information

    def __scrap_characters(self):  # ? characters
        soup = self.__get_soup()
        characters = scrap_characters(soup)
        return characters

    def __scrap_description(self):  # ? main
        soup = self.__get_soup()
        description = scrap_description(soup)
        return description

    def __scrap_genres_themes(self):  # ? main
        soup = self.__get_soup()
        genres = scrap_genres_themes(soup)
        return genres

    def __scrap_studios(self):  # ? main
        soup = self.__get_soup()
        studios = scrap_studios(soup)
        return studios

    def __scrap_recommendations(self):  # ? recommendations
        soup = self.__get_soup()
        recommendations = scrap_recommendations(soup)
        return recommendations

    def __scrap_pictures(self):  # ? pictures
        soup = self.__get_soup()
        pictures = scrap_pictures(soup)
        return pictures

    def __scrap_trailer_urls(self):  # ? video
        soup = self.__get_soup()
        trailer_urls = scrap_trailer_urls(soup)
        return trailer_urls

    def __scrap_episodes(self):  # ? episodes
        soup = self.__get_soup()
        episodes = scrap_episodes(soup)
        return episodes

    def __scrap_producers(self):  # ? main
        soup = self.__get_soup()
        producers = scrap_producers(soup)
        return producers

    def __pass_bot_check(self):
        pass

    def __create_anime_json(self, anime_data: dict):
        file_name = self.__get_file_path()
        with open(file_name, "w") as f:
            f.write(json.dumps(anime_data, indent=4))

    def __check_if_exists(self):
        if os.path.exists(self.__get_file_path()):
            return True
        else:
            return False

    def __get_file_path(self):
        if not os.path.exists(self.__file_path):
            os.makedirs(self.__file_path)
        id = self.__url.split('/')[4]
        file_name = f"{self.__file_path}/{id}.json"
        return file_name

    def __check_if_bot_check(self):
        is_bot_check = True  # todo: check if bot check is there
        if is_bot_check:
            self.__pass_bot_check()

    def __check_if_error(self, mode: ScrapModlari):
        is_error = True  # todo: check if error is there
        while is_error:
            time.sleep(3)
            url = self.__link_yaratici(mode)
            self.__driver.get(url)
            self.__check_if_error()

    def __driver_get(self, mode: ScrapModlari):
        url = self.__link_yaratici(mode)
        self.__driver.get(url)
        ss = self.__driver.get_screenshot_as_png()
        self.update_image(ss)
        # self.__check_if_error(url)
        # self.__check_if_bot_check()

    def scrap_anime(self, url: str, driver: webdriver.Chrome):
        scraper = Anime_Scraper(
            url, driver, self.chrome_options, './AnimeData')
        scraper.start_anime_scraping()

    def run_threads(self, urls: list, max_concurrent_threads):
        drivers: list[webdriver.Chrome] = []
        for _ in range(max_concurrent_threads):
            drivers.append(webdriver.Chrome(options=self.chrome_options))
        self.drivers = drivers
        threads = []
        for i in range(len(urls)):
            if max_concurrent_threads != 1:
                index = i % (max_concurrent_threads+1)
            else:
                index = 0

            thread = threading.Thread(
                target=self.scrap_anime, args=(urls[i][1], drivers[index]))
            threads.append(thread)

        with concurrent.futures.ThreadPoolExecutor(max_workers=max_concurrent_threads) as executor:
            [executor.submit(thread.run) for thread in threads]

        for driver in drivers:
            driver.quit()

    def load_urls(self):
        errors = []
        file_path = rf"anime_urls.aurl"
        with open(file_path, 'r', encoding="utf-8") as file:
            lines = file.readlines()
            for line in lines:
                try:
                    data = json.loads(line.replace("'", '"'))
                    self.urls.append((data['id'], data['url']))
                except:
                    errors.append(line)
            with open("errors.json", 'w', encoding="utf-8") as file:
                file.writelines(json.dumps(errors, indent=4))
