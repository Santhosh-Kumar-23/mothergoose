import AsyncStorage from '@react-native-async-storage/async-storage';
export async function RemoveAllAsync() {
    let keys = []
    try {
        keys = await AsyncStorage.getAllKeys()
        console.log(`Keys: ${keys}`) // Just to see what's going on
        await AsyncStorage.multiRemove(keys)
    } catch (e) {
        console.log("RemoveAllAsync err", e)
    }
    console.log('Done')
    return true;
}