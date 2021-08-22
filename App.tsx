import React from 'react'
import { View, StyleSheet } from 'react-native'
import DropdownAlert from 'react-native-dropdownalert'
import AppAlertManager from './src/helpers/AppAlertManager'

const App = () => (
    <View style={styles.container}>
        <DropdownAlert
            ref={(ref: DropdownAlert) => AppAlertManager.setDropdown(ref)}
        />
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default App
