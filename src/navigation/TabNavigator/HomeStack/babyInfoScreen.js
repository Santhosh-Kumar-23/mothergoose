import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable, ActivityIndicator, Image, TextInput, TouchableOpacity } from 'react-native'
import AppContainer from '../../../components/AppContainer';
import AppSafeAreaView from '../../../components/AppSafeAreaView';
import AppScrollView from '../../../components/AppScrollView';
import AppText from '../../../components/AppText';
import AppTextInput from '../../../components/AppTextInput';
import DateMaskedInput from '../../../components/DateMaskedInput';
import SelectDropdown from 'react-native-select-dropdown'
import UpArrow from "../../../../assets/upArrow.png"
import DownArrow from "../../../../assets/downArrow.png"
import CloseIcon from "../../../../assets/svgs/CloseIcon.svg"
import AppLayout from "../../../components/AppLayout";

import { AppContext } from '../../../context';
import { COLORS, MARGINS } from '../../../utils/styles';
import AppButton from '../../../components/AppButton';
import { send_delivery_details } from '../../../api';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { VerifyDeliveryDate } from '../../../utils/TimeDiff';
import DatePicker from 'react-native-date-picker';
import DateModal from 'react-native-modalbox';
import AppDatePicker from '../../../components/AppDatePicker'
import Check from "../../../../assets/svgs/Check.svg";
import Uncheck from "../../../../assets/svgs/Uncheck.svg";

