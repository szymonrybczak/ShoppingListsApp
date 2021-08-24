import React from 'react'
import { View, Image, Text } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import Category from '../../models/Category'

interface CategoriesListScreenItemProps {
    category: Category
}

const CategoriesListScreenItem: React.FC<CategoriesListScreenItemProps> = ({
    category,
}) => {
    const { name, image } = category

    return (
        <View style={styles.container}>
            <Image source={image} style={styles.image} />
            <Text>{name}</Text>
        </View>
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
