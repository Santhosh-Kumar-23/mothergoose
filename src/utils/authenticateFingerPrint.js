import TouchID from 'react-native-touch-id';

export function authenticateFingerPrint() {
    return new Promise((resolve, reject) => {
        let fingerprintLableForOS =
            Platform.OS == 'ios' ? 'Touch ID' : 'Fingerprint';
        TouchID.authenticate('Login to MotherGoose using ' + fingerprintLableForOS)
            .then((success: any) => {
                console.log('Authenticated Successfully', success);
                resolve(success);
            })
            .catch((error: any) => {
                console.log('Authentication Failed', error.code);
                reject(error);
            });
    });
};