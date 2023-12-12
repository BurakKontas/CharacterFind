from bs4 import BeautifulSoup


def scrap_producers(soup: BeautifulSoup) -> str:
    producers = []
    leftDiv = soup.select_one('#content > table > tbody > tr > td.borderClass > div')
    allSpaceItPads = leftDiv.find_all('div', class_='spaceit_pad')
    for spaceItPad in allSpaceItPads:
        text:str = spaceItPad.text
        if "Producers:" in text:
            producers = text.replace("Producers:", "").split(",")
            producers = [producer.strip() for producer in producers]
            break
    return producers
