from bs4 import BeautifulSoup


def scrap_description(soup: BeautifulSoup) -> str:
    description = soup.find('p', itemprop='description').get_text(strip=True)
    return description
