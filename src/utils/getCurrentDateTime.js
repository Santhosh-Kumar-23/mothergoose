import moment from "moment";

export function getCurrentDateTime() {
    var cur_dateTime = new Date();
    var hrs = cur_dateTime.getHours() > 9 ? cur_dateTime.getHours() : "0" + cur_dateTime.getHours()
    var mins = cur_dateTime.getMinutes() > 9 ? cur_dateTime.getMinutes() : "0" + cur_dateTime.getMinutes()
    var secs = cur_dateTime.getSeconds() > 9 ? cur_dateTime.getSeconds() : "0" + cur_dateTime.getSeconds()
    var date = cur_dateTime.getDate() > 9 ? cur_dateTime.getDate() : "0" + cur_dateTime.getDate()
    var month = (cur_dateTime.getMonth() + 1) > 9 ? (cur_dateTime.getMonth() + 1) : "0" + (cur_dateTime.getMonth() + 1)
    var year = cur_dateTime.getFullYear()

    var currentTimeStamp = moment().toString() //Number(new Date());
    var currentTime = hrs + ":" + mins + ":" + secs;
    var todayDate = month + "/" + date + "/" + year;

    return { currentTime, todayDate, currentTimeStamp }
}