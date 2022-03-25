import React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const CallingScreen = () => {
    return (
        <View style={Styles.page}>
            <View style={Styles.camaraPriview}>
                <View style={{ alignItems: "center" }}>
                    <Text style={Styles.name}>Rashad ❤</Text>
                    <Text style={Styles.phoneNumber}>ringing +88 017 45 221040</Text>
                </View>

                <View style={Styles.controlBox}>
                    <Text>bottom box</Text>
                    <Icon name='rocket' size={30} />
                </View>
            </View>


        </View>
    );
};

const Styles = StyleSheet.create({
    page: {
        height: '100%'
    },
    camaraPriview: {
        backgroundColor: '#7b4e80',
        flex: 1,
        paddingTop: 60,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    name: {
        fontSize: 22,
        color: 'white'
    },
    phoneNumber: {
        fontSize: 18,
        color: "white",
        marginTop: 10
    },
    controlBox: {
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#333333',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15
    }
})

export default CallingScreen;