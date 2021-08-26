import React, { useEffect, useState } from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import List from '../../models/List'
import ShoppingListsRouteParams from '../../navigation/ShoppingLists/ShoppingListsRouteParams'
import PlaceholderComponent from '../../components/PlaceholderComponent'
import APP_IMAGE from '../../common/images'
import i18n from '../../common/i18n/i18n'
import { getLists } from '../../helpers/deviceStorage'
import { handleError } from '../../helpers/AppAlertManager'
import AppActivityIndicator from '../../components/AppActivityIndicator'
import CreateButton from '../../components/CreateButton'
import ShoppingListsScreenItem from './ShoppingListsScreenItem'

export type ShoppingListsScreenNavigationProp = StackNavigationProp<
    ShoppingListsRouteParams,
    'ShoppingListsScreen'
>

interface ShoppingListsScreenProps {
    navigation: ShoppingListsScreenNavigationProp
}

const ShoppingListsScreen: React.FC<ShoppingListsScreenProps> = ({
    navigation,
}) => {
    const [lists, setLists] = useState<List[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        fetchLists()

        navigation.addListener('focus', () => fetchLists())
        return () => {
            navigation.removeListener('focus', () => fetchLists())
        }
    }, [])

    /* ------------------------- Fetching ------------------------- */

    const fetchLists = () => {
        setLoading(true)

        getLists()
            .then((lists) => setLists(filterLists(lists)))
            .catch(handleError)
            .finally(() => setLoading(false))
    }

    /* ------------------------- Utils ------------------------- */

    const toggleActivityIndicator = () => setLoading((prevState) => !prevState)

    const filterLists = (lists: List[]): List[] =>
        lists.filter((list) => !list.archived)

    /* ------------------------- Rendering functions ------------------------- */

    const renderActivityIndicator = (): JSX.Element => <AppActivityIndicator />

    const renderLists = (): JSX.Element => {
        const isListEmpty = lists.length === 0
        if (isListEmpty) return renderListPlaceholder()

        return (
            <FlatList
                keyExtractor={(list) => list.id.toString()}
                data={lists}
                renderItem={({ item }) => renderItem(item)}
                showsVerticalScrollIndicator={false}
            />
        )
    }

    const renderListPlaceholder = (): JSX.Element => (
        <PlaceholderComponent
            title={i18n.t('empty_shopping_list')}
            image={APP_IMAGE.notebook}
        />
    )

    const renderItem = (list: List): JSX.Element => (
        <ShoppingListsScreenItem
            list={list}
            fetchLists={fetchLists}
            navigation={navigation}
            toggleActivityIndicator={toggleActivityIndicator}
        />
    )

    const renderNewListButton = (): JSX.Element => (
        <CreateButton onPress={() => navigation.navigate('NewListScreen')} />
    )

    return (
        <View style={styles.container}>
            {renderLists()}
            {renderNewListButton()}
            {loading && renderActivityIndicator()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default ShoppingListsScreen
