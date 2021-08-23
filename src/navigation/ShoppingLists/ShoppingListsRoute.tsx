import React from 'react'
import {
    createStackNavigator,
    StackNavigationOptions,
} from '@react-navigation/stack'
import ShoppingListRouteParams from './ShoppingListRouteParams'
import ShoppingListsScreen from '../../screens/ShoppingListsScreen/ShoppingListsScreen'
import NewListScreen from '../../screens/NewListScreen/NewListScreen'
import AddProductsScreen from '../../screens/AddProductScreen/AddProductsScreen'
import ProductDetailsScreen from '../../screens/ProductDetailsSreen/ProductDetailsScreen'
import CategoriesListScreen from '../../screens/CategoriesListScreen/CategoriesListScreen'
import i18n from '../../common/i18n/i18n'
import APP_COLORS from '../../common/colors'
import ShoppingListDetailsScreen from '../../screens/ShoppingListDetailsScreen/ShoppingListDetailsScreen'

const Stack = createStackNavigator<ShoppingListRouteParams>()

const ShoppingListsRoute = () => (
    <Stack.Navigator screenOptions={ShoppingListsRouteStackNavigatorOptions}>
        <Stack.Screen
            name="ShoppingListsScreen"
            component={ShoppingListsScreen}
            options={ShoppingListsScreenOptions}
        />
        <Stack.Screen
            name="ShoppingListDetailsScreen"
            component={ShoppingListDetailsScreen}
            options={ShoppingListDetailsScreenOptions}
        />
        <Stack.Screen
            name="NewListScreen"
            component={NewListScreen}
            options={NewListScreenOptions}
        />
        <Stack.Screen
            name="AddProductsScreen"
            component={AddProductsScreen}
            options={AddProductScreenOptions}
        />
        <Stack.Screen
            name="ProductDetailsScreen"
            component={ProductDetailsScreen}
            options={ProductDetailsScreenOptions}
        />
        <Stack.Screen
            name="CategoriesListScreen"
            component={CategoriesListScreen}
            options={CategoriesListScreenOptions}
        />
    </Stack.Navigator>
)

const ShoppingListsRouteStackNavigatorOptions: StackNavigationOptions = {
    headerBackTitle: ' ',
    headerStyle: { backgroundColor: APP_COLORS.green },
    headerTintColor: APP_COLORS.white,
}

const ShoppingListsScreenOptions = {
    title: i18n.t('my_lists'),
}

const ShoppingListDetailsScreenOptions = {}

const NewListScreenOptions = {}

const AddProductScreenOptions = {}

const ProductDetailsScreenOptions = {}

const CategoriesListScreenOptions = {}

export default ShoppingListsRoute