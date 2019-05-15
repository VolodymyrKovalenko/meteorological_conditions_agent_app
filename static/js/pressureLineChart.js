google.charts.load('current', {'packages':['line']});

function drawPressureChart(reportData) {
    let resPressureData = [];
    for (let i in reportData){
        let pressure = reportData[i].daily_data.pressure_mmHg;
        let data = reportData[i].date;

        resPressureData.push([data,pressure])

    }
    drawLineChart(resPressureData)
    }


function drawLineChart(dataToVisualization) {

  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Day');
  data.addColumn('number', 'Pressure mm Hg');

  data.addRows(dataToVisualization);

  var options = {
    chart: {
      title: 'Chart dynamics of pressure changes',
    },
     width: 500,
      height: 400,

  };

  var chart = new google.charts.Line(document.getElementById('pressureChartDiv'));

  chart.draw(data, google.charts.Line.convertOptions(options));
}