import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { APP_ICONS } from '../common/assets'
import APP_COLORS from '../common/colors'

interface CreateButtonProps {
    onPress: () => void
}

const CreateButton: React.FC<CreateButtonProps> = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.container}>
        <Image source={APP_ICONS.plus} style={styles.image} />
    </TouchableOpacity>
)

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        bottom: '16@ms',
        right: '16@ms',
        padding: '16@ms',
        borderRadius: 100,
        backgroundColor: APP_COLORS.blue,
    },
    image: {
        width: '25@ms',
        height: '25@ms',
        tintColor: APP_COLORS.white,
    },
})

export default CreateButton
