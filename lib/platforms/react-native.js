import { Linking, Platform } from 'react-native'; // eslint-disable-line import/no-unresolved, max-len
import SafariView from "react-native-safari-view";

let previousOnLinkChange;

function openURL(authUrl)
{
    if (Platform.OS === 'ios')
    {
        return SafariView.show({
            url: authUrl,
            fromBottom: true
        });
    }
    else{
        return Linking.openURL(authUrl);
    }
}

export const dance = authUrl => openURL(authUrl)
    .then(() => new Promise((resolve, reject) => {

    if (previousOnLinkChange) {
        Linking.removeEventListener('url', previousOnLinkChange);
    }

    const handleUrl = (url) => {
        if (Platform.OS === 'ios') {
            if (url && (url.indexOf("authorize") > -1 || url.indexOf("oauth2redirect") > -1)) {
                SafariView.dismiss();
            }
        }
    
        if (!url || url.indexOf('fail') > -1) {
            reject(url);
        } else {
            resolve(url);
        }
    };

    const onLinkChange = ({ url }) => {
        Linking.removeEventListener('url', onLinkChange);
        previousOnLinkChange = undefined;
        handleUrl(url);
    };

    Linking.addEventListener('url', onLinkChange);
    previousOnLinkChange = onLinkChange;
}));

export const request = fetch;