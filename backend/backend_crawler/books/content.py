from scrapy import Selector

def return_Message(text):
    messages = text
    return messages


message1 = [
    {"role": "user", "content": f"""
    Generate 150 Black Death coordinate points following this provincial trail:
    Astrakhan → Stavropol → Krasnodar → Crimea → Constantinople/Adrianople
    
    Rules:
    - Create 30 points per province
    - Randomize coordinates within each province
    - Follow historical spread chronology
    - Return JSON: "lat": number, "long": number, "place": string
    """}
]

message2 = [
    {"role": "user", "content": f"""
    Generate 150 Black Death coordinate points for Greek provinces:
    Northeast Greece → Northwest Greece → Southern Greece & Islands → Sicily
    
    Rules:
    - Distribute points across provincial capitals and major towns in a randomized manner 
    - 25-30 points per major region
    - Follow coastal and trade routes
    - Return complete JSON array
    """}
]

message3 = [
    {"role": "user", "content": f"""
    Generate 150 Black Death coordinate points for Italian-Spanish provinces:
    Southern Italy → Central Italy → Northeast Italy → Northwest Italy → Spanish Coast
    
    Rules:
    - 30 points per Italian region, 20 along Spanish coast
    - Focus on port cities and trade centers
    - Maintain chronological spread order
    - Return valid JSON only
    """}
]

message4 = [
    {"role": "user", "content": f"""
    Generate 150 Black Death coordinate points for Central European provinces:
    Southern France → Austria → Bulgaria → Central Spain
    
    Rules:
    - 30 points per major province group
    - Follow historical trade and migration routes
    - Coordinate randomization within provincial boundaries
    - Return JSON array
    """}
]

message5 = [
    {"role": "user", "content": f"""
    Generate 150 Black Death coordinate points for Western European provinces:
    Southern Germany → Western Germany → Central/Northern France → Southern England
    
    Rules:
    - Distribute across provincial capitals
    - 30 points per region
    - Follow Rhine and English Channel routes
    - Return complete JSON
    """}
]

message6 = [
    {"role": "user", "content": f"""
    Generate 150 Black Death coordinate points for Northern European provinces:
    Bohemia → Hungary → Central Germany → Denmark → Southern Sweden → Benelux
    
    Rules:
    - 30 points per province group
    - Follow Danube and Baltic trade routes
    - Focus on Hanseatic league cities
    - Return valid JSON
    """}
]

message7 = [
    {"role": "user", "content": f"""
    Generate 150 Black Death coordinate points for Eastern European provinces:
    Northern Poland → Scotland → Belarus → Baltic States → Novgorod → Kiev Region
    
    Rules:
    - Distribute across provincial centers
    - 30 points per region
    - Follow historical plague spread patterns
    - Return complete JSON array
    """}
]