import React, { useState } from 'react'
import {
    KeyboardAvoidingView,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import ShoppingListsRouteParams from '../../navigation/ShoppingLists/ShoppingListsRouteParams'
import Category from '../../models/Category'
import APP_COLORS from '../../common/colors'
import i18n from '../../common/i18n/i18n'
import AppAlertManager, { handleError } from '../../helpers/AppAlertManager'
import Product from '../../models/Product'
import { createProduct } from '../../helpers/deviceStorage'
import AppActivityIndicator from '../../components/AppActivityIndicator'
import DismissKeyboardView from '../../components/DismissKeyboardView'

type AddProductsScreenNavigationProp = StackNavigationProp<
    ShoppingListsRouteParams,
    'AddProductsScreen'
>

type AddProductsScreenRouteProp = RouteProp<
    ShoppingListsRouteParams,
    'AddProductsScreen'
>

interface AddProductsScreenProps {
    navigation: AddProductsScreenNavigationProp
    route: AddProductsScreenRouteProp
}

const AddProductsScreen: React.FC<AddProductsScreenProps> = ({
    navigation,
    route,
}) => {
    const [productName, setProductName] = useState<string>('')
    const [category, setCategory] = useState<Category>()
    const [loading, setLoading] = useState<boolean>(false)

    /* ------------------------- Handlers ------------------------- */

    const handleNavigateToCategoriesListScreen = () => {
        navigation.navigate('CategoriesListScreen', {
            setCategory,
            chosenCategory: category || undefined,
        })
    }

    const handleAddProduct = async () => {
        try {
            const trimmedProductName = productName.trim()
            const isProductNameEmpty = trimmedProductName.length === 0

            if (isProductNameEmpty) {
                AppAlertManager.showErrorToast(
                    undefined,
                    i18n.t('product_name_is_empty')
                )
                return
            }

            if (!category) {
                AppAlertManager.showErrorToast(
                    undefined,
                    i18n.t('category_not_choose')
                )
                return
            }

            const { list } = route.params

            const productsNames = list.products.map((product) => product.name)
            const isProductInList = productsNames.includes(trimmedProductName)

            if (isProductInList) {
                AppAlertManager.showErrorToast(
                    undefined,
                    i18n.t('product_with_this_name_is_already_created')
                )
                return
            }

            setLoading(true)

            const product: Product = {
                name: trimmedProductName,
                category,
                unit: '',
                quantity: 1,
                purchased: false,
            }

            await createProduct(product, list)
            handleNavigateBack()
        } catch {
            handleError()
        } finally {
            setLoading(false)
        }
    }

    const handleNavigateBack = () => navigation.goBack()

    /* ------------------------- Rendering ------------------------- */

    const renderActivityIndicator = (): JSX.Element => <AppActivityIndicator />

    const renderNameTextInput = (): JSX.Element => (
        <TextInput
            autoFocus
            value={productName}
            onChangeText={(text) => setProductName(text)}
            style={styles.nameTextInput}
            textAlign="center"
            placeholder={i18n.t('product_name')}
        />
    )

    const renderChooseCategoryComponent = (): JSX.Element => (
        <TouchableOpacity onPress={handleNavigateToCategoriesListScreen}>
            {category ? (
                <View
                    style={[
                        styles.categoryComponentContainer,
                        { justifyContent: 'space-between' },
                    ]}>
                    <Text>{category.name}</Text>
                    <Image
                        source={category.image}
                        style={styles.categoryImage}
                    />
                </View>
            ) : (
                <View
                    style={[
                        styles.categoryComponentContainer,
                        { justifyContent: 'center' },
                    ]}>
                    <Text>{i18n.t('choose_category')}</Text>
                </View>
            )}
        </TouchableOpacity>
    )

    const renderButtons = (): JSX.Element => (
        <View style={styles.buttonsContainer}>
            <TouchableOpacity
                onPress={handleNavigateBack}
                style={[styles.baseButton, styles.backButton]}>
                <Text style={styles.backButtonLabel}>{i18n.t('back')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleAddProduct}
                style={[styles.baseButton, styles.createButton]}>
                <Text style={styles.createButtonLabel}>{i18n.t('create')}</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <DismissKeyboardView>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                {loading && renderActivityIndicator()}
                {renderNameTextInput()}
                {renderChooseCategoryComponent()}
                {renderButtons()}
            </KeyboardAvoidingView>
        </DismissKeyboardView>
    )
}

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLORS.green,
        justifyContent: 'center',
        padding: '16@ms',
    },
    nameTextInput: {
        backgroundColor: APP_COLORS.white,
        padding: Platform.OS === 'android' ? '12@ms' : '16@ms', // By default text input on Android has more padding than iOS
        marginVertical: '16@ms',
    },
    categoryImage: {
        height: '16@ms',
        width: '16@ms',
    },
    categoryComponentContainer: {
        backgroundColor: APP_COLORS.white,
        padding: '16@ms',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: '16@ms',
    },
    baseButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16@ms',
        margin: '8@ms',
        borderRadius: 100,
    },
    backButton: {
        borderWidth: '2@ms',
        borderColor: APP_COLORS.white,
    },
    createButton: {
        backgroundColor: APP_COLORS.white,
    },
    backButtonLabel: {
        color: APP_COLORS.white,
        fontSize: '16@ms',
    },
    createButtonLabel: {
        color: APP_COLORS.green,
        fontSize: '16@ms',
    },
})

export default AddProductsScreen
