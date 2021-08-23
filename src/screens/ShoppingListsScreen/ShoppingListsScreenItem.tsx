import React, { useRef, useState } from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    Animated,
    StyleSheet,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { ScaledSheet } from 'react-native-size-matters'
import Dialog from 'react-native-dialog'
import ShoppingListsRouteParams from '../../navigation/ShoppingLists/ShoppingListsRouteParams'
import List from '../../models/List'
import APP_COLORS from '../../common/colors'
import renderRightAction from '../../helpers/SwipeableHelper'
import i18n from '../../common/i18n/i18n'
import AppAlertManager, { handleError } from '../../helpers/AppAlertManager'
import { renameList, deleteList } from '../../helpers/deviceStorage'

type ShoppingListsScreenNavigationProp = StackNavigationProp<
    ShoppingListsRouteParams,
    'ShoppingListsScreen'
>

interface ShoppingListsScreenItemProps {
    list: List
    navigation: ShoppingListsScreenNavigationProp
    fetchLists: () => void
    toggleActivityIndicator: () => void
}

const ShoppingListsScreenItem: React.FC<ShoppingListsScreenItemProps> = ({
    list,
    navigation,
    fetchLists,
    toggleActivityIndicator,
}) => {
    const { name, products } = list

    const [renameListAlertVisible, setRenameListAlertVisible] = useState(false)
    const [newListName, setNewListName] = useState('')

    const swipeableRowRef = useRef<Swipeable>(null)

    /* ------------------------- Handlers ------------------------- */

    const handleDeleteCurrentItem = () => {
        toggleActivityIndicator()

        deleteList(list)
            .then(fetchLists)
            .catch(handleError)
            .finally(toggleActivityIndicator)

        AppAlertManager.showSuccessfulToast(
            undefined,
            i18n.t('successfully_deleted_list')
        )
    }

    const handleRenameList = () => {
        const isNewListNameEmpty = newListName.trim().length === 0
        if (isNewListNameEmpty) {
            AppAlertManager.showErrorToast(
                undefined,
                i18n.t('list_name_is_empty')
            )
            return
        }

        toggleActivityIndicator()

        renameList(list, newListName)
            .then(fetchLists)
            .catch(handleError)
            .finally(toggleActivityIndicator)

        setRenameListAlertVisible(false)
        setNewListName('')

        AppAlertManager.showSuccessfulToast(
            undefined,
            i18n.t('successfully_changed_list_name')
        )
    }

    const handleHideRenameListAlert = () => {
        setNewListName('')
        setRenameListAlertVisible(false)
    }

    /* ------------------------- Utils ------------------------- */

    const purchasedProductsAmount = products.filter(
        (product) => product.purchased
    ).length

    const productsAmount = products.length

    /* ------------------------- Rendering functions ------------------------- */

    const renderNamePurchasedLabel = (): JSX.Element => (
        <View style={styles.titlePurchasedLabelContainer}>
            <Text style={styles.title}>{name}</Text>
            <Text
                style={
                    styles.purchasedLabel
                }>{`${purchasedProductsAmount}/${productsAmount}`}</Text>
        </View>
    )

    const renderProgressBar = (): JSX.Element => {
        const fullWidth = 100
        const progressWidth =
            (fullWidth / productsAmount) * purchasedProductsAmount

        return (
            <View style={styles.progressBarContainer}>
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: APP_COLORS.green,
                            width: `${progressWidth}%`,
                        },
                    ]}
                />
            </View>
        )
    }

    const renderRenameListAlert = (): JSX.Element => (
        <Dialog.Container visible={renameListAlertVisible}>
            <Dialog.Title>{i18n.t('change_list_name')}</Dialog.Title>
            <Dialog.Input
                value={newListName}
                onChangeText={(text) => setNewListName(text)}
                placeholder={i18n.t('list_name')}
            />
            <Dialog.Button
                label={i18n.t('cancel')}
                onPress={handleHideRenameListAlert}
            />
            <Dialog.Button
                label={i18n.t('change')}
                onPress={handleRenameList}
            />
        </Dialog.Container>
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
                () => setRenameListAlertVisible(true),
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
            <TouchableOpacity
                style={styles.container}
                onPress={() =>
                    navigation.navigate('ShoppingListDetailsScreen', {
                        list,
                    })
                }>
                {renderNamePurchasedLabel()}
                {renderProgressBar()}
                {renderRenameListAlert()}
            </TouchableOpacity>
        </Swipeable>
    )
}

const styles = ScaledSheet.create({
    container: {
        padding: '16@ms',
        margin: '16@ms',
        backgroundColor: APP_COLORS.white,
        shadowColor: APP_COLORS.black,
        shadowOpacity: 0.2,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0,
        },
    },
    rightActionsContainer: {
        flexDirection: 'row',
        width: '128@ms',
    },
    titlePurchasedLabelContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '16@ms',
    },
    title: {
        fontSize: '16@ms',
    },
    purchasedLabel: {
        fontSize: '16@ms',
        color: APP_COLORS.green,
    },
    progressBarContainer: {
        height: '4@ms',
        alignSelf: 'stretch',
        backgroundColor: APP_COLORS.lightGray,
    },
})

export default ShoppingListsScreenItem
