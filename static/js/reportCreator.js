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
            datasets: [{
                label :'Max temperature',
                data:[]
            }]
        },
        options: null
    });
}

function addChartData(chart, label, data1) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data1);
    });
    console.log(chart.data.datasets);
    chart.update();
}

function createReport(reportData, chart2) {

    for (let i in reportData) {
        // console.log(reportData[i].max_temperature)
        addChartData(chart2, reportData[i].date, reportData[i].max_temperature)

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

    document.getElementById("reportsResult").innerHTML = `
    ${reportData.map(reportTemplate).join('')}
    `
}