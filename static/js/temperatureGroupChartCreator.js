google.charts.load('current', {packages: ['corechart', 'bar']});

function drawTemperatureChart(reportData) {
    let resAverageData = {};
    let resMinData = {};
    let resMaxData = {}
    for (let i in reportData){
        let averageTempKey = reportData[i].daily_data.generalTemperature;
        let minTempKey = Math.round(reportData[i].daily_data.temperatureMin);
        let maxTempKey = Math.round(reportData[i].daily_data.temperatureMax);
        if (averageTempKey in resAverageData){
            resAverageData[averageTempKey] += 1
        }
        else {
            resAverageData[averageTempKey] = 1
        }

        if (minTempKey in resMinData){
            resMinData[minTempKey] += 1
        }
        else {
            resMinData[minTempKey] = 1
        }
        if (maxTempKey in resMaxData){
            resMaxData[maxTempKey] += 1
        }
        else {
            resMaxData[maxTempKey] = 1
        }

    }
    drawAverage(resAverageData);
    drawMax(resMaxData);
    drawMin(resMinData);
    }

function drawAverage(resAverageData) {
    console.log(resAverageData);
    let dataToVisualization = [['Temperature', 'Average', {role: 'style'}]];
    for (let i in resAverageData) {
        let dt = [i + "°C", resAverageData[i], 'stroke-width: 3;' + 'stroke-color: #10ff1b;'];
        console.log(dt);
        dataToVisualization.push(dt)
    }
    console.log(dataToVisualization);
    let title1 = 'Average temperature chart repeatable dynamic';
    let elementId1 = 'average_temperature_group_div';
    drawBarChart(dataToVisualization, title1, elementId1);

}


function drawMax(resMaxData) {
    console.log(resMaxData);
    let dataToVisualization = [['Temperature', 'Max', {role: 'style'}]];
    for (let i in resMaxData) {
        let dt = [i + "°C", resMaxData[i], 'stroke-width: 3;' + 'stroke-color: #ff1015;'];
        dataToVisualization.push(dt)
    }
    let title2 = 'Max temperature chart repeatable dynamic';
    let elementId2 = 'max_temperature_group_div';
    drawBarChart(dataToVisualization, title2, elementId2);
}

function drawMin(resMinData) {
    console.log(resMinData);
    let dataToVisualization = [['Temperature', 'Max']];
    for (let i in resMinData){
        let dt = [i + "°C", resMinData[i]];

        dataToVisualization.push(dt)
    }
    let title3 = 'Min temperature chart repeatable dynamic';
    let elementId3 = 'min_temperature_group_div';
    drawBarChart(dataToVisualization, title3, elementId3);

}

function drawBarChart(dataToVisualization, title, elementId) {

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
