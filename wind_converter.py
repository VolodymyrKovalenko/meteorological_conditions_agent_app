class WindConverter:

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
