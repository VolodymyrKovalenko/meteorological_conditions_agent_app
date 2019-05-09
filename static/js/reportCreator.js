$(document).ready(function () {

            $('#ezw-dateinput .input-daterange').datepicker({
                format: "yyyy-mm-dd",
                todayHighlight: true
             });

            $('#gtw').click( function()
            {
                var data ={};
                data['location'] = $('#location').val();
                data['longitude'] = $('#longitude').val();
                data['latitude'] = $('#latitude').val();

                data['date_from'] =  $('#date_from').val();
                data['date_to'] =  $('#date_to').val();

                $('#result').empty();
                $('#result').addClass('spinner');

                $.ajax({
                    type : "POST",
                    url : "/ezw",
                    data: JSON.stringify(data),
                    contentType: 'application/json;charset=UTF-8',
                    success: function(result)
                    {
                        $('#result').removeClass('spinner');
                        $('#result').html(result);
                        let chart2 = create2Chart();
                        createReport(result, chart2);
                        $.getScript("windRoseChartCreator.js", function(){
                            alert("Script loaded but not necessarily executed.");
                            buildWindRoseChart();
                        });


                    }
                });
            });
            $('#get_weather_now').click( function()
            {
                var data ={};
                data['location'] = $('#location').val();
                data['longitude'] = $('#longitude').val();
                data['latitude'] = $('#latitude').val();

                var today = new Date();
                console.log(today)
                // var today = rightNow.toISOString().slice(0,10).replace(/-/g,"");
                //  var today = rightNow.split("T")[0];
                // console.log(today)

                data['date_from'] = today;
                data['date_to'] = today;

                $('#result').empty();
                $('#result').addClass('spinner');

                $.ajax({
                    type : "POST",
                    url : "/get_weather_now",
                    data: JSON.stringify(data),
                    contentType: 'application/json;charset=UTF-8',
                    success: function(result)
                    {
                        $('#result').removeClass('spinner');
                        $('#result').html(result);
                        // let chart2 = create2Chart();
                        createSingleReport(result);
                        // $.getScript("windRoseChartCreator.js", function(){
                        //     alert("Script loaded but not necessarily executed.");
                        //     buildWindRoseChart();
                        // });


                    }
                });
            });
        });

function create2Chart() {
    let ctx2 = document.getElementById('myChart2').getContext('2d');
    return new Chart(ctx2, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label :'Max temperature',
                    data:[],
                    borderColor: [
                    'rgba(255,16,21,0.82)'
                        ]
                },
                {
                    label :'Min temperature',
                    data:[],
                     borderColor: [
                    'rgba(0,45,255,0.74)'
                        ]
                },
                {
                    label :'Average temperature',
                    data:[],
                     borderColor: [
                    'rgba(251,255,62,0.93)'
                        ]
                }
            ]
        },
        options : {
            title: "Company Performance"
        }


                // vAxis: { title: "°C" },
                // legend:{position:'top',alignment:'start'},
                // hAxis: {title: "Date"}

    });
}

function addMaxTempChart2Data(chart, label, chart_data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(chart_data);
    console.log(chart.data.datasets);
    chart.update();
}
function addMinTempChart2Data(chart, label, chart_data) {
    chart.data.datasets[1].data.push(chart_data);
    console.log(chart.data.datasets);
    chart.update();
}
function addAvarageTempChart2Data(chart, label, chart_data) {
    chart.data.datasets[2].data.push(chart_data);
    console.log(chart.data.datasets);
    chart.update();
}

function createReport(reportData, chart2) {

    for (let i in reportData) {
        // console.log(reportData[i].max_temperature)
        addMinTempChart2Data(chart2, reportData[i].date, reportData[i].min_temperature);
        addAvarageTempChart2Data(chart2, reportData[i].date, reportData[i].average_temperature);
        addMaxTempChart2Data(chart2, reportData[i].date, reportData[i].max_temperature);
    }
    function reportTemplate(report) {
        return `
        <div class="row">
        <div class="col-md-12">
            <div class="well">
            <div class="row">
                <div class="col-xs-9">
                    <b>Date:</b> ${ report.date } ${report.weekday}<br/>
                    <b>Max Tempertaure:</b> ${ report.max_temperature }<br/>
                    <b>Min Tempertaure:</b> ${ report.min_temperature }<br/>
                    <b>Summary: </b> ${ report.summary }<br/>
                    ${report.raining_chance ? precipitation(report):'' }
                </div>
                 <div class="col-xs-3">
                  <h1>${ reportIcon(report.icon) }</h1>
                   <button type="button" class="btn btn-primary" id="report_details"
                    style="margin-top: 20%; margin-left: 25%;">Details ></button>
                 </div>
            </div>  
            </div>
        </div>
        </div>
        `
    }

    document.getElementById("reportsResult").innerHTML = `
    ${reportData.map(reportTemplate).join('')}
    `
}

function reportIcon(icon){
         if (icon == "clear-day") {
             return `<i class="wi wi-day-sunny"></i>`
         }
         else if (icon == "clear-night"){
             return `<i class="wi wi-night-clear"></i>`
         }
         else if (icon == "rain"){
             return `<i class="wi wi-rain"></i>`
         }
         else if (icon == "snow"){
             return `<i class="wi wi-snow"></i>`
         }
         else if (icon == "sleet"){
             return `<i class="wi wi-sleet"></i>`
         }
         else if (icon == "wind"){
             return `<i class="wi wi-windy"></i>`
         }
         else if (icon == "fog"){
             return `<i class="wi wi-fog"></i>`
         }
         else if (icon == "cloudy"){
             return `<i class="wi wi-cloudy"></i>`
         }
         else if (icon == "partly-cloudy-day"){
             return `<i class="wi wi-day-cloudy"></i>`
         }
         else if (icon == "partly-cloudy-night"){
             return `<i class="wi wi-night-partly-cloudy"></i>`
         }
    }

function precipitation(report){
    return `
    <b>Chance of rain: </b>${ report.raining_chance }<br/>
    `
}

function createSingleReport(reportData, chart2) {

    function reportSingleTemplate(report) {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes();
        var dateTime = date+' '+time;
        return `
        <div class="row">
        <div class="col-md-12">
            <div class="well">
            <div class="row">
                <div class="col-xs-9">
                    <b>Date:</b> ${ dateTime }<br/>
                    <b>Tempertaure:</b> ${ report.temperature }<br/>
                    <b>Summary: </b> ${ report.summary }<br/>
                    ${report.raining_chance ? precipitation(report):'' }
                    <b>Humidity: </b> ${ report.humidity }<br/>
                    <b>Pressure: </b> ${ report.pressure }<br/>
                    <b>Cloud cover: </b> ${ report.cloudCover }<br/>
                    <b>Wind speed: </b> ${ report.windSpeed }<br/>
                </div>
                 <div class="col-xs-3">
                  <h1>${ reportIcon(report.icon) }</h1>
<!--                   <button type="button" class="btn btn-primary" id="report_details"-->
<!--                    style="margin-top: 20%; margin-left: 25%;">Details ></button>-->
                 </div>
            </div>  
            </div>
        </div>
        </div>
        `
    }

    document.getElementById("reportsResult").innerHTML = `
    ${reportData.map(reportSingleTemplate).join('')}
    `
}