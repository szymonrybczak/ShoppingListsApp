import React, { useEffect, useState } from 'react'
import { FlatList, View, Text, TouchableOpacity } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ScaledSheet } from 'react-native-size-matters'
import Dialog from 'react-native-dialog'
import ShoppingListsRouteParams from '../../navigation/ShoppingLists/ShoppingListsRouteParams'
import Product from '../../models/Product'
import AppActivityIndicator from '../../components/AppActivityIndicator'
import PlaceholderComponent from '../../components/PlaceholderComponent'
import APP_IMAGE from '../../common/images'
import i18n from '../../common/i18n/i18n'
import CreateButton from '../../components/CreateButton'
import { getList, archiveList } from '../../helpers/deviceStorage'
import { handleError } from '../../helpers/AppAlertManager'
import ShoppingListDetailsScreenItem from './ShoppingListDetailsScreenItem'
import List from '../../models/List'
import APP_COLORS from '../../common/colors'

type ShoppingListDetailsScreenRouteProp = RouteProp<
    ShoppingListsRouteParams,
    'ShoppingListDetailsScreen'
>

type ShoppingListDetailsScreenNavigationProp = StackNavigationProp<
    ShoppingListsRouteParams,
    'ShoppingListDetailsScreen'
>

interface ShoppingListDetailsScreenProps {
    route: ShoppingListDetailsScreenRouteProp
    navigation: ShoppingListDetailsScreenNavigationProp
}

const ShoppingListDetailsScreen: React.FC<ShoppingListDetailsScreenProps> = ({
    route,
    navigation,
}) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [list, setList] = useState<List>(route.params.list)
    const [archiveListAlertVisible, setArchiveListAlertVisible] =
        useState<boolean>(false)

    useEffect(() => {
        setNavigationBar()

        navigation.addListener('focus', fetchProducts)
        return () => {
            navigation.removeListener('focus', fetchProducts)
        }
    }, [])

    /* ------------------------- Fetching ------------------------- */

    const fetchProducts = () => {
        setLoading(true)

        getList(list)
            .then(setList)
            .catch(handleError)
            .finally(() => setLoading(false))
    }

    /* ------------------------- Update UI ------------------------- */

    const setNavigationBar = () => {
        navigation.setOptions({
            title: list.name,
            headerRight: renderArchiveButton,
        })
    }

    /* ------------------------- Handlers ------------------------- */

    const handleNavigateToAddProductScreen = () =>
        navigation.navigate('AddProductsScreen', { list })

    const handleArchiveList = async () => {
        toggleArchiveListAlertVisible()
        await archiveList(route.params.list)

        navigation.navigate('ShoppingListsScreen')
        navigation.navigate('ArchivedShoppingListsRoute')
    }

    /* ------------------------- Utils ------------------------- */

    const toggleArchiveListAlertVisible = () =>
        setArchiveListAlertVisible((prevState) => !prevState)

    /* ------------------------- Render functions ------------------------- */

    const renderActivityIndicator = (): JSX.Element => <AppActivityIndicator />

    const renderPlaceholderComponent = (): JSX.Element => (
        <PlaceholderComponent
            image={APP_IMAGE.notebook}
            title={i18n.t('empty_products_list')}
        />
    )

    const renderItem = (item: Product): JSX.Element => (
        <ShoppingListDetailsScreenItem
            navigation={navigation}
            list={list}
            product={item}
            fetchProducts={fetchProducts}
        />
    )

    const renderProductsList = (): JSX.Element => {
        const isListEmpty = list.products.length === 0
        if (isListEmpty) renderPlaceholderComponent()

        return (
            <FlatList
                data={list.products}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item) => item.name}
            />
        )
    }

    const renderNewProductButton = (): JSX.Element => (
        <CreateButton onPress={handleNavigateToAddProductScreen} />
    )

    const renderArchiveButton = (): JSX.Element => (
        <TouchableOpacity onPress={toggleArchiveListAlertVisible}>
            <Text style={styles.archiveButtonLabel}>{i18n.t('archive')}</Text>
        </TouchableOpacity>
    )

    const renderArchiveListAlert = (): JSX.Element => (
        <Dialog.Container visible={archiveListAlertVisible}>
            <Dialog.Title>{i18n.t('archive_list_alert_title')}</Dialog.Title>
            <Dialog.Description>
                {i18n.t('archive_list_alert_description')}
            </Dialog.Description>

            <Dialog.Button
                label={i18n.t('cancel')}
                onPress={toggleArchiveListAlertVisible}
            />
            <Dialog.Button
                label={i18n.t('archive')}
                onPress={handleArchiveList}
                bold
            />
        </Dialog.Container>
    )

    return (
        <View style={styles.container}>
            {loading && renderActivityIndicator()}
            {renderProductsList()}
            {renderNewProductButton()}
            {renderArchiveListAlert()}
        </View>
    )
}

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    archiveButtonLabel: {
        paddingRight: '4@ms',
        fontSize: '14@ms',
        fontWeight: '500',
        color: APP_COLORS.white,
    },
})

export default ShoppingListDetailsScreen
