function createPlot(obj)
{
    let canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 400;
    let ctx = canvas.getContext("2d");
    let border = 100;
    let w = canvas.width - 2*border;
    let h = canvas.height - 2*border;
    ctx.font = "20px Arial"
    ctx.rect(border,border,w,h);
    ctx.stroke();
    let min_x = 0;
    let max_x = 100;
    let min_y = 0;
    let max_y = 1.2 * Math.max(...Object.values(obj).flat());
    let X = x => w * x/(max_x - min_x) + border;
    let Y =  y => h * (1 - y/(max_y - min_y)) + border;
    ctx.textAlign = "right"
    ctx.fillText(min_y.toFixed(1),border-10,Y(min_y));
    ctx.fillText(max_y.toFixed(1), border-10, Y(max_y));
    
    let offset = (max_x-min_x)/(Object.keys(obj).length + 1);
    let current_x = offset;
    for(let key in obj)
    {
        let {min,max,mean,median,Q1,Q3} = getStats(obj[key]);
        //top whisker
        ctx.beginPath();
        ctx.moveTo(X(current_x)-5,Y(max));
        ctx.lineTo(X(current_x)+5,Y(max));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(X(current_x),Y(max));
        ctx.lineTo(X(current_x),Y(Q3));
        ctx.stroke();
        //box
        ctx.beginPath();
        ctx.rect(X(current_x)-20,Y(Q3),40,Y(Q1)-Y(Q3));
        ctx.stroke();
        //median
        ctx.beginPath();
        ctx.moveTo(X(current_x)-20,Y(median));
        ctx.lineTo(X(current_x)+20,Y(median));
        ctx.stroke();
        //mean
        ctx.beginPath();
        ctx.moveTo(X(current_x)-5,Y(mean)-5);
        ctx.lineTo(X(current_x)+5,Y(mean)+5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(X(current_x)-5,Y(mean)+5);
        ctx.lineTo(X(current_x)+5,Y(mean)-5);
        ctx.stroke();
        //bottom whisker
        ctx.beginPath();
        ctx.moveTo(X(current_x),Y(Q1));
        ctx.lineTo(X(current_x),Y(min));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(X(current_x)-5,Y(min));
        ctx.lineTo(X(current_x)+5,Y(min));
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.fillText(key,X(current_x),canvas.height - border + 35);
        current_x += offset;
    }
    
    return canvas;
    
}
function getStats(arr)
{
    var min = Math.min(...arr);
    var max = Math.max(...arr);
    var mean = arr.reduce((a,b)=>a+b,0)/arr.length;
    var Q = function(fraction)
    {
        let sortedArray = [...arr].sort((a,b)=>a-b);
        let position = fraction*(sortedArray.length + 1);
        let base = Math.floor(position);
        let remainder = position - base;
        let result = base >= sortedArray.length - 1 ? sortedArray[sortedArray.length - 1]
        : sortedArray[base] + remainder * (sortedArray[base + 1] - sortedArray[base]);
        return result;
    }
    return {
        min,
        max,
        mean,
        median: Q(0.5),
        Q1: Q(0.25),
        Q3: Q(0.75)
    }
}