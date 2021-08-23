import AsyncStorage from '@react-native-community/async-storage'
import { handleError } from './AppAlertManager'
import List from '../models/List'

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

type Keys = 'lists' | 'list'

const DefaultValues = {
    lists: [],
    list: {
        id: 0,
        title: '',
        products: [],
        archived: false,
    },
}
