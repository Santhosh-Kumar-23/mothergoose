import { useState, useEffect } from 'react';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { Platform } from "react-native";

export const useBiometrics = () => {
    const [showBioLogin, setShowBioLogin] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const checkBiometricsAvailability = async () => {
            const rnBiometrics = new ReactNativeBiometrics();
            const { available, biometryType } = await rnBiometrics.isSensorAvailable();
            const bioSelected = true;

            if (
                available &&
                (
                    (Platform.OS === 'ios' && (biometryType === BiometryTypes.FaceID || biometryType === BiometryTypes.TouchID)) ||
                    (Platform.OS === 'android' && biometryType === BiometryTypes.Biometrics)
                ) &&
                bioSelected === true
            ) {
                setShowBioLogin(true);
            } else {
                setShowBioLogin(false);
            }
            setIsInitialized(true);
        };
        checkBiometricsAvailability();
    }, []);

    return { showBioLogin, isInitialized };
};
