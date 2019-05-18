from report_model import WeatherReport
from geopy.geocoders import Nominatim
from datetime import datetime,timedelta
import requests, os
from config import DARK_SKY_API_KEY
import asyncio
import aiohttp
from wind_converter import WindConverter

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

            if report:
                weather_reports.append(report)

        return weather_reports

    async def get_async_report(self, i, d_from_date, latitude, longitude, delta, bulk):

        async with aiohttp.ClientSession() as session:
            report = self.fetch_report_data(session, i, d_from_date, latitude, longitude)

            res = await asyncio.gather(report)
        print('\n', 'RESULT', res)
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
        date = (d_from_date + timedelta(days=i)).strftime('%Y-%m-%d')
        weekday = (d_from_date + timedelta(days=i)).strftime('%A')
        unit_type = '°F' if json_data['flags']['units'] == 'us' else '°C'
        if 'daily' not in json_data:
            return
        daily_data = json_data['daily']['data'][0]

        min_temperature = str(daily_data['temperatureMin'])
        max_temperature = str(daily_data['temperatureMax'])

        if unit_type == '°F':
            min_temperature = self.convert_to_celsius(min_temperature)
            max_temperature = self.convert_to_celsius(max_temperature)

        average_temperature = round(((float(min_temperature) + float(max_temperature)) / 2), 2)
        daily_data['averageTemperature'] = str(average_temperature)
        daily_data['temperatureMin'] = str(min_temperature)
        daily_data['temperatureMax'] = str(max_temperature)
        daily_data['generalTemperature'] = int(round(average_temperature))

        daily_data['pressure_mmHg'] = 760
        if 'pressure' in daily_data:
            daily_data['pressure_mmHg'] = round(daily_data['pressure'] * 0.75006)

        daily_data['sunriseTime'] = datetime.utcfromtimestamp(
            int(daily_data['sunriseTime'])).strftime('%Y-%m-%d %H:%M:%S')

        daily_data['sunsetTime'] = datetime.utcfromtimestamp(
            int(daily_data['sunsetTime'])).strftime('%Y-%m-%d %H:%M:%S')

        wind_bearing = daily_data['windBearing']
        general_wind_angel = WindConverter.convert_to_wind_angel(wind_bearing)
        daily_data['generalWindAngel'] = general_wind_angel

        hourly_data = None
        if 'hourly' in json_data:
            for item in json_data['hourly']['data']:
                item['time'] = datetime.utcfromtimestamp(int(item['time'])).strftime('%Y-%m-%d')
            hourly_data = json_data['hourly']['data']

        report = WeatherReport(date, unit_type, weekday, hourly_data, daily_data)
        return report

    @staticmethod
    def convert_to_celsius(fahrenheit_temp):
        return round(((float(fahrenheit_temp) - 32) / 1.8), 2)

    def set_currently_weather_data(self, json_data):
        data = json_data['currently']
        data['time'] = datetime.utcfromtimestamp(int(data['time'])).strftime('%Y-%m-%d %H:%M:%S')
        data['pressure_mmHg'] = round(data['pressure'] * 0.75006)
        unit_type = '°F' if json_data['flags']['units'] == 'us' else '°C'
        if unit_type == '°F':
            data['apparentTemperature'] = self.convert_to_celsius(data['apparentTemperature'])
            data['temperature'] = self.convert_to_celsius(data['temperature'])
        return data
