
function Digit2TimeString(_time)
{
    if(_time)
        return `${_time.substr(0,2)}:${_time.substr(2,2)}`

}

function TimeString2Digit(_timeStr)
{
    let _regex = /\d{2}/g;

    let _on = _timeStr.match(_regex)
    _on = _on[0] + _on[1]

    return _on

}

function randWithRangeInteger(start, end)

{

    return Math.floor((Math.random() * (end-start+1)) + start);

}

export {Digit2TimeString,TimeString2Digit,randWithRangeInteger}
