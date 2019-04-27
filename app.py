from flask import Flask, render_template, request
from flask_cors import CORS
from controller import ForecastController

app = Flask(__name__)
CORS(app)


@app.route("/")
def index():
   return render_template('index.html')


@app.route('/ezw', methods=['POST', 'GET'])
def ezw():
    report_template = None
    if request.method == 'POST':
        location_address = None

        controller = ForecastController()

        data = request.json

        if data['latitude'] and data['longitude']:
            latitude, longitude = data['latitude'], data['longitude']

        elif data['location']:
            input_location = data['location']
            geo_location = controller.getLocation(input_location)

            if geo_location is None:
                address = "Unknown location"
                return render_template('reports.html', weather_address=address)
            latitude, longitude = controller.convert_location(geo_location)
            address = geo_location.address
            location_address = address

        else:
            data_error = "Enter correct data pls"
            return render_template('reports.html', data_error=data_error)

        controller = ForecastController()

        reports = controller.getWeatherReports(data, latitude, longitude)

        report_template = render_template('reports.html',
                                          location_address=location_address,
                                          latitude=latitude, longitude=longitude,
                                          weather_reports=reports
                                          )

        return report_template


if __name__ == '__main__':
    app.run(debug=False,host='0.0.0.0')   
