from bs4 import BeautifulSoup


def scrap_titles(soup: BeautifulSoup) -> str:
    title = soup.find('h1', {'class': 'title-name h1_bold_none'}).text.strip()
    return title
