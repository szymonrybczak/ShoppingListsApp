import List from '../../models/List'
import Product from '../../models/Product'
import Category from '../../models/Category'

type ShoppingListsRouteParams = {
    ShoppingListsScreen: undefined
    ShoppingListDetailsScreen: { list: List }
    NewListScreen: undefined
    AddProductsScreen: { list: List }
    ProductDetailsScreen: {
        product: Product
        list: List
    }
    CategoriesListScreen: {
        product?: Product
        list?: List
        setProductCategory?: (category: Category) => void
        chosenCategory?: Category
    }
    ArchivedShoppingListsRoute: undefined
}

export default ShoppingListsRouteParams
