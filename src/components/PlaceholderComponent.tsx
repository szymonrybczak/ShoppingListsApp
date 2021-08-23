import React from 'react'
import { Image, View, Text } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { APP_IMAGE } from '../common/assets'

interface PlaceholderComponentProps {
    title: string
    image: APP_IMAGE
}

const PlaceholderComponent: React.FC<PlaceholderComponentProps> = ({
    title,
    image,
}) => (
    <View style={styles.container}>
        <Image source={image} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
    </View>
)

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '150@ms',
        height: '150@ms',
    },
    title: {
        textAlign: 'center',
        fontSize: '20@ms',
        fontWeight: '600',
    },
})

export default PlaceholderComponent
