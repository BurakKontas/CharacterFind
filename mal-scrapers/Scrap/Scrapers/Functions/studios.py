from bs4 import BeautifulSoup


def scrap_studios(soup: BeautifulSoup) -> str:
    studios = []
    studios_span = soup.find_all(
        'span', {'class': 'information studio author'})
    for studio_span in studios_span:
        studios.append(studio_span.text)
    return studios
