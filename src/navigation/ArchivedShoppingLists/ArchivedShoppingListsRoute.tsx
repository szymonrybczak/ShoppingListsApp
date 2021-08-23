import React from 'react'
import {
    createStackNavigator,
    StackNavigationOptions,
} from '@react-navigation/stack'
import ArchivedShoppingListsRouteParams from './ArchivedShoppingListsRouteParams'
import ArchivedShoppingListsScreen from '../../screens/ArchivedShoppingListsScreen/ArchivedShoppingListsScreen'
import APP_COLORS from '../../common/colors'
import i18n from '../../common/i18n/i18n'

const Stack = createStackNavigator<ArchivedShoppingListsRouteParams>()

const ArchivedShoppingListsRoute = () => (
    <Stack.Navigator screenOptions={ArchivedShoppingListsStackNavigatorOptions}>
        <Stack.Screen
            name="ArchivedShoppingListsScreen"
            component={ArchivedShoppingListsScreen}
            options={ArchivedShoppingListScreenOptions}
        />
    </Stack.Navigator>
)

const ArchivedShoppingListsStackNavigatorOptions: StackNavigationOptions = {
    headerBackTitle: ' ',
    headerStyle: { backgroundColor: APP_COLORS.green },
    headerTintColor: APP_COLORS.white,
}

const ArchivedShoppingListScreenOptions: StackNavigationOptions = {
    title: i18n.t('archived_lists'),
}

export default ArchivedShoppingListsRoute
