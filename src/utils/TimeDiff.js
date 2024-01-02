import moment from "moment";

// For timestamps (imputs -- milliseconds)
export function FindSessionTime(t1, t2) {
    let ts = (t1 - t2) / 1000;

    // console.log("ts", Math.trunc(ts))
    // var d = Math.floor(ts / (3600 * 24));
    // var h = Math.floor(ts % (3600 * 24) / 3600);
    // var m = Math.floor(ts % 3600 / 60);
    // var s = Math.floor(ts % 60);

    // console.log(d , h , m , s)
    return ts;
}

export function ParseMillisecondsIntoReadableTime(milliseconds) {
    //Get hours from milliseconds
    var hours = milliseconds / (1000 * 60 * 60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

    //Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

    //Get remainder from minutes and convert to seconds
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;


    return h + 'h:' + m + 'm:' + s + 's';
}
const hmsToSeconds = (s) => {
    var b = s.split(':');
    return b[0] * 3600 + b[1] * 60 + (+b[2] || 0);
}

export function IntervalTaken(FThms, EThms) {

    var FT = FThms + ""
    var ET = EThms + ""

    var diffSec = (hmsToSeconds(ET) - hmsToSeconds(FT))
    var IntervalInMins = Math.floor(diffSec / 60) + '.' + Math.floor(diffSec % 60)

    // // start time and end time
    // var startTime = moment(FT, 'HH:mm:ss');
    // var endTime = moment(ET, 'HH:mm:ss');

    // // calculate total duration
    // var duration = moment.duration(endTime.diff(startTime));

    // // duration in hours
    // var IntervalInHours = parseInt(duration.asHours());

    // // duration in minutes
    // var IntervalInMins = parseInt(duration.asMinutes()) % 60;

    return { IntervalInMins };
}

export function hmsTOwords(time) {
    var hms = time + ""
    var b = hms.split(':');
    var inSeconds = b[0] * 3600 + b[1] * 60 + (+b[2] || 0)


    var h = Math.floor(inSeconds / 3600);
    var m = Math.floor(inSeconds % 3600 / 60);
    var s = Math.floor(inSeconds % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";


    // if (h > 0) {
    //     return "More than 1 hour"
    // } else if (m > 0) {
    //     return mDisplay + sDisplay;
    // } else {
    //     return sDisplay;
    // }

    return hDisplay + mDisplay + sDisplay
}
export function hmsTOshortwords(time) {
    var hms = time + ""
    var b = hms.split(':');
    var inSeconds = b[0] * 3600 + b[1] * 60 + (+b[2] || 0)


    var h = Math.floor(inSeconds / 3600);
    var m = Math.floor(inSeconds % 3600 / 60);
    var s = Math.floor(inSeconds % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";

    if (h > 0) {
        return "More than 1 hour"
    } else if (m > 0) {
        return mDisplay + sDisplay;
    } else {
        return sDisplay;
    }

    // return hDisplay + mDisplay + sDisplay

}

export function SecondsToHMS(second) {

    var sec = Number(second);
    var h = Math.floor(sec / 3600);
    var m = Math.floor(sec % 3600 / 60);
    var s = Math.floor(sec % 3600 % 60);

    // var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    // var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    var hDisplay = h > 9 ? h : "0" + h
    var mDisplay = m > 9 ? m : "0" + m
    var sDisplay = s > 9 ? s : "0" + s

    var hms = hDisplay + ":" + mDisplay + ":" + sDisplay
    return hms;
}

export function SecondsToHMSwords(second) {

    var sec = Number(second);
    var h = Math.floor(sec / 3600);
    var m = Math.floor(sec % 3600 / 60);
    var s = Math.floor(sec % 3600 % 60);

    var hDisplay = h > 0 ? (h > 9 ? h : "0" + h) + (h == 1 ? " hr " : " hrs ") : ""
    var mDisplay = m > 0 ? (m > 9 ? m : "0" + m) + (m == 1 ? " min " : " mins ") : ""
    var sDisplay = s > 0 ? (s > 9 ? s : "0" + s) + (s == 1 ? " sec" : " secs") : ""

    var hmsWORD = hDisplay + mDisplay + sDisplay

    return hmsWORD;
}

export function DateTO_MDY(date) {
    // eg: Input date format will be like "2023-01-11T00:00:00.000Z"
    const D = new Date(date);

    var year = D.getFullYear();

    var month = (1 + D.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = D.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}

export function DateToAMPM(utc) {

    var d = new Date(utc);
    var hour = d.getHours() == 0 ? 12 : (d.getHours() > 12 ? d.getHours() - 12 : d.getHours());
    var min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    var ampm = d.getHours() < 12 ? 'AM' : 'PM';
    var time = hour + ':' + min + ' ' + ampm;

    return time

}


export function Time24hrTo12hr(time) {
    // eg: Input timr format will be like "15:23:56" - hhmmss
    const [hourString, minute, sec] = time.split(":");
    const hour = +hourString % 24;
    var hr = (hour % 12 || 12) < 10 ? "0" + (hour % 12 || 12) : (hour % 12 || 12)
    return hr + ":" + minute + ":" + sec + (hour < 12 ? "AM" : "PM");
}



function secondsToTime(duration) {
    var hours = Math.floor(duration / 3600);
    var minutes = Math.floor(duration % 3600 / 60);
    var seconds = Math.floor(duration % 3600 % 60);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    // return hours + ":" + minutes + ":" + seconds + "." + milliseconds;

    if (hours >= 48) {
        return "Days"
    } else if (hours >= 24) {
        return "1 day"
    } else if (hours > 0 && hours < 24) {
        return hours + (hours > 1 ? " hrs" : "hr")
    } else if (minutes >= 60) {
        return "1 hr"
    } else if (minutes > 0 && minutes < 60) {
        return minutes + (minutes > 1 ? " mins" : "min")
    } else {
        return seconds + " secs"
    }
}

export function IntervalinHMS(time) {
    var startTime = moment(time).format();
    var endTime = moment().format();
    var duration = moment.duration(moment(endTime).diff(startTime));
    var totalseconds = duration.asSeconds();
    var Interval = secondsToTime(totalseconds)
    return Interval
}

export function CalculateAverage(array) {
    var total = 0;
    var count = 0;
    array.forEach(function (item, index) {
        total += item;
        count++;
    });
    return (total / count).toFixed(2);
}


export function VerifyDeliveryDate(date_to_validate, userDate) {
    // est -- UTC format
    // userDate -- 'MM/DD/YYYY' format

    var estDD = moment(date_to_validate).format('MM/DD/YYYY')
    var befEstDD = moment(estDD, "MM/DD/YYYY").subtract(31, 'days').format('MM/DD/YYYY')
    var aftEstDD = moment(estDD, "MM/DD/YYYY").add(31, 'days').format('MM/DD/YYYY')
    var userIN = moment(userDate, 'MM/DD/YYYY').format('MM/DD/YYYY')

    const isAfter = moment(userIN).isAfter(befEstDD)
    const isBefore = moment(userIN).isBefore(aftEstDD)

    return (isAfter && isBefore);
}


export function DaysDiff(regDate) {

    var start = moment(regDate).format("YYYY-MM-DD")
    var end = moment().format("YYYY-MM-DD")

    var startdate = moment(start);
    var enddate = moment(end);

    const days = enddate.diff(startdate, "days")

    return days
}