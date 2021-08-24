import React, { useRef } from 'react'
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import CheckBox from '@react-native-community/checkbox'
import { StackNavigationProp } from '@react-navigation/stack'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import List from '../../models/List'
import Product from '../../models/Product'
import ShoppingListsRouteParams from '../../navigation/ShoppingLists/ShoppingListsRouteParams'
import APP_COLORS from '../../common/colors'
import { purchaseProduct, deleteProduct } from '../../helpers/deviceStorage'
import i18n from '../../common/i18n/i18n'
import AppAlertManager, { handleError } from '../../helpers/AppAlertManager'
import renderRightAction from '../../helpers/SwipeableHelper'

type ShoppingListDetailsScreenNavigationProp = StackNavigationProp<
    ShoppingListsRouteParams,
    'ShoppingListDetailsScreen'
>

interface ShoppingListDetailsScreenItemProps {
    navigation: ShoppingListDetailsScreenNavigationProp
    list: List
    product: Product
    fetchProducts: () => void
}

const ShoppingListDetailsScreenItem: React.FC<ShoppingListDetailsScreenItemProps> =
    ({ product, navigation, list, fetchProducts }) => {
        const { name, category, purchased, quantity, unit } = product

        const swipeableRowRef = useRef<Swipeable>(null)

        /* ------------------------- Handlers ------------------------- */

        const handleChangePurchasedStatus = async () => {
            await purchaseProduct(product, list)
        }

        const handleNavigateToProductDetailsScreen = () => {
            navigation.navigate('ProductDetailsScreen')
        }

        const handleNavigateToCategoriesListScreen = () => {
            navigation.navigate('CategoriesListScreen')
        }

        const handleDeleteCurrentItem = async () => {
            try {
                await deleteProduct(product, list)
                await fetchProducts()

                AppAlertManager.showSuccessfulToast(
                    undefined,
                    i18n.t('successfully_deleted_product')
                )
            } catch {
                handleError()
            }
        }

        /* ------------------------- Rendering ------------------------- */

        const renderCategoryImage = (): JSX.Element => (
            <TouchableOpacity onPress={handleNavigateToCategoriesListScreen}>
                <Image source={category.image} style={styles.categoryImage} />
            </TouchableOpacity>
        )

        const renderCheckBox = (): JSX.Element => (
            <CheckBox
                value={purchased}
                onValueChange={handleChangePurchasedStatus}
            />
        )

        const renderNameLabel = (): JSX.Element => (
            <Text style={styles.name} numberOfLines={1}>
                {name}
            </Text>
        )

        const renderQuantityAndUnitLabel = (): JSX.Element => (
            <View style={styles.quantityUnitLabelContainer}>
                <Text
                    style={styles.quantityUnitLabel}
                    numberOfLines={1}>{`${quantity} ${unit}`}</Text>
            </View>
        )

        const renderRightActions = (
            progress: Animated.AnimatedInterpolation
        ): JSX.Element => (
            <View style={styles.rightActionsContainer}>
                {renderRightAction(
                    i18n.t('edit'),
                    APP_COLORS.lightGray,
                    128,
                    progress,
                    handleNavigateToProductDetailsScreen,
                    swipeableRowRef
                )}
                {renderRightAction(
                    i18n.t('delete'),
                    APP_COLORS.red,
                    64,
                    progress,
                    handleDeleteCurrentItem,
                    swipeableRowRef
                )}
            </View>
        )

        return (
            <Swipeable
                ref={swipeableRowRef}
                friction={2}
                renderRightActions={renderRightActions}>
                <View style={styles.container}>
                    {renderCheckBox()}
                    {renderNameLabel()}
                    {renderQuantityAndUnitLabel()}
                    {renderCategoryImage()}
                </View>
            </Swipeable>
        )
    }

const styles = ScaledSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: '8@ms',
    },
    name: {
        flex: 3,
        marginHorizontal: '8@ms',
    },
    quantityUnitLabelContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    quantityUnitLabel: {
        color: APP_COLORS.gray,
    },
    categoryImage: {
        width: '30@ms',
        height: '30@ms',
        marginHorizontal: '4@ms',
    },
    rightActionsContainer: {
        flexDirection: 'row',
        width: '128@ms',
    },
})

export default ShoppingListDetailsScreenItem
