import React, { useState } from 'react';
import {Dimensions, StyleSheet, Text, View, TouchableOpacity, Button
} from "react-native";

const { height, width } = Dimensions.get('window')

const randomHex = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const App = (props) => {
    const [backgroundColor, setColor] = useState(randomHex())
    const onClick = () => setColor(randomHex())
    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity
                onPress={onClick}
                style={[
                    styles.container,
                    { backgroundColor: randomHex() }
                ]}
            >
                <Text style={styles.instructions}>Замена цветов в один клик!</Text>
            </TouchableOpacity>
        </View >
        
    );
}

const styles = StyleSheet.create({
    container: {
        height,
        width,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: randomHex(),
    },
    instructions: {
        color: "black",
    },
    mainContainer: {
        height,
        width
    }
});

export default App