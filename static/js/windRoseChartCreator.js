// // code to create a data set that looks like data: [[5, 2], [6, 3], [8, 2]]
//     var windDirection, windSpeed, windDirectionJSON, windSpeedJSON, windDataJSON;
//     windDirection = "[121,229,218,208,230,202,205,213,223,227,239,250,237,240,248]";
//     windSpeed = "[9,13.4,12,9.7,6.6,12.1,10.2,12.2,4.6,9,6.6,6.6,8.7,8.3,9.7]";
//     windDirectionJSON = JSON.parse(windDirection);
//     windSpeedJSON = JSON.parse(windSpeed);
//     windDataJSON = [];
//     for (i = 0; i < windDirectionJSON.length; i++) {
//         windDataJSON.push([ windDirectionJSON[i], windSpeedJSON[i] ]);
//     }
//     windDataJSON.sort(function(a,b) { return a[0] - b[0]; });

function buildWindRoseChart(reportData) {
    let windDataJSON = [];
     for (let i in reportData) {
         windDataJSON.push([reportData[i].daily_data.windBearing, reportData[i].daily_data.windSpeed])
     }
     windDataJSON.sort(function(a,b) { return a[0] - b[0]; });
  console.log(windDataJSON);
    var categories = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    $('#windRoseChartContainer').highcharts({
        series: [{
            data: windDataJSON,
            labels: 'aaaaa',
        }],
        chart: {
            polar: true,
            type: 'column',

        },
        title: {
            text: 'Wind Rose'
        },
        pane: {
            size: '85%'
        },
        legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 100,
            layout: 'vertical'
        },
        xAxis: {
            min: 0,
            max: 360,
            type: "",
            tickInterval: 22.5,
            tickmarkPlacement: 'on',
            labels: {
                formatter: function () {
                    return categories[this.value / 22.5] + '°';
                }
            }
        },
        yAxis: {
            min: 0,
            endOnTick: false,
            showLastLabel: true,
            title: {
                text: 'Wind speed(m/s)'
            },
            labels: {
                formatter: function () {
                    return this.value + 'm/s';
                }
            },
            reversedStacks: false
        },
        tooltip: {
            valueSuffix: 'm/s'
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                shadow: false,
                groupPadding: 0,
                pointPlacement: 'on'
            }
        }
    });
}