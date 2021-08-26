import React from 'react'
import { Text } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import APP_COLORS from '../common/colors'
import Product from '../models/Product'

interface PurchasedProductsCounterProps {
    products: Product[]
}

const PurchasedProductsCounter: React.FC<PurchasedProductsCounterProps> = ({
    products,
}) => {
    const purchasedProducts = products.filter(
        (product) => product.purchased
    ).length

    return (
        <Text
            style={
                styles.purchasedLabel
            }>{`${purchasedProducts}/${products.length}`}</Text>
    )
}

const styles = ScaledSheet.create({
    purchasedLabel: {
        fontSize: '16@ms',
        color: APP_COLORS.green,
    },
})

export default PurchasedProductsCounter
