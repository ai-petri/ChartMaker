function createTabs(obj)
{
    let select = document.createElement("select");

    for(let key in obj)
    {
        let option = document.createElement("option");
        option.innerText = key;
        select.append(option);
    }

    show(select.value);
    select.onchange = _=> show(select.value);


    function show(name)
    {
        for(let key in obj)
        {
            if(key == name)
            {
                obj[key].style.visibility = "visible";
            }
            else
            {
                obj[key].style.visibility = "hidden";
            }
        }
    }
    return select;
}