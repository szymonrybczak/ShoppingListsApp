import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import APP_COLORS from '../common/colors'

const AppActivityIndicator = () => (
    <View style={styles.container}>
        <ActivityIndicator size="large" color={APP_COLORS.lightGray} />
    </View>
)

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: '50%',
        right: '50%',
        bottom: '50%',
    },
})

export default AppActivityIndicator