export default function BabyInfoScreen({ navigation }) {
    const { user, babyBornDetails } = useContext(AppContext)
    const { date_to_validate } = user?.pregnancy?.attributes // extimated delivery date
    const [openDatePicker, setOpenDatePicker] = useState(false)
    const [current_date_temp, setCurrent_date_temp] = useState(new Date())
    // For date state data
    const [isFocused, setIsFocused] = useState(false);
    const [errorMessage, setErrorMessage] = useState("false");
    const [isDirty, setIsDirty] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [modalBody, setModalBody] = useState("");
    const [Loader, setLoader] = useState(true);


    const [delDate, setDelDate] = useState([])
    const [cardIndex, setCardindex] = useState(0)
    const [deliveryType, setDeliveryType] = useState([])
    const [babyGender, setBabyGender] = useState([])
    const [is_breast_feed, setis_breast_feed] = useState([])
    // const [legal_name, setLegalName] = useState([])


    const [babyANYweight, setBabyANYweight] = useState([])
    const [babyGrams, setBabyGrams] = useState([])
    const [firstName, setFirstName] = useState([])
    const [lastName, setLastName] = useState([])
    const [babyPounds, setBabyPounds] = useState([])
    const [babyOunces, setBabyOunces] = useState([])
    const [babyWightType, setBabyWightType] = useState([""])
    const [problems, setProblems] = useState([])
    const issue1 = "Admission to neonatal intensive care"
    const issue2 = "Severe bleeding"
    const issue3 = "Fetal or newborn death" //" "Fetal death"
    const issue4 = "None of the above"

    const [ERR_delDate, setERR_DelDate] = useState([])
    const [ERR_deliveryType, setERR_DeliveryType] = useState([])
    const [ERR_babyGender, setERR_BabyGender] = useState([])
    const [ERR_firstName, setERR_FirstName] = useState([])
    const [ERR_lastName, setERR_LastName] = useState([])
    // const [Err_legal_name, setErr_legal_name] = useState([])
    const [Err_is_breast_feed, setErr_is_breast_feed] = useState([])
    const [ERR_babyWeight, setERR_babyWeight] = useState([])
    const [ERR_problem, setERR_problem] = useState([])

    const [loader, setloader] = useState(false)

    const [inputDetails, setInputDetails] = useState([])

    useEffect(() => {
        setInputDetails([])
        setBabyOunces([])
        setBabyPounds([])
        setBabyGrams([])
        setBabyANYweight([])
        setBabyWightType([])
        setBabyGender([])
        setFirstName([])
        setLastName([])
        setProblems([])
        // setLegalName([])
        setis_breast_feed([])
        setDeliveryType([])
        setDelDate([])

        setERR_DelDate([])
        setERR_DeliveryType([])
        setERR_BabyGender([])
        setERR_FirstName([])
        setERR_LastName([])
        // setErr_legal_name([])
        setErr_is_breast_feed([])
        setERR_problem([])
        setERR_babyWeight([])

        onCreateNewObj()

        setTimeout(() => {
            setLoader(false)
        }, 1000)
    }, [])


    const dateValidate = (date) => {


        let dateformat = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;

        // Matching the date through regular expression      
        if (date.match(dateformat)) {
            let operator = date.split('/');

            // Extract the string into month, date and year      
            let datepart = [];
            if (operator.length > 1) {
                datepart = date.split('/');
            }
            let month = parseInt(datepart[0]);
            let day = parseInt(datepart[1]);
            let year = parseInt(datepart[2]);

            // Create a list of days of a month      
            let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (month == 1 || month > 2) {
                if (day > ListofDays[month - 1]) {
                    //to check if the date is out of range     
                    return false;
                }
            } else if (month == 2) {
                let leapYear = false;
                if ((!(year % 4) && year % 100) || !(year % 400)) leapYear = true;
                if ((leapYear == false) && (day >= 29)) return false;
                else
                    if ((leapYear == true) && (day > 29)) {
                        // console.log('Invalid date format!');
                        return false;
                    }
            }
        } else {
            // console.log("Invalid date format!");
            return false;
        }
        return "Valid date";


    }

    const genderList = ["Male", "Female"]
    const FeedPlan = ["Yes", "No"]
    // const legalnameList = ["First", "Last"]
    const deliveryTypes = ["Vaginal", "Vaginal birth after previous cesarean", "Cesarean", "Repeat cesarean"]
    const weights = ["grams", "pounds & ounces"]


    const AppSelectDropdown = ({
        feild,
        defaultButtonText,
        dataList,
        onSelectItem,
        cardKey
    }) => {
        return (
            <SelectDropdown
                data={dataList}
                // onSelect={(selectedItem, index) => {
                //     console.log(selectedItem, index);
                // }}
                onSelect={(selectedItem, index) => {
                    onSelectItem(cardKey, feild, selectedItem, index);
                }}
                defaultButtonText={defaultButtonText}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                    return item;
                }}
                buttonStyle={styles.dropdown2BtnStyle}
                buttonTextStyle={styles.dropdown2BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                    return <Image source={isOpened ? UpArrow : DownArrow} style={{ height: 20, width: 20 }} />
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown2DropdownStyle}
                rowStyle={styles.dropdown2RowStyle}
                rowTextStyle={styles.dropdown2RowTxtStyle}
            />
        )
    }


    const onChangeOption = async (cardKey, feild, selectedItem, index) => {

        if (feild == "weight") {
            // setBabyWightType(selectedItem)
            babyWightType[cardKey] = await selectedItem


            if (selectedItem == "grams") {
                // setBabyOunces("")
                babyOunces[cardKey] = ""
                // setBabyPounds("")
                babyPounds[cardKey] = ""
                // setBabyANYweight("")
                babyANYweight[cardKey] = ""
            } else {
                // setBabyGrams("")
                babyGrams[cardKey] = ""
                // setBabyANYweight("")
                babyANYweight[cardKey] = ""
            }

            var temp = inputDetails // for rerender the cards
            setInputDetails([...temp])
        }
        else if (feild == "deliveryType") {
            // setDeliveryType(selectedItem)
            deliveryType[cardKey] = selectedItem

        }
        else if (feild == "gender") {
            // setBabyGender(selectedItem)
            babyGender[cardKey] = await selectedItem;

            // var temp = await inputDetails // for rerender the cards
            // await setInputDetails([...temp])
        }
        // else if (feild == "legalname") {
        //     legal_name[cardKey] = await selectedItem;
        // }
        else if (feild == "feed") {
            is_breast_feed[cardKey] = await selectedItem;
        }
    }

    const onValidate = async () => {


        inputDetails.map((val, key) => {
            if (delDate[0] == "" || delDate[0].length < 10) {
                // setERR_DelDate(true)
                ERR_delDate[0] = true
            } else {
                ERR_delDate[0] = false
            }
            // else if (delDate[key].length == 10) {
            //     if (VerifyDeliveryDate(date_to_validate, delDate[key]) == false) {
            //         ERR_delDate[key] = true
            //     } else {
            //         ERR_delDate[key] = false
            //     }
            // }


            if (deliveryType[key] == "")
                ERR_deliveryType[key] = true // setERR_DeliveryType(true)
            else
                ERR_deliveryType[key] = false // setERR_DeliveryType(false)


            if (babyGender[key] == "")
                ERR_babyGender[key] = true
            else
                ERR_babyGender[key] = false


            if (firstName[key] == "")
                ERR_firstName[key] = true
            else
                ERR_firstName[key] = false


            if (lastName[key] == "")
                ERR_lastName[key] = true
            else
                ERR_lastName[key] = false


            // if (legal_name[key] == "")
            //     Err_legal_name[key] = true
            // else
            //     Err_legal_name[key] = false


            if (is_breast_feed[key] == "" && !problems[key].includes(issue3))
                Err_is_breast_feed[key] = true
            else
                Err_is_breast_feed[key] = false


            console.log("problems", key, problems[key])
            if ((problems[key]).length == 0)
                ERR_problem[key] = true
            else
                ERR_problem[key] = false


            if (babyANYweight[key] <= 1)
                ERR_babyWeight[key] = true // setERR_babyWeight(true)

            else
                ERR_babyWeight[key] = false //  setERR_babyWeight(false)

        })

        for (var i = 0; i < inputDetails.length; i++) {
            if (
                delDate[0] != "" && delDate[0].length == 10 &&  //VerifyDeliveryDate(date_to_validate, delDate[i]) == true &&
                deliveryType[i] != "" &&
                babyGender[i] != "" &&
                firstName[i] != "" &&
                lastName[i] != "" &&
                // legal_name[i] != "" &&
                (!problems[i].includes(issue3) ? is_breast_feed[i] != "" : true) &&
                (problems[i]).length != 0 &&
                babyANYweight[i] > 1
            ) {
                if (i == inputDetails.length - 1) {
                    return true
                }
            } else {
                setloader(false);
                return false
            }
        }


    }

    const updateStateToOBJ = async () => {

        var subArr = await inputDetails

        subArr.map((val, key) => {
            subArr[key].weight_ounces = babyOunces[key];
            subArr[key].weight_pounds = babyPounds[key];
            subArr[key].weight_grams = babyGrams[key];
            subArr[key].baby_weight_type = babyWightType[key];
            subArr[key].baby_gender = babyGender[key];
            subArr[key].baby_first_name = firstName[key];
            subArr[key].baby_last_name = lastName[key];
            // subArr[key].legal_name = legal_name[key];
            subArr[key].is_breast_feed = is_breast_feed[key]
            subArr[key].delivery_type = deliveryType[key];
            subArr[key].delivery_date = delDate[0];
            subArr[key].delivery_problems = problems[key];

        })
        await setInputDetails([...subArr])
        // await console.log("subArr", inputDetails)
    }

    const onSave = async () => {
        await updateStateToOBJ()
        await console.log("onsave details", inputDetails)
        await setloader(true)

        var test = await onValidate()

        if (test) {
            // setModalBody("success")
            // setOpenModal(true)
            // setloader(false)

            var res = await send_delivery_details(user.id, inputDetails)
            if (res.message == "added successfully") {
                setModalBody("Details Uploaded Successfully!")
                setloader(false)
                setOpenModal(true)
            } else {
                setModalBody("Something went worng!")
                setloader(false)
                setOpenModal(true)
            }
        }

    }

    const onclose_modal = () => {
        setOpenModal(false)
        navigation.navigate("Home");
    }


    const onCreateNewObj = async () => {
        var newObj = {
            "delivery_date": "",
            "delivery_type": "",
            "baby_gender": "",
            "weight_grams": "",
            "weight_pounds": "",
            "weight_ounces": "",
            "baby_weight_type": "",
            "pregnancy_id": user?.pregnancy?.id,
            "user_id": user.id,
            "delivery_problems": [],
            "is_breast_feed": "",
            // "legal_name": "",
            "baby_first_name": "",
            "baby_last_name": ""
        }
        await setInputDetails(preval => [...preval, newObj])

        await setBabyWightType(pre => [...pre, "pounds & ounces"])
        await setBabyGender(pre => [...pre, ""])
        await setFirstName(pre => [...pre, ""])
        await setLastName(pre => [...pre, ""])
        // await setLegalName(pre => [...pre, ""])
        await setis_breast_feed(pre => [...pre, ""])
        await setDeliveryType(pre => [...pre, ""])
        await setBabyOunces(pre => [...pre, ""])
        await setBabyPounds(pre => [...pre, ""])
        await setBabyGrams(pre => [...pre, ""])
        await setBabyANYweight(pre => [...pre, ""])
        await setDelDate(pre => [...pre, ""])
        await setProblems(pre => [...pre, []])

        setERR_DelDate(pre => [...pre, false])
        setERR_DeliveryType(pre => [...pre, false])
        setERR_FirstName(pre => [...pre, false])
        setERR_LastName(pre => [...pre, false])
        // setErr_legal_name(pre => [...pre, false])
        setErr_is_breast_feed(pre => [...pre, false])
        setERR_problem(pre => [...pre, false])
        setERR_babyWeight(pre => [...pre, false])

        // await console.log("inputDetails --", inputDetails)
        // await console.log("babyWightType --", babyWightType)
        // await console.log("babyGender --", babyGender)
        // await console.log("babyOunces --", babyOunces)
        // await console.log("babyPounds --", babyPounds)
        // await console.log("delDate --", delDate)
        // await console.log("babyGrams --", babyGrams)
    }

    const removeCard = async (val, key) => {

        // For State Arrays
        var subOuncesArr = await babyOunces
        if ((key > -1) && subOuncesArr) {
            await subOuncesArr.splice(key, 1)
            await setBabyOunces([...subOuncesArr])
        }

        var subDDArr = await delDate
        if ((key > -1) && subDDArr) {
            await subDDArr.splice(key, 1)
            await setDelDate([...subDDArr])
        }

        var subPoundsArr = await babyPounds
        if ((key > -1) && subPoundsArr) {
            await subPoundsArr.splice(key, 1)
            await setBabyPounds([...subPoundsArr])
        }

        var subGramArr = await babyGrams
        if ((key > -1) && subGramArr) {
            await subGramArr.splice(key, 1)
            await setBabyGrams([...subGramArr])
        }

        var subAnyWTArr = await babyANYweight
        if ((key > -1) && subAnyWTArr) {
            await subAnyWTArr.splice(key, 1)
            await setBabyANYweight([...subAnyWTArr])
        }


        var subWTypeArr = await babyWightType
        if ((key > -1) && subWTypeArr) {
            await subWTypeArr.splice(key, 1)
            await setBabyWightType([...subWTypeArr])
        }

        var subGenderArr = await babyGender
        if ((key > -1) && subGenderArr) {
            await subGenderArr.splice(key, 1)
            await setBabyGender([...subGenderArr])
        }

        var subFNArr = await firstName
        if ((key > -1) && subFNArr) {
            await subFNArr.splice(key, 1)
            await setFirstName([...subFNArr])
        }

        var subLNArr = await lastName
        if ((key > -1) && subLNArr) {
            await subLNArr.splice(key, 1)
            await setLastName([...subLNArr])
        }

        // var subLegalnameArr = await legal_name
        // if ((key > -1) && subLegalnameArr) {
        //     await subLegalnameArr.splice(key, 1)
        //     await setLegalName([...subLegalnameArr])
        // }

        var subFeedArr = await is_breast_feed
        if ((key > -1) && subFeedArr) {
            await subFeedArr.splice(key, 1)
            await setis_breast_feed([...subFeedArr])
        }

        var subDTArr = await deliveryType
        if ((key > -1) && subDTArr) {
            await subDTArr.splice(key, 1)
            await setDeliveryType([...subDTArr])
        }

        var subProblemArr = await problems
        if ((key > -1) && subProblemArr) {
            await subProblemArr.splice(key, 1)
            await setProblems([...subProblemArr])
        }


        // For ERR State Arrays
        var subERR_DelDate = await ERR_delDate;
        if (key > -1 && subERR_DelDate) {
            await subERR_DelDate.splice(key, 1)
            await setERR_DelDate([...subERR_DelDate])
        }

        var subERR_DeliveryType = await ERR_deliveryType;
        if (key > -1 && subERR_DeliveryType) {
            await subERR_DeliveryType.splice(key, 1)
            await setERR_DeliveryType([...subERR_DeliveryType])
        }

        var subERR_BabyGender = await ERR_babyGender;
        if (key > -1 && subERR_BabyGender) {
            await subERR_BabyGender.splice(key, 1)
            await setERR_BabyGender([...subERR_BabyGender])
        }

        var subERR_FN = await ERR_firstName;
        if (key > -1 && subERR_FN) {
            await subERR_FN.splice(key, 1)
            await setERR_FirstName([...subERR_FN])
        }
        var subERR_LN = await ERR_lastName;
        if (key > -1 && subERR_LN) {
            await subERR_LN.splice(key, 1)
            await setERR_LastName([...subERR_LN])
        }

        // var subERR_LegalName = await Err_legal_name;
        // if (key > -1 && subERR_LegalName) {
        //     await subERR_LegalName.splice(key, 1)
        //     await setErr_legal_name([...subERR_LegalName])
        // }

        var subERR_breastfeed = await Err_is_breast_feed;
        if (key > -1 && subERR_breastfeed) {
            await subERR_breastfeed.splice(key, 1)
            await setErr_is_breast_feed([...subERR_breastfeed])
        }

        var subsetERR_problem = await ERR_problem;
        if (key > -1 && subsetERR_problem) {
            await subsetERR_problem.splice(key, 1)
            await setERR_problem([...subsetERR_problem])
        }


        var subERR_babyWeight = await ERR_babyWeight;
        if (key > -1 && subERR_babyWeight) {
            await subERR_babyWeight.splice(key, 1)
            await setERR_babyWeight([...subERR_babyWeight])
        }


        // For main data Arrays
        var subArr = await inputDetails
        if (key > -1) { // only splice array when item is found
            await subArr.splice(key, 1); // 2nd parameter means remove one item only
            await setInputDetails([...subArr])
        }

        // await console.log("inputDetails", inputDetails)
    }

    const onCheckIssue = async (key, issue) => {
        if ((inputDetails[key]?.delivery_problems).includes(issue)) {
            const index = (inputDetails[key]?.delivery_problems).indexOf(issue);
            if (index > -1) {
                await (inputDetails[key]?.delivery_problems).splice(index, 1);
                var sub_arr = problems
                sub_arr[key] = await inputDetails[key]?.delivery_problems
                setProblems(sub_arr)
            }
        } else {
            // this for add
            if (issue == issue4) { // none of the above
                inputDetails[key].delivery_problems = [issue]
            } else {
                const index = (inputDetails[key]?.delivery_problems).indexOf(issue4);
                if (index > -1) {
                    await (inputDetails[key]?.delivery_problems).splice(index, 1);
                    var sub_arr = problems
                    sub_arr[key] = await inputDetails[key]?.delivery_problems
                    setProblems(sub_arr)
                }

                await (inputDetails[key]?.delivery_problems).push(issue)
            }
            var sub_arr = problems
            sub_arr[key] = await inputDetails[key]?.delivery_problems
            setProblems(sub_arr)

        }
        setInputDetails([...inputDetails])
        console.log("obj", key, inputDetails[key]?.delivery_problems)
    }




    const renderInputCard = (val, key) => {
        return (
            <View style={[{ marginTop: MARGINS.mt4, backgroundColor: COLORS.white, borderRadius: 12 }, styles.boxShadow]}>

                {
                    key != 0 ?
                        <TouchableOpacity onPress={() => {
                            removeCard(val, key)
                        }}>
                            <AppText textAlignRight InkBlue>Remove</AppText>
                        </TouchableOpacity>
                        : null
                }

                {
                    key == 0 ?
                        <View>
                            <AppText bold blue h3 mb2>What was the date of the delivery? </AppText>
                            <Pressable style={[styles.dropdown2BtnStyle, { paddingLeft: 15, width: "100%", justifyContent: "center" }]} onPress={() => {
                                setCardindex(key);
                                setOpenDatePicker(true);
                            }}>
                                <AppText gray={!delDate[key]}>{delDate[key] ? delDate[key] : "mm/dd/yyyy"}</AppText>
                            </Pressable>
                            {ERR_delDate[key] ? <AppText mt1 small red ml2>Please enter valid delivery address*</AppText> : null}
                        </View>
                        :
                        null
                }

                <View style={{ marginTop: key == 0 ? MARGINS.mt4 : 0 }}>
                    <AppText bold blue h3 mb2>What type of delivery?</AppText>
                    <AppSelectDropdown
                        onSelectItem={onChangeOption}
                        feild={"deliveryType"}
                        dataList={deliveryTypes}
                        defaultButtonText={deliveryType[key] ? deliveryType[key] : 'Select delivery type'}
                        cardKey={key}
                    />
                    {ERR_deliveryType[key] ? <AppText mt1 small red ml2>Please select the delivery type*</AppText> : null}
                </View>

                <View style={{ marginTop: MARGINS.mt4, width: "100%" }}>
                    <AppText bold blue h3 mb2>What is the gender of the baby?</AppText>
                    <AppSelectDropdown
                        onSelectItem={onChangeOption}
                        feild={"gender"}
                        dataList={genderList}
                        defaultButtonText={babyGender[[key]] ? babyGender[[key]] : "Select baby's gender"}
                        cardKey={key}
                    />
                    {ERR_babyGender[key] ? <AppText mt1 small red ml2>Please select the baby's gender*</AppText> : null}
                </View>

                <View style={{ marginTop: MARGINS.mt4 }}>
                    <AppText bold blue h3 mb2>What did the baby weigh?</AppText>
                    <View style={{ flexDirection: "row" }}>
                        {
                            babyWightType[key] == "grams" ?
                                <>
                                    <View style={{ width: "60%", flexDirection: "row", justifyContent: "space-between", }} >
                                        <TextInput
                                            value={babyGrams}
                                            placeholder={"grams"}
                                            placeholderTextColor={COLORS.gray}
                                            onChangeText={(text) => {
                                                // setBabyGrams(text);
                                                setBabyGrams(prev => prev.map((val, i) => key === i ? text : val));
                                                // setBabyANYweight(text);
                                                setBabyANYweight(prev => prev.map((val, i) => key === i ? text : val));
                                            }}
                                            keyboardType={"numeric"}
                                            style={[styles.dropdown2BtnStyle, styles.TxtInputTxtColor, { paddingLeft: 15, width: "90%" }]}
                                        />
                                    </View>

                                </>
                                :
                                <View style={{ width: "60%", flexDirection: "row", justifyContent: "space-between", }} >
                                    <TextInput
                                        value={babyPounds}
                                        placeholder={"pounds"}
                                        placeholderTextColor={COLORS.gray}
                                        onChangeText={(text) => {
                                            // setBabyPounds(text);
                                            setBabyPounds(prev => prev.map((val, i) => key === i ? text : val));
                                            // setBabyANYweight(text);
                                            setBabyANYweight(prev => prev.map((val, i) => key === i ? text : val));
                                        }}
                                        keyboardType={"numeric"}
                                        style={[styles.dropdown2BtnStyle, styles.TxtInputTxtColor, { paddingLeft: 15, width: "40%" }]}
                                    />

                                    <TextInput
                                        value={babyOunces[key]}
                                        placeholder={"ounces"}
                                        placeholderTextColor={COLORS.gray}
                                        onChangeText={(text) => {
                                            // setBabyOunces(text) 
                                            setBabyOunces(prev => prev.map((val, i) => key === i ? text : val));

                                        }}
                                        keyboardType={"numeric"}
                                        style={[styles.dropdown2BtnStyle, styles.TxtInputTxtColor, { paddingLeft: 15, width: "40%" }]}
                                    />
                                    <View style={{ width: "10%" }} />
                                </View>
                        }

                        <View style={{ width: "40%" }} >

                            <AppSelectDropdown
                                onSelectItem={onChangeOption}
                                feild={"weight"}
                                dataList={weights}
                                defaultButtonText={babyWightType[key]}
                                cardKey={key}
                            />

                        </View>

                    </View>
                    {ERR_babyWeight[key] ? <AppText mt1 small red ml2>Please enter valid baby's weigh*</AppText> : null}
                </View>




                <View style={{ marginTop: MARGINS.mt4, width: "100%" }}>
                    <AppText bold blue h3 mb2>What is the baby’s legal name?</AppText>
                    {/* <AppSelectDropdown
                        onSelectItem={onChangeOption}
                        feild={"legalname"}
                        dataList={legalnameList}
                        defaultButtonText={legal_name[[key]] ? legal_name[[key]] : "Select baby’s legal name"}
                        cardKey={key}
                    />
                    {Err_legal_name[key] ? <AppText mt1 small red ml2>Please select the the baby’s legal name*</AppText> : null} */}

                    <TextInput
                        value={firstName}
                        placeholder={"Baby's First name"}
                        placeholderTextColor={COLORS.gray}
                        onChangeText={(text) => {
                            setFirstName(prev => prev.map((val, i) => key === i ? text : val));
                        }}
                        style={[styles.dropdown2BtnStyle, styles.TxtInputTxtColor, { paddingLeft: 15, width: "100%" }]}
                    />
                    {ERR_firstName[key] ? <AppText mt1 small red ml2>Baby's first name is required*</AppText> : null}
                    <TextInput
                        value={lastName}
                        placeholder={"Baby's Last name"}
                        placeholderTextColor={COLORS.gray}
                        onChangeText={(text) => {
                            setLastName(prev => prev.map((val, i) => key === i ? text : val));
                        }}
                        style={[styles.dropdown2BtnStyle, styles.TxtInputTxtColor, { paddingLeft: 15, marginTop: 10, width: "100%" }]}
                    />
                    {ERR_lastName[key] ? <AppText mt1 small red ml2>Baby's last name is required*</AppText> : null}
                </View>

                {/* {renderIssue(val, key)} */}

                <View style={{ marginTop: MARGINS.mt4, width: "100%" }}>
                    <AppText bold blue h3 mb2>Did you experience any of these problems?</AppText>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => { onCheckIssue(key, issue1) }}>
                            {
                                (val?.delivery_problems).includes(issue1) ?
                                    <Check height={21} width={21} /> :
                                    <Uncheck height={21} width={21} />
                            }
                        </TouchableOpacity>

                        <AppText ml2 mb2 blue>{issue1}</AppText>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => { onCheckIssue(key, issue2) }}>
                            {
                                (val?.delivery_problems).includes(issue2) ?
                                    <Check height={21} width={21} /> :
                                    <Uncheck height={21} width={21} />
                            }
                        </TouchableOpacity>

                        <AppText ml2 mb2 blue>{issue2}</AppText>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => { onCheckIssue(key, issue3) }}>
                            {
                                (val?.delivery_problems).includes(issue3) ?
                                    <Check height={21} width={21} /> :
                                    <Uncheck height={21} width={21} />
                            }
                        </TouchableOpacity>

                        <AppText ml2 mb2 blue>{issue3}</AppText>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => { onCheckIssue(key, issue4) }}>
                            {
                                (val?.delivery_problems).includes(issue4) ?
                                    <Check height={21} width={21} /> :
                                    <Uncheck height={21} width={21} />
                            }
                        </TouchableOpacity>

                        <AppText ml2 mb2 blue>{issue4}</AppText>
                    </View>
                    {
                        ERR_problem[key] ? <AppText mt1 small red ml2> Please select at least one of the above*</AppText> : null
                    }
                </View>

                {
                    !(val?.delivery_problems).includes(issue3) ?
                        <View style={{ marginTop: MARGINS.mt3, marginBottom: MARGINS.mb2, width: "100%" }}>
                            <AppText bold blue h3 mb2>Are you planning to breastfeed?</AppText>
                            <AppSelectDropdown
                                onSelectItem={onChangeOption}
                                feild={"feed"}
                                dataList={FeedPlan}
                                defaultButtonText={is_breast_feed[[key]] ? is_breast_feed[[key]] : "Select a plan"}
                                cardKey={key}
                            />
                            {Err_is_breast_feed[key] ? <AppText mt1 small red ml2>Please select a plan*</AppText> : null}
                        </View>
                        :
                        null
                }

            </View>
        )
    }

    if (Loader) {
        return (
            <AppSafeAreaView edges={["left", "right"]}>
                <AppLayout onboarding>
                    <View style={[styles.alignJustifyCenter, { height: "100%", width: "100%" }]}>
                        <ActivityIndicator size="large" />
                    </View>
                </AppLayout>
            </AppSafeAreaView>
        )
    }
    return (
        <AppSafeAreaView edges={["left", "right"]}>
            <AppLayout onboarding>
                <AppScrollView>
                    {
                        babyBornDetails == "" ?
                            <AppContainer transparent>
                                <AppText textAlignCenter h2m bold blue>Hi{" " + user?.first_name},</AppText>
                                {/* <AppText mt2 textAlignCenter h3 blue>Congratulations on the birth of your baby,</AppText> */}
                                <AppText mt2 textAlignCenter h3 blue><AppText textAlignCenter h3 blue bold>To give you the best post-partum support</AppText>, please share some basic information.</AppText>

                                {
                                    inputDetails.map((val, key) => {
                                        return (
                                            renderInputCard(val, key)
                                        )
                                    })

                                }

                                {
                                    inputDetails.length < 3 ?
                                        <TouchableOpacity onPress={() => {
                                            onCreateNewObj()
                                        }} style={{ paddingVertical: 20 }}>
                                            <AppText InkBlue >+ Add another baby’s details</AppText>
                                        </TouchableOpacity>
                                        :
                                        null
                                }


                                <View style={{ marginTop: 20, flexDirection: "row" }}>
                                    <View style={{ width: "50%", paddingHorizontal: 10 }}>
                                        <AppButton
                                            onPress={() => { !loader && onSave() }}
                                            title={loader ? "Loading..." : "Save"}
                                            big
                                            blue
                                            // disabled={loader}
                                            alignSelf
                                        />
                                    </View>
                                    <View style={{ width: "50%", paddingHorizontal: 10 }}>
                                        <AppButton
                                            onPress={() => { navigation.goBack(); }}
                                            title={"Cancel"}
                                            big
                                            blue
                                            // disabled={loader}
                                            alignSelf
                                        />
                                    </View>
                                </View>
                            </AppContainer>
                            :
                            <AppContainer transparent>
                                <AppText h3>Thank you - we have already received the baby's delivery information.</AppText>
                            </AppContainer>

                    }

                </AppScrollView>
                <AppDatePicker
                    isOpenModal={openDatePicker}
                    maximumDate={new Date()}
                    current_date_temp={new Date()}
                    onSelectPress={(date_, index) => {
                        console.log("selected date", date_, index);
                        setDelDate(prev => prev.map((val, i) => index === i ? date_ + "" : val));
                        setOpenDatePicker(false)
                    }}
                    onCloseModal={() => { setOpenDatePicker(false) }}
                    index={cardIndex}
                />
                <ConfirmationModal
                    open={openModal}
                    setOpen={setOpenModal}
                    header={modalBody}
                    noBody
                    buttonTitle="Close"
                    onPress={() => { onclose_modal() }}
                />
            </AppLayout>
        </AppSafeAreaView>

    )
}

const styles = StyleSheet.create({
    Container: {
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    alignJustifyCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    pickerModal: {
        height: 300,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems: "center",
        width: "100%",
        padding: 20
    },
    TxtInputTxtColor: {
        color: COLORS.black
    },
    dropdown2BtnStyle: {
        width: '100%',
        height: 40,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.mediumBlue,

    },
    dropdown2BtnTxtStyle: {
        textAlign: 'left',
        fontSize: 15
        // fontWeight: 'bold',
    },
    dropdown2DropdownStyle: {
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    dropdown2RowStyle: { height: 39, backgroundColor: COLORS.white, borderBottomColor: '#C5C5C5' },
    dropdown2RowTxtStyle: {
        textAlign: 'left',
        fontSize: 15
        // fontWeight: 'bold',
    },
    boxShadow: {
        marginBottom: MARGINS.mb1,
        padding: 10,
        shadowColor: COLORS.primaryDark,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3
    },
})