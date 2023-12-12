from bs4 import BeautifulSoup


def scrap_recommendations(soup: BeautifulSoup) -> str:
    recommendations = []
    elements = soup.select_one('#content > table > tbody > tr > td:nth-child(2) > div.rightside.js-scrollfix-bottom-rel')
    elements = elements.find_all("div", {"class": "picSurround"})
    for element in elements:
        recommendation_soup = BeautifulSoup(str(element), 'html.parser')
        id = recommendation_soup.select_one(
            'a')["href"].split('/')[4]
        recommendations.append(id)
        
    return recommendations
            
