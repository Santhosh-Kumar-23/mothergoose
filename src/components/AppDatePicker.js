import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, MARGINS } from "../utils/styles";
import DatePicker from 'react-native-date-picker';
import DateModal from 'react-native-modalbox';
import CloseIcon from "../../assets/svgs/CloseIcon.svg";
import AppText from './AppText';
import AppButton from './AppButton';
import moment from 'moment';
const AppDatePicker = ({
    isOpenModal,
    maximumDate,
    current_date_temp,
    onSelectPress,
    onCloseModal,
    index = 0
}) => {
    const [current_date, setCurrent_date] = React.useState(current_date_temp)
    return (
        <DateModal style={[styles.pickerModal]} isOpen={isOpenModal} position={"bottom"} onClosed={() => { onCloseModal() }}>
            <View style={[{ width: "100%", flexDirection: "row" }]}>
                <View style={{ width: "10%" }} />
                <View style={{ width: "80%", }}>
                    {/* <AppText blue h2m bold textAlignCenter>Please find the date</AppText> */}
                </View>
                <TouchableOpacity style={styles.closeBtnStyle} onPress={() => { onCloseModal() }} >
                    <CloseIcon height={25} width={25} />
                </TouchableOpacity>
            </View>
            <DatePicker
                style={styles.datePickerStyle}
                date={current_date}
                mode={'date'}
                maximumDate={maximumDate}
                onDateChange={d => setCurrent_date(d)}
                textColor={COLORS.darkBlue}
            />
            <AppButton
                onPress={() => { onSelectPress(moment(current_date).format("MM/DD/YYYY"), index) }}
                title={"Select"}
                small
                blue
                alignSelf
            />
        </DateModal>
    );
}
const styles = StyleSheet.create({
    alignJustifyCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    datePickerStyle: { alignItems: 'center', justifyContent: "center", height: 130, marginVertical: MARGINS.mb3 },
    pickerModal: {
        height: 300,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems: "center",
        width: "100%",
        padding: 20
    },
    closeBtnStyle: { width: "10%", alignItems: "flex-end", justifyContent: "center" }
});
export default AppDatePicker;
