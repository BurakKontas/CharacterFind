from bs4 import BeautifulSoup


def scrap_characters(soup: BeautifulSoup) -> list[dict]:
    # todo: karakterler düzenlenecek düzgünce çekilecek sadece id döndürecek
    characters = []
    elements = soup.find_all('table', {'class': 'js-anime-character-table'})
    for element in elements:
        character_soup = BeautifulSoup(str(element), 'html.parser')
        id = character_soup.select_one(
            'tbody > tr > td:nth-child(2) > div:nth-child(3) > a')["href"].split('/')[4]
        role = character_soup.select_one(
            'tbody > tr > td:nth-child(2) > div:nth-child(4)').text.strip().replace('&nbsp;', '')
        characters.append({
            "id": id,
            "role": role,
        })
    return characters
