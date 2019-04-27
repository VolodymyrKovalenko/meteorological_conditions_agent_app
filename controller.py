from report_model import WeatherReport
from geopy.geocoders import Nominatim
from datetime import datetime,timedelta
import requests, os
from config import DARK_SKY_API_KEY

option_list = "exclude=currently,minutely,hourly,alerts&units=si"


class ForecastController:
 
    def getLocation(self, input_location):
        location = Nominatim().geocode(input_location, language='en_US')
        return location
   
    def getWeatherReports(self, data, latitude, longitude):

        date_from = data.get('date_from')
        date_to = data.get('date_to')

        d_from_date = datetime.strptime(date_from, '%Y-%m-%d')
        d_to_date = datetime.strptime(date_to , '%Y-%m-%d')
        delta = d_to_date - d_from_date

        weather_reports = []

        for i in range(delta.days+1):
            new_date = (d_from_date + timedelta(days=i)).strftime('%Y-%m-%d')


            search_date = new_date+"T00:00:00"
            response = requests.get("https://api.darksky.net/forecast/"+DARK_SKY_API_KEY+"/"+latitude+","+longitude+","+search_date+"?"+option_list)
            json_res = response.json()
            print(json_res)

            report_date = (d_from_date + timedelta(days=i)).strftime('%Y-%m-%d %A')
            unit_type = '°F' if json_res['flags']['units'] == 'us' else '°C'
            min_temperature = str(json_res['daily']['data'][0]['apparentTemperatureMin'])+unit_type
            max_temperature = str(json_res['daily']['data'][0]['apparentTemperatureMax'])+unit_type

            summary = json_res['daily']['data'][0]['summary']
            icon = json_res['daily']['data'][0]['icon']
            raining_chance = self.check_raining_chance(json_res)

            report = WeatherReport(report_date, max_temperature, min_temperature, summary, raining_chance, icon)

            weather_reports.append(report)

        return weather_reports

    @staticmethod
    def convert_location(location):
        latitude = str(location.latitude)
        longitude = str(location.longitude)
        return latitude, longitude

    @staticmethod
    def check_raining_chance(json_res):
        raining_chance = None
        if 'precipProbability' in json_res['daily']['data'][0] and 'precipType' in json_res['daily']['data'][0]:
            precip_type = json_res['daily']['data'][0]['precipType']
            precip_prob = json_res['daily']['data'][0]['precipProbability']

            raining_chance = precip_prob
        return raining_chance
