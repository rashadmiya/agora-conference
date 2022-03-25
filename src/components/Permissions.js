import { PermissionsAndroid } from 'react-native';
// import { requestCameraAndAudioPermission } from 'agora-rn-uikit/src/permission';

export default async function requestCameraAndAudioPermission() {
    try {

        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
            granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
            console.log('you can use camera and mic');
        } else {
            console.log('Permissions denied');
        }

    } catch (err) {
        console.warn(err)
    }
}