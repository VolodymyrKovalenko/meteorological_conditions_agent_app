from report_model import WeatherReport
from geopy.geocoders import Nominatim
from datetime import datetime,timedelta
import requests, os
from config import DARK_SKY_API_KEY
import asyncio
import aiohttp

option_list = "exclude=currently,minutely,hourly,alerts&units=si"


class ForecastController:
 
    def getLocation(self, input_location):
        location = Nominatim().geocode(input_location, language='en_US')
        return
   
    def getWeatherReports(self, data, latitude, longitude, bulk=True):

        weather_reports = []

        date_from = data.get('date_from')
        date_to = data.get('date_to')
        if not bulk:
            date_from = date_from.split('T')[0]
            date_to = date_to.split('T')[0]
        d_from_date = datetime.strptime(date_from, '%Y-%m-%d')
        d_to_date = datetime.strptime(date_to, '%Y-%m-%d')
        delta = d_to_date - d_from_date

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        reports = [(self.get_async_report(i, d_from_date, latitude, longitude, delta, bulk))
                   for i in range(delta.days + 1)]

        reports = loop.run_until_complete(asyncio.gather(*reports))
        for report in reports:

            weather_reports.append(report)

        return weather_reports

    async def get_async_report(self, i, d_from_date, latitude, longitude, delta, bulk):

        async with aiohttp.ClientSession() as session:
            report = self.fetch_report_data(session, i, d_from_date, latitude, longitude)

            res = await asyncio.gather(report)
        # print('\n', 'RESULT', res)
        report_json_data = res[0]
        if bulk:
            report = self.set_meteorological_properties(report_json_data, d_from_date, i)
        else:
            report = self.set_currently_weather_data(report_json_data)

        return report

    async def fetch_report_data(self,session, i, d_from_date, latitude, longitude):
        new_date = (d_from_date + timedelta(days=i)).strftime('%Y-%m-%d')
        search_date = new_date + "T00:00:00"

        # URL = f"https://api.darksky.net/forecast/{DARK_SKY_API_KEY}/{latitude},{longitude},{search_date}?{option_list}"
        URL = f"https://api.darksky.net/forecast/{DARK_SKY_API_KEY}/{latitude},{longitude},{search_date}"
        async with session.get(URL) as response:
            return await response.json()

    @staticmethod
    def convert_location(location):
        latitude = str(location.latitude)
        longitude = str(location.longitude)
        return latitude, longitude

    def set_meteorological_properties(self, json_data, d_from_date, i):
        report_date = (d_from_date + timedelta(days=i)).strftime('%Y-%m-%d')
        report_weekday = (d_from_date + timedelta(days=i)).strftime('%A')
        unit_type = '°F' if json_data['flags']['units'] == 'us' else '°C'

        min_temperature = str(json_data['daily']['data'][0]['apparentTemperatureMin'])
        max_temperature = str(json_data['daily']['data'][0]['apparentTemperatureMax'])

        if unit_type == '°F':
            min_temperature = self.convert_to_celsius(min_temperature)
            max_temperature = self.convert_to_celsius(max_temperature)

        summary = json_data['daily']['data'][0]['summary']
        icon = json_data['daily']['data'][0]['icon']
        raining_chance = self.check_raining_chance(json_data)
        average_temperature = (float(min_temperature) + float(max_temperature)) / 2
        humidity = json_data['daily']['data'][0]['humidity']
        sunrise_data = json_data['daily']['data'][0]['sunriseTime']
        sunrise_time = datetime.utcfromtimestamp(int(sunrise_data)).strftime('%Y-%m-%d %H:%M:%S')
        sunset_data = json_data['daily']['data'][0]['sunsetTime']
        sunset_time = datetime.utcfromtimestamp(int(sunset_data)).strftime('%Y-%m-%d %H:%M:%S')
        wind_speed = json_data['daily']['data'][0]['windSpeed']
        wind_bearing = json_data['daily']['data'][0]['windBearing']
        wind_angel = self.convert_to_wind_angel(wind_bearing)

        cloud_cover = json_data['daily']['data'][0]['cloudCover']

        report = WeatherReport(report_date, max_temperature,min_temperature, summary,
                               raining_chance, icon, unit_type,report_weekday, average_temperature,
                               humidity, sunrise_time, sunset_time, wind_speed, wind_bearing, cloud_cover,
                               wind_angel)
        return report

    @staticmethod
    def convert_to_celsius(fahrenheit_temp):
        return round(((float(fahrenheit_temp) - 32) / 1.8), 2)

    @staticmethod
    def check_raining_chance(json_res):
        raining_chance = None
        if 'precipProbability' in json_res['daily']['data'][0] and 'precipType' in json_res['daily']['data'][0]:
            precip_type = json_res['daily']['data'][0]['precipType']
            precip_prob = json_res['daily']['data'][0]['precipProbability']

            raining_chance = precip_prob
        return raining_chance

    @staticmethod
    def convert_to_wind_angel(wind_bearing):
        return {
            wind_bearing > 360: 'error',
            337.5 <= wind_bearing <= 360: 'N',
            0 <= wind_bearing < 22.5: 'N',
            22.5 <= wind_bearing < 67.5: 'NE',
            67.5 <= wind_bearing < 112.5: 'E',
            112.5 <= wind_bearing < 157.5: 'ES',
            157.5 <= wind_bearing < 202.5: 'S',
            202.5 <= wind_bearing < 247.5: 'WS',
            247.5 <= wind_bearing < 292.5: 'W',
            292.5 <= wind_bearing < 337.5: 'WN'
        }[True]

    def set_currently_weather_data(self, json_data):
        data = json_data['currently']
        data['time'] = datetime.utcfromtimestamp(int(data['time'])).strftime('%Y-%m-%d %H:%M:%S')
        unit_type = '°F' if json_data['flags']['units'] == 'us' else '°C'
        if unit_type == '°F':
            data['apparentTemperature'] = self.convert_to_celsius(data['apparentTemperature'])
            data['temperature'] = self.convert_to_celsius(data['temperature'])
        return data
