import AsyncStorage from '@react-native-async-storage/async-storage'
import { handleError } from './AppAlertManager'
import List from '../models/List'
import Product from '../models/Product'
import Category from '../models/Category'

/* ------------------------- Lists ------------------------- */

export async function getLists(): Promise<List[]> {
    try {
        return await getFromAsyncStorage('lists')
    } catch {
        handleError()
        return DefaultValues.lists
    }
}

export async function renameList(list: List, newName: string) {
    try {
        const lists = await getLists()

        const listIndex = await getListIndex(list)
        if (listIndex === -1) return

        lists[listIndex].name = newName

        await saveToAsyncStorage('lists', JSON.stringify(lists))
    } catch {
        handleError()
    }
}

export async function deleteList(list: List) {
    try {
        const lists = await getLists()

        const listIndex = await getListIndex(list)
        if (listIndex === -1) return

        lists.splice(listIndex, 1)

        await saveToAsyncStorage('lists', JSON.stringify(lists))
    } catch {
        handleError()
    }
}

export async function createList(list: List) {
    try {
        const lists = await getLists()
        const allLists = lists.concat(list)

        await saveToAsyncStorage('lists', JSON.stringify(allLists))
    } catch {
        handleError()
    }
}

export async function getListIndex(list: List): Promise<number> {
    const defaultReturnValue = -1

    try {
        const lists = await getLists()
        const listsIds = lists.map((list) => list.id)

        const listIndex = listsIds.indexOf(list.id)

        if (listIndex === -1) return defaultReturnValue
        if (lists[listIndex] === undefined) return defaultReturnValue

        return listIndex
    } catch {
        handleError()
        return defaultReturnValue
    }
}

export async function getList(list: List): Promise<List> {
    try {
        const lists = await getLists()

        const listIndex = await getListIndex(list)
        if (listIndex === -1) return DefaultValues.list

        return lists[listIndex]
    } catch {
        handleError()
        return DefaultValues.list
    }
}

/* ------------------------- Archived lists ------------------------- */

export async function getArchivedLists(): Promise<List[]> {
    try {
        const lists = await getFromAsyncStorage('lists')
        if (lists.length === 0) return []

        return lists.filter((list: List) => list.archived)
    } catch {
        handleError()
        return DefaultValues.lists
    }
}

export async function archiveList(list: List) {
    try {
        const lists = await getLists()

        const listIndex = await getListIndex(list)
        if (listIndex === -1) return

        lists[listIndex].archived = true

        await saveToAsyncStorage('lists', JSON.stringify(lists))
    } catch {
        handleError()
    }
}

export async function restoreList(list: List) {
    try {
        const lists = await getLists()

        const listIndex = await getListIndex(list)
        if (listIndex === -1) return

        lists[listIndex].archived = false

        await saveToAsyncStorage('lists', JSON.stringify(lists))
    } catch {
        handleError()
    }
}

/* ------------------------- Product ------------------------- */

export async function createProduct(product: Product, list: List) {
    try {
        const lists = await getLists()
        const listIndex = await getListIndex(list)

        const listProducts = lists[listIndex].products
        listProducts.push(product)

        await saveToAsyncStorage('lists', JSON.stringify(lists))
    } catch {
        handleError()
    }
}

export async function deleteProduct(product: Product, list: List) {
    try {
        const lists = await getLists()

        const productIndex = await getProductIndex(product, list)
        const listIndex = await getListIndex(list)
        if (listIndex === -1 || productIndex === -1) return

        lists[listIndex].products.splice(productIndex, 1)

        await saveToAsyncStorage('lists', JSON.stringify(lists))
    } catch {
        handleError()
    }
}

export async function getProductIndex(
    product: Product,
    list: List
): Promise<number> {
    try {
        const listProductsNames = list.products.map((list) => list.name)
        const productIndex = listProductsNames.indexOf(product.name)
        if (productIndex === -1) return -1

        return productIndex
    } catch {
        handleError()
        return -1
    }
}

export async function purchaseProduct(product: Product, list: List) {
    try {
        const lists = await getLists()

        const productIndex = await getProductIndex(product, list)
        const listIndex = await getListIndex(list)
        if (listIndex === -1 || productIndex === -1) return

        lists[listIndex].products[productIndex].purchased = !product.purchased

        await saveToAsyncStorage('lists', JSON.stringify(lists))
    } catch {
        handleError()
    }
}

export async function setProductDetail(
    product: Product,
    list: List,
    payload: {
        productCategory?: Category
        productName?: string
        productQuantity?: number
        productUnit?: string
    }
) {
    try {
        const lists = await getLists()

        const productIndex = await getProductIndex(product, list)
        const listIndex = await getListIndex(list)
        if (listIndex === -1 || productIndex === -1) return

        const currentProduct = lists[listIndex].products[productIndex]

        const { productCategory, productName, productQuantity, productUnit } =
            payload

        if (productCategory) currentProduct.category = productCategory
        if (productName) currentProduct.name = productName
        if (productQuantity) currentProduct.quantity = productQuantity
        if (productUnit) currentProduct.unit = productUnit

        await saveToAsyncStorage('lists', JSON.stringify(lists))
    } catch {
        handleError()
    }
}

/* ------------------------- Generic functions ------------------------- */

export async function getFromAsyncStorage(key: Keys) {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value === null) return DefaultValues[key]

        return JSON.parse(value)
    } catch {
        handleError()
        return DefaultValues[key]
    }
}

export async function saveToAsyncStorage(key: Keys, value: string) {
    try {
        await AsyncStorage.setItem(key, value)
    } catch {
        handleError()
    }
}

type Keys = 'lists'

export const DefaultValues = {
    lists: [],
    list: {
        id: 0,
        name: '',
        products: [],
        archived: false,
    },
}
