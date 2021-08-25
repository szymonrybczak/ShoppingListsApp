import React, { useState } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import _ from 'lodash'
import categories from '../../data/categories'
import Category from '../../models/Category'
import CategoriesListScreenItem from './CategoriesListScreenItem'
import APP_COLORS from '../../common/colors'
import ShoppingListsRouteParams from '../../navigation/ShoppingLists/ShoppingListsRouteParams'
import { handleError } from '../../helpers/AppAlertManager'
import { setProductDetail } from '../../helpers/deviceStorage'
import AppActivityIndicator from '../../components/AppActivityIndicator'

type CategoriesListScreenNavigationProp = StackNavigationProp<
    ShoppingListsRouteParams,
    'CategoriesListScreen'
>

type CategoriesListScreenRouteProp = RouteProp<
    ShoppingListsRouteParams,
    'CategoriesListScreen'
>

interface CategoriesListScreenProps {
    navigation: CategoriesListScreenNavigationProp
    route: CategoriesListScreenRouteProp
}

const CategoriesListScreen: React.FC<CategoriesListScreenProps> = ({
    route,
    navigation,
}) => {
    const [loading, setLoading] = useState<boolean>(false)

    /* ------------------------- Handlers ------------------------- */
    const handleItemPress = async (newCategory: Category) => {
        try {
            const { product, list, setProductCategory } = route.params

            if (setProductCategory) {
                setProductCategory(newCategory)
                navigation.goBack()
            }

            if (product && list) {
                setLoading(true)
                await setProductDetail(product, list, {
                    productCategory: newCategory,
                })
                navigation.goBack()
            }
        } catch {
            handleError()
        } finally {
            setLoading(false)
        }
    }

    /* ------------------------- Rendering ------------------------- */

    const renderActivityIndicator = (): JSX.Element => <AppActivityIndicator />

    const renderCategoriesList = (): JSX.Element => (
        <FlatList
            data={categories}
            renderItem={({ item }) => renderItem(item)}
        />
    )

    const renderItem = (category: Category): JSX.Element => {
        const isChosen = _.isEqual(category, route.params.chosenCategory)

        return (
            <CategoriesListScreenItem
                category={category}
                onItemPress={handleItemPress}
                isChosen={isChosen}
            />
        )
    }

    return (
        <View style={styles.container}>
            {renderCategoriesList()}
            {loading && renderActivityIndicator()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLORS.white,
    },
})

export default CategoriesListScreen
