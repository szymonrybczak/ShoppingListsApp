import List from '../../models/List'
import Product from '../../models/Product'
import Category from '../../models/Category'

type ShoppingListsRouteParams = {
    ShoppingListsScreen: undefined
    ShoppingListDetailsScreen: { list: List }
    NewListScreen: undefined
    AddProductsScreen: { list: List }
    ProductDetailsScreen: undefined
    CategoriesListScreen: {
        product?: Product
        list?: List
        setCategory?: (category: Category) => void
        chosenCategory?: Category
    }
}

export default ShoppingListsRouteParams
