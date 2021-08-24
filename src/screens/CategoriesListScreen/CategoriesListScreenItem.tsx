import React from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import Category from '../../models/Category'
import APP_COLORS from '../../common/colors'

interface CategoriesListScreenItemProps {
    category: Category
    onItemPress: (category: Category) => void
    isChosen: boolean
}

const CategoriesListScreenItem: React.FC<CategoriesListScreenItemProps> = ({
    category,
    onItemPress,
    isChosen,
}) => {
    const { name, image } = category

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onItemPress(category)}>
            <Image source={image} style={styles.image} />
            <Text
                style={{
                    color: isChosen ? APP_COLORS.blue : APP_COLORS.black,
                }}>
                {name}
            </Text>
        </TouchableOpacity>
    )
}

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        margin: '8@ms',
    },
    image: {
        width: '30@ms',
        height: '30@ms',
        marginRight: '16@ms',
    },
})

export default CategoriesListScreenItem
