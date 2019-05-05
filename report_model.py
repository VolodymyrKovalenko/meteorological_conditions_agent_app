class WeatherReport:

    def __init__(self, date, max_temperature, min_temperature, summary, raining_chance, icon, unit_type, weekday,
                 average_temperature, humidity, sunrise_time, sunset_time, wind_speed, wind_bearing, cloud_cover,
                 wind_angel):
        self.date = date
        self.max_temperature = max_temperature
        self.min_temperature = min_temperature
        self.summary = summary   
        self.raining_chance = raining_chance
        self.icon = icon
        self.unit_type = unit_type
        self.weekday = weekday
        self.average_temperature = average_temperature
        self.humidity = humidity
        self.sunrise_time = sunrise_time
        self.sunset_time = sunset_time
        self.wind_speed = wind_speed
        self.wind_bearing = wind_bearing
        self.cloud_cover = cloud_cover
        self.wind_angel = wind_angel