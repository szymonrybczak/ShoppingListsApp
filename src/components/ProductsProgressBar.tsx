import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import Product from '../models/Product'
import APP_COLORS from '../common/colors'

interface ProductsProgressBarProps {
    products: Product[]
}

const ProductsProgressBar: React.FC<ProductsProgressBarProps> = ({
    products,
}) => {
    const purchasedProducts = products.filter(
        (product) => product.purchased
    ).length

    const fullWidth = 100
    const progressWidth = (fullWidth / products.length) * purchasedProducts
    const finalProgressWidth = Number.isNaN(progressWidth)
        ? `0%`
        : `${progressWidth}%`

    return (
        <View style={styles.progressBarContainer}>
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: APP_COLORS.green,
                        width: finalProgressWidth,
                    },
                ]}
            />
        </View>
    )
}

const styles = ScaledSheet.create({
    progressBarContainer: {
        height: '4@ms',
        backgroundColor: APP_COLORS.lightGray,
    },
})

export default ProductsProgressBar
