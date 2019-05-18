google.charts.load('current', {packages: ['corechart', 'line']});

function precipProbabilityChart(reportData) {
    let data = [];
    for (let i in reportData){
        let precip = reportData[i].daily_data.precipProbability;
        let date = reportData[i].date;

        data.push([date, precip])

    }
    drawRainChart(data)
    }

function drawRainChart(rainData) {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Day');
      data.addColumn('number', 'Precip Probability');

      data.addRows(rainData);

      var options = {
          title: 'Precip probability chart dymnamic',
        annotations: {
          alwaysOutside: true,
          textStyle: {
            fontSize: 14,
            color: '#000',
            auraColor: 'none'
          }
        },
        hAxis: {
          title: 'Days'
        },
        vAxis: {
          title: 'Probability(1-100%)'
        }
      };

      var chart = new google.visualization.LineChart(document.getElementById('precipProbabilityDiv'));
      chart.draw(data, options);
    }