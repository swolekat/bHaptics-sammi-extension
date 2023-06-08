import tactJs from 'tact-js';
tactJs.initialize("testApp", "testAppName")
tactJs.turnOffAll();

let key = 0;

const getKey = () => {
    key +=1;
    return `${key}`;
};

window.vestControl = {
    sendDot: ({index, intensity, duration, position='VestFront'}) => {
        tactJs.submitDot(getKey(), position, [{Index: index, Intensity: intensity}], duration);
    },
    sendPath: ({points, duration, position='VestFront'}) => {
        tactJs.submitPath(getKey(), position, points, duration);
    },
};