from bs4 import BeautifulSoup


def scrap_episodes(soup: BeautifulSoup) -> str: #fl-l fw-b 
    episodes = soup.find_all('a', class_="fl-l fw-b" ).get_text(strip=True)
    print(episodes)
    return episodes
