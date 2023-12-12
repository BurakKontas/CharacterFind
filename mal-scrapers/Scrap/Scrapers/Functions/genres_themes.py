from bs4 import BeautifulSoup


def scrap_genres_themes(soup: BeautifulSoup) -> str:
    items = []
    items_span = soup.find_all('span', itemprop='genre')
    for item_span in items_span:
        items.append(item_span.text)
    return items
