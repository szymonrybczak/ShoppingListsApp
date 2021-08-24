import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import categories from '../../data/categories'
import Category from '../../models/Category'
import CategoriesListScreenItem from './CategoriesListScreenItem'
import APP_COLORS from '../../common/colors'

const CategoriesListScreen: React.FC = () => {
    const renderItem = (category: Category): JSX.Element => (
        <CategoriesListScreenItem category={category} />
    )

    const renderCategoriesList = (): JSX.Element => (
        <FlatList
            data={categories}
            renderItem={({ item }) => renderItem(item)}
        />
    )

    return <View style={styles.container}>{renderCategoriesList()}</View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLORS.white,
    },
})

export default CategoriesListScreen
