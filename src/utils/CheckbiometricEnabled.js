

import TouchID from 'react-native-touch-id';

export function CheckbiometricEnabled() {

    const optionalConfigObject = {
        title: `Authentication Required`, // Android
        imageColor: '#e00606', // Android
        imageErrorColor: '#ff0000', // Android
        sensorDescription: 'Touch sensor', // Android
        sensorErrorDescription: 'Failed', // Android
        cancelText: 'Cancel', // Android
        fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
        unifiedErrors: false, // use unified error messages (default false)
        passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    return new Promise((resolve, reject) => {
        TouchID.isSupported(optionalConfigObject)
            .then(biometryType => {
                console.log("biometryType", biometryType)
                if (biometryType && biometryType != 'FaceID') {
                    resolve(true);
                } else {
                    let fingerprintLableForOS = Platform.OS == "ios" ? "Touch ID" : "Fingerprint";
                    reject(fingerprintLableForOS + " is not available on this device");
                }
            })
            .catch(error => {
                console.log("error", error.code)
                let errorCode = Platform.OS == "ios" ? error.name : error.code;
                if (errorCode === "LAErrorTouchIDNotEnrolled" || errorCode === "NOT_AVAILABLE" || errorCode === "NOT_ENROLLED") {
                    let fingerprintLableForOS = Platform.OS == "ios" ? "Touch ID" : "Fingerprint";
                    resolve(fingerprintLableForOS + " has no enrolled fingers. Please go to settings and enable " + fingerprintLableForOS + " on this device.");
                } else {
                    reject(Platform.OS == "ios" ? error.message : translations.t(error.code));
                }
            });
    });
}