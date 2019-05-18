google.charts.load('current', {packages: ['corechart', 'bar']});

function drawSLineSpeedChart(reportData) {
    let speedData = {};

    for (let i in reportData) {
        let speedKey = Math.round(reportData[i].daily_data.windSpeed);

        if (speedKey in speedData) {
            speedData[speedKey] += 1
        } else {
            speedData[speedKey] = 1
        }

    }
    let dataToVisualization = [['Wind speed', 'Repeatable', {role: 'style'}]];
    for (let i in speedData) {
        let dt = [i + "m/s", speedData[i], 'color: #4192f4;'];
        console.log(dt);
        dataToVisualization.push(dt)
    }
    console.log(dataToVisualization);
    let title = 'Wind speed chart repeatable dynamic';
    let elementId = 'windSpeedBArChartDiv';
    drawWindSpeedBarChart(dataToVisualization, title, elementId);
}


function drawWindSpeedBarChart(dataToVisualization, title, elementId) {

    var data = google.visualization.arrayToDataTable(dataToVisualization);

    var options = {
        title: title,
        chartArea: {width: '100%'},
        hAxis: {
            minValue: 0,
            textStyle: {
                bold: true,
                fontSize: 20,
                color: '#4d4d4d'
            },
            titleTextStyle: {
                bold: true,
                fontSize: 18,
                color: '#4d4d4d'
            }
        },
        vAxis: {
            title: 'C',
            textStyle: {
                fontSize: 14,
                bold: true,
                color: '#848484'
            },
            titleTextStyle: {
                fontSize: 14,
                bold: true,
                color: '#848484'
            }
        }
    };
    var chart = new google.visualization.BarChart(document.getElementById(elementId));
    chart.draw(data, options);
}