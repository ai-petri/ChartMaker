

const whiskerPlugin = 
{
    whiskerTops: [],
    whiskerBottoms: [],
    getStats: function(values)
    {
        var mean = values.reduce((a,b)=>a+b, 0)/values.length;
        var standardDeviation = Math.sqrt( values.map(o=>(o-mean)*(o-mean)).reduce((a,b)=>a+b, 0) / (values.length - 1) );
        var student95 = [6.314, 2.920, 2.353, 2.132, 2.015, 1.943, 1.895, 1.860, 1.833, 1.812];
        var studentDelta = standardDeviation * student95[values.length - 2]/ Math.sqrt(values.length)
        return {mean, standardDeviation, studentDelta}
    },
    

    beforeUpdate: function(chart)
    {

        this.whiskerTops = [];
        this.whiskerBottoms = [];
        
        if(chart.data.labels.length > 0)
        {
            let data = [];
            chart.data.labels = chart.data.labels;
            for(let n of chart.data.datasets[0].data)
            {
                if(n.length)
                {
                    let {mean, standardDeviation, studentDelta} = this.getStats(n);
                    data.push(mean);
                    this.whiskerTops.push(mean + standardDeviation);
                    this.whiskerBottoms.push(mean - standardDeviation);
                }
                else{
                    data.push(n);
                    this.whiskerTops.push(undefined);
                    this.whiskerBottoms.push(undefined);
                }
            }
            chart.data.datasets[0].data = data;          
        }
        
    },

    beforeLayout: function(chart)
    {
        
    },
    afterDraw: function(chart)
    {
        var {ctx,scales} = chart;
        draw(this.whiskerBottoms,this.whiskerTops);
        function draw(values1, values2)
        {
            for(let i=0; i<values1.length; i++)
            {
                let x = scales.x.left + (i + 0.5)*scales.x.width/values1.length;

                let y1 = scales.y.bottom - scales.y.height*values1[i]/scales.y.max;
                let y2 = scales.y.bottom - scales.y.height* values2[i]/scales.y.max;
                ctx.strokeStyle = "black"
                ctx.beginPath();
                ctx.moveTo(x-5, y1);
                ctx.lineTo(x+5, y1);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(x-5, y2);
                ctx.lineTo(x+5, y2);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(x,y1);
                ctx.lineTo(x,y2);
                ctx.stroke();
        
            }
            
        }
        
    }
}

     