
google.charts.load('current', {packages: ['corechart', 'bar']});

function drawHumidityChart(reportData) {
    let data = [];
    for (let i in reportData){
        let humidity = reportData[i].daily_data.humidity;
        let date = reportData[i].date;

        data.push([date,humidity])

    }
    drawColumnChart(data)
    }

function drawColumnChart(chart_data) {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Day');
      data.addColumn('number', 'Humidity');


      data.addRows(chart_data);

      var options = {
        title: 'Humidity level chart dynamic',
        annotations: {
          alwaysOutside: true,
          textStyle: {
            fontSize: 14,
            color: '#000',
            auraColor: 'none'
          }
        },
        hAxis: {
          title: 'Time of Day',
          format: 'h:mm a',
          viewWindow: {
            min: [7, 30, 0],
            max: [17, 30, 0]
          }
        },
        vAxis: {
          title: 'Humidity (1-100 %)'
        }
      };

      var chart = new google.visualization.ColumnChart(document.getElementById('humidityLineChartDiv'));
      chart.draw(data, options);
    }