import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import i18n from '../../common/i18n/i18n'
import AppAlertManager, { handleError } from '../../helpers/AppAlertManager'
import { deleteList, restoreList } from '../../helpers/deviceStorage'
import List from '../../models/List'
import APP_COLORS from '../../common/colors'
import PurchasedProductsCounter from '../../components/PurchasedProductsCounter'
import ProductsProgressBar from '../../components/ProductsProgressBar'
import { ArchivedShoppingListsScreenNavigationProp } from './ArchivedShoppingListsScreen'

interface ArchivedShoppingListsScreenItemProps {
    list: List
    navigation: ArchivedShoppingListsScreenNavigationProp
    fetchLists: () => void
    toggleActivityIndicator: () => void
}

const ArchivedShoppingListsScreenItem: React.FC<ArchivedShoppingListsScreenItemProps> =
    ({ list, navigation, fetchLists, toggleActivityIndicator }) => {
        const { name, products } = list

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

        const handleRestoreList = async () => {
            toggleActivityIndicator()

            await restoreList(list)
                .then(fetchLists)
                .catch(handleError)
                .finally(toggleActivityIndicator)

            if (list)
                navigation.navigate('ShoppingListsRoute', {
                    screen: 'ShoppingListDetailsScreen',
                    params: { list },
                })

            AppAlertManager.showSuccessfulToast(
                undefined,
                i18n.t('successfully_restored_list')
            )
        }

        /* ------------------------- Rendering functions ------------------------- */

        const renderNamePurchasedLabel = (): JSX.Element => (
            <View style={styles.titlePurchasedLabelContainer}>
                <Text style={styles.title}>{name}</Text>
                <PurchasedProductsCounter products={products} />
            </View>
        )

        const renderProgressBar = (): JSX.Element => (
            <ProductsProgressBar products={products} />
        )

        const renderButtons = (): JSX.Element => (
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    onPress={handleDeleteCurrentItem}
                    style={[styles.baseButton, styles.deleteButton]}>
                    <Text style={styles.deleteButtonLabel}>
                        {i18n.t('delete')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleRestoreList}
                    style={[styles.baseButton, styles.restoreButton]}>
                    <Text style={styles.restoreButtonLabel}>
                        {i18n.t('restore')}
                    </Text>
                </TouchableOpacity>
            </View>
        )

        return (
            <View style={styles.container}>
                {renderNamePurchasedLabel()}
                {renderProgressBar()}
                {renderButtons()}
            </View>
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
    buttonsContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: '16@ms',
    },
    baseButton: {
        flex: 1,
        alignItems: 'center',
        padding: '16@ms',
        margin: '8@ms',
        borderRadius: 100,
    },
    deleteButton: {
        borderWidth: '1@ms',
        borderColor: APP_COLORS.red,
    },
    restoreButton: {
        backgroundColor: APP_COLORS.green,
    },
    deleteButtonLabel: {
        color: APP_COLORS.red,
        fontSize: '16@ms',
    },
    restoreButtonLabel: {
        color: APP_COLORS.white,
        fontSize: '16@ms',
    },
})

export default ArchivedShoppingListsScreenItem
