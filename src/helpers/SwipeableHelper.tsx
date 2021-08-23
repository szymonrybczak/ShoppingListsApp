import React, { RefObject } from 'react'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'
import { ScaledSheet } from 'react-native-size-matters'
import { Text, Animated } from 'react-native'
import APP_COLORS from '../common/colors'

const renderRightAction = (
    text: string,
    color: string,
    width: number,
    progress: Animated.AnimatedInterpolation,
    onPress: () => void,
    swipeableRowRef: RefObject<Swipeable>
) => {
    const transition = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [width, 0],
    })

    const handlePress = () => {
        onPress()
        swipeableRowRef.current?.close()
    }

    return (
        <Animated.View
            style={{ flex: 1, transform: [{ translateX: transition }] }}>
            <RectButton
                style={[styles.rightAction, { backgroundColor: color }]}
                onPress={handlePress}>
                <Text style={styles.text}>{text}</Text>
            </RectButton>
        </Animated.View>
    )
}

const styles = ScaledSheet.create({
    rightAction: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: APP_COLORS.white,
        fontSize: '16@ms',
        backgroundColor: 'transparent',
    },
})

export default renderRightAction
