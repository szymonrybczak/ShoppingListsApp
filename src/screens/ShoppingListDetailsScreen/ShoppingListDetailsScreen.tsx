import React, { useEffect, useState } from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import ShoppingListsRouteParams from '../../navigation/ShoppingLists/ShoppingListsRouteParams'
import Product from '../../models/Product'
import AppActivityIndicator from '../../components/AppActivityIndicator'
import PlaceholderComponent from '../../components/PlaceholderComponent'
import { APP_IMAGE } from '../../common/assets'
import i18n from '../../common/i18n/i18n'
import CreateButton from '../../components/CreateButton'
import { getList } from '../../helpers/deviceStorage'
import { handleError } from '../../helpers/AppAlertManager'
import ShoppingListDetailsScreenItem from './ShoppingListDetailsScreenItem'

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
    const { list } = route.params

    const [loading, setLoading] = useState<boolean>(false)
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        setNavigationTitle()

        navigation.addListener('focus', () => fetchProducts())
        return () => {
            navigation.removeListener('focus', () => fetchProducts())
        }
    }, [])

    /* ------------------------- Update UI ------------------------- */

    const setNavigationTitle = () => {
        navigation.setOptions({ title: list.name })
    }

    /* ------------------------- Fetching ------------------------- */

    const fetchProducts = () => {
        setLoading(true)

        getList(list.id)
            .then((list) => setProducts(list.products))
            .catch(handleError)
            .finally(() => setLoading(false))
    }

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
        const isListEmpty = products.length === 0
        if (isListEmpty) renderPlaceholderComponent()

        return (
            <FlatList
                data={products}
                renderItem={({ item }) => renderItem(item)}
                keyExtractor={(item) => item.name}
            />
        )
    }

    const renderNewProductButton = (): JSX.Element => (
        <CreateButton
            onPress={() => navigation.navigate('AddProductsScreen')}
        />
    )

    return (
        <View style={styles.container}>
            {loading && renderActivityIndicator()}
            {renderProductsList()}
            {renderNewProductButton()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default ShoppingListDetailsScreen
