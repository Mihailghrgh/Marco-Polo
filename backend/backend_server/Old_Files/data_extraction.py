import pandas as pd
from geopy.geocoders import Nominatim
import time

geolocator = Nominatim(user_agent="my_geocoding_app/1.0")


def geocode_borough(ward_name, ward_code, borough_name):
    """Get coordinates for a borough name - now with London, UK added"""
    if pd.isna(borough_name) or not borough_name.strip():
        return None, None

    full_address = f"{ward_name},{ward_code},{borough_name}, London, UK"
    try:
        location = geolocator.geocode(full_address)
        if location:
            return location.latitude, location.longitude
        else:
            retry_address = f"{ward_name},{borough_name}"
            location = geolocator.geocode(retry_address)
            return location.latitude, (
                location.longitude if location else ("Not Found", "Not Found")
            )
    except:
        return "Error", "Error"


print("Reading CSV file...")
df = pd.read_csv("C:/Users/gawst/Map/marco/backend/backend_server/data/Data.csv") 

df["Latitude"] = None
df["Longitude"] = None

print(f"Geocoding {len(df)} entries...")
print("This will take about 11 minutes...")

for index, row in df.iterrows():
    ward_name = row["WardName"]
    ward_code = row['WardCode']
    borough_name = row['LookUp_BoroughName']
    lat, lon = geocode_borough(ward_name, ward_code, borough_name)

    df.at[index, "Latitude"] = lat
    df.at[index, "Longitude"] = lon

    if index % 50 == 0:  
        print(f"Processed {index+1}/{len(df)}: {ward_name} -> {lat}, {lon}")

    time.sleep(1)

df.to_csv("geocoded_results.csv", index=False)
print("Done! Saved to geocoded_results.csv")
