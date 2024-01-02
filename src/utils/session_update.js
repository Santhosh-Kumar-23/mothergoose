import { session_log_update } from "../api";
import { FindSessionTime } from "./TimeDiff";
import EncryptedStorage from 'react-native-encrypted-storage'

export default async function Session_update(screen) {
    let ES_AppOpenTime = await EncryptedStorage.getItem("AppOpenTime");
    let ES_user_id = await EncryptedStorage.getItem("user_id");
    console.log("ES_user_id", ES_user_id)

    var offTime = new Date().getTime();
    // console.log("offTime", offTime)

    var singleSessionTime = FindSessionTime(offTime, JSON.parse(ES_AppOpenTime).AppOpenTime); // send to API
    // console.log("singleSessionTime in sec", singleSessionTime)

    var session_data = {
        session_time: singleSessionTime,
        user_id: JSON.parse(ES_user_id)?.user_id
    }
    // console.log("utils session_data", session_data) // need send to API

    if (JSON.parse(ES_user_id)?.user_id != undefined && JSON.parse(ES_AppOpenTime).AppOpenTime != undefined) {

        if (global.auth) {
            await session_log_update(session_data);
        }

        if (screen == "profile") {
            EncryptedStorage.removeItem("user_id");
            EncryptedStorage.removeItem("AppOpenTime");
        }
    }
    return true
}