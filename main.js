
var chartContainer = document.querySelector("#chart-container");
var iframe = document.querySelector("iframe");

var link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://cdn.jsdelivr.net/npm/x-data-spreadsheet@1.1.9/dist/xspreadsheet.min.css";
iframe.contentDocument.head.append(link);

var spreadsheet = x_spreadsheet(iframe.contentDocument.body);
spreadsheet.on("change", updateChart);
spreadsheet.data.addStyle({color:"white",bgcolor:"blue",align:"center"});
spreadsheet.data.addStyle({bgcolor:"rgb(200,200,255)",align:"right"});

var canvas = document.createElement("canvas");
chartContainer.append(canvas);
var chart = new Chart(canvas,{
    type: 'bar',
    data: {
        labels:[],
        datasets:[
            {data:[]}
        ]
    },
    options:{
        scales: {
            y: {
                    min:0
            }
        },
        plugins: { legend: {display:false} }
    },

    plugins: [whiskerPlugin]

})


var tabSelect = createTabs({bar:canvas});
document.querySelector("#tab-select-container").append(tabSelect)

function updateChart(sheet)
{
    var tableHeight = Math.max(0,...Object.keys(sheet.rows).map(Number).filter(o=>o))+1;
    var tableWidth = 0;
    for(let i=0; i<tableHeight; i++)
    {
        rowWidth = Math.max(0,...Object.keys(sheet.rows[i]?.cells || {}).map(Number))+1;
        tableWidth = Math.max(tableWidth,rowWidth);               
    }

    for(let i=0; i<tableWidth; i++)
    {
        spreadsheet.data.rows.setCell(0,i,{style:0, text:sheet.rows[0]?.cells[i]?.text || `Column ${i+1}`});
        for(let j=1; j<tableHeight; j++)
        {
            spreadsheet.data.rows.setCell(j,i,{style:1, text:sheet.rows[j]?.cells[i]?.text || "0"});
        }
    }

    var headerCells = sheet.rows[0]?.cells || {};
    var labels = [];
    for(let i=0; i<tableWidth; i++)
    {
        labels.push(headerCells[i]? headerCells[i]?.text : "");
    }

    chart.data.labels = labels;

   
    chart.data.datasets[0].data = [];
    let max = 0;
    for(let i=0; i<tableWidth; i++)
    {
        let arr = [];

        for(let j=1; j<tableHeight; j++)
        {
            
            arr.push(Number(sheet.rows[j]?.cells[i]?.text) || 0);
        }

        chart.data.datasets[0].data.push(arr);

        let stats = whiskerPlugin.getStats(arr);

        max = Math.max(max, stats.mean+stats.standardDeviation);   
    }

    chart.options.scales.y.max = 1.1*max;

    
    chart.update();





   

}



