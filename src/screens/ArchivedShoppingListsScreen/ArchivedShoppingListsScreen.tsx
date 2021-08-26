import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { getArchivedLists } from '../../helpers/deviceStorage'
import ArchivedShoppingListsRouteParams from '../../navigation/ArchivedShoppingLists/ArchivedShoppingListsRouteParams'
import PlaceholderComponent from '../../components/PlaceholderComponent'
import i18n from '../../common/i18n/i18n'
import APP_IMAGE from '../../common/images'
import { handleError } from '../../helpers/AppAlertManager'
import AppActivityIndicator from '../../components/AppActivityIndicator'
import ArchivedShoppingListsScreenItem from './ArchivedShoppingListScreenItem'
import List from '../../models/List'

export type ArchivedShoppingListsScreenNavigationProp = StackNavigationProp<
    ArchivedShoppingListsRouteParams,
    'ArchivedShoppingListsScreen'
>

interface ArchivedShoppingListsScreenProps {
    navigation: ArchivedShoppingListsScreenNavigationProp
}

const ArchivedShoppingListsScreen: React.FC<ArchivedShoppingListsScreenProps> =
    ({ navigation }) => {
        const [archivedLists, setArchivedLists] = useState<List[]>([])
        const [loading, setLoading] = useState<boolean>(false)

        useEffect(() => {
            fetchLists()

            navigation.addListener('focus', fetchLists)
            return () => {
                navigation.removeListener('focus', fetchLists)
            }
        }, [])

        /* ------------------------- Utils ------------------------- */

        const toggleActivityIndicator = () =>
            setLoading((prevState) => !prevState)

        /* ------------------------- Fetching ------------------------- */

        const fetchLists = () => {
            setLoading(true)

            getArchivedLists()
                .then(setArchivedLists)
                .catch(handleError)
                .finally(() => setLoading(false))
        }
        /* ------------------------- Rendering functions ------------------------- */

        const renderActivityIndicator = (): JSX.Element => (
            <AppActivityIndicator />
        )

        const renderListPlaceholder = (): JSX.Element => (
            <PlaceholderComponent
                image={APP_IMAGE.notebook}
                title={i18n.t('archived_lists_placeholder_text')}
            />
        )

        const renderList = (): JSX.Element => {
            const isListEmpty = archivedLists.length === 0
            if (isListEmpty) return renderListPlaceholder()

            return (
                <FlatList
                    keyExtractor={(item) => item.id.toString()}
                    data={archivedLists}
                    renderItem={({ item }) => renderItem(item)}
                    showsVerticalScrollIndicator={false}
                />
            )
        }

        const renderItem = (list: List): JSX.Element => (
            <ArchivedShoppingListsScreenItem
                list={list}
                navigation={navigation}
                fetchLists={fetchLists}
                toggleActivityIndicator={toggleActivityIndicator}
            />
        )

        return (
            <View style={styles.container}>
                {renderList()}
                {loading && renderActivityIndicator()}
            </View>
        )
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default ArchivedShoppingListsScreen
