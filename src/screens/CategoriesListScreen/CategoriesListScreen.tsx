import React from 'react'
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
import { changeCategory } from '../../helpers/deviceStorage'

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
    /* ------------------------- Handlers ------------------------- */

    const handleItemPress = async (newCategory: Category) => {
        try {
            const { product, list, setCategory } = route.params

            if (setCategory) {
                setCategory(newCategory)
                navigation.goBack()
            }

            if (product && list) {
                await changeCategory(product, list, newCategory)
                navigation.goBack()
            }
        } catch {
            handleError()
        }
    }

    /* ------------------------- Rendering ------------------------- */

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

    return <View style={styles.container}>{renderCategoriesList()}</View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLORS.white,
    },
})

export default CategoriesListScreen
