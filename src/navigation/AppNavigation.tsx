import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
    BottomTabBarOptions,
    BottomTabNavigationOptions,
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome'
import AppTabBarParams from './AppTabBarParams'
import APP_COLORS from '../common/colors'
import ShoppingListsRoute from './ShoppingLists/ShoppingListsRoute'
import ArchivedShoppingListsRoute from './ArchivedShoppingLists/ArchivedShoppingListsRoute'
import i18n from '../common/i18n/i18n'

const Tab = createBottomTabNavigator<AppTabBarParams>()

const AppNavigation = () => (
    <NavigationContainer>
        <Tab.Navigator tabBarOptions={AppTabBarOptions}>
            <Tab.Screen
                name="ShoppingListsRoute"
                component={ShoppingListsRoute}
                options={ShoppingListsRouteOptions}
            />
            <Tab.Screen
                name="ArchivedShoppingListsRoute"
                component={ArchivedShoppingListsRoute}
                options={ArchivedShoppingListsRouteOptions}
            />
        </Tab.Navigator>
    </NavigationContainer>
)

const AppTabBarOptions: BottomTabBarOptions = {
    inactiveTintColor: APP_COLORS.gray,
    activeTintColor: APP_COLORS.green,
}

const ShoppingListsRouteOptions: BottomTabNavigationOptions = {
    title: i18n.t('my_lists'),
    tabBarIcon: ({ focused, size }) => (
        <Icon
            name="list"
            size={size}
            color={focused ? APP_COLORS.green : APP_COLORS.gray}
        />
    ),
}

const ArchivedShoppingListsRouteOptions: BottomTabNavigationOptions = {
    title: i18n.t('archived_lists'),
    tabBarIcon: ({ focused, size }) => (
        <Icon
            name="archive"
            size={size}
            color={focused ? APP_COLORS.green : APP_COLORS.gray}
        />
    ),
}

export default AppNavigation
