import AsyncStorage from "@react-native-async-storage/async-storage";

async function addToAsyncStorage(name, dataSet) {
    const jsonData = JSON.stringify(dataSet);
    await AsyncStorage.setItem(name, jsonData);
}



async function getFromAsyncStorage(name) {
    try {
        const jsonData = await AsyncStorage.getItem(name);
        if (jsonData !== null) {
            return JSON.parse(jsonData);
        } else {
            //console.log(`No data found for ${name}`);
            return null;
        }
    } catch (error) {
        console.error(`Error retrieving data from AsyncStorage for ${name}:`, error);
        throw error;
    }
}

async function deleteFromAsyncStorage(name) {

    await AsyncStorage.removeItem(name);

}

export { addToAsyncStorage, deleteFromAsyncStorage, getFromAsyncStorage };