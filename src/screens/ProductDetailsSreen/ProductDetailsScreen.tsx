import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Animated,
    Easing,
} from 'react-native'
import { RouteProp } from '@react-navigation/native'
import { HeaderBackButton, StackNavigationProp } from '@react-navigation/stack'
import { ScaledSheet } from 'react-native-size-matters'
import Dialog from 'react-native-dialog'
import APP_COLORS from '../../common/colors'
import i18n from '../../common/i18n/i18n'
import AppActivityIndicator from '../../components/AppActivityIndicator'
import { handleError } from '../../helpers/AppAlertManager'
import { setProductDetail } from '../../helpers/deviceStorage'
import ShoppingListsRouteParams from '../../navigation/ShoppingLists/ShoppingListsRouteParams'
import APP_ICONS from '../../common/icons'
import DismissKeyboardView from '../../components/DismissKeyboardView'
import Category from '../../models/Category'

type ProductDetailsScreenRouteProp = RouteProp<
    ShoppingListsRouteParams,
    'ProductDetailsScreen'
>

type ProductDetailsScreenNavigationProp = StackNavigationProp<
    ShoppingListsRouteParams,
    'ProductDetailsScreen'
>

interface ProductDetailsScreenProps {
    route: ProductDetailsScreenRouteProp
    navigation: ProductDetailsScreenNavigationProp
}

const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
    navigation,
    route,
}) => {
    const { product, list } = route.params

    const [loading, setLoading] = useState<boolean>(false)
    const [productName, setProductName] = useState<string>(product.name)
    const [productUnit, setProductUnit] = useState<string>(product.unit)
    const [productQuantity, setProductQuantity] = useState<number>(
        product.quantity
    )
    const [productCategory, setProductCategory] = useState<Category>(
        product.category
    )

    const [discardChangesAlertVisible, setDiscardChangesAlertVisible] =
        useState<boolean>(false)

    const quantityComponentAnimatedValue = new Animated.Value(0)

    useEffect(() => {
        setNavigationBar()
    })

    /* ------------------------- Update UI ------------------------- */

    const setNavigationBar = () => {
        navigation.setOptions({
            headerLeft: renderBackButton,
            headerRight: renderSaveButton,
        })
    }

    /* ------------------------- Utils ------------------------- */

    const checkDidMadeChange = (): boolean =>
        product.name !== productName ||
        product.unit !== productUnit ||
        product.quantity !== productQuantity ||
        product.category !== productCategory

    const startQuantityComponentAnimation = () => {
        quantityComponentAnimatedValue.setValue(0)

        Animated.timing(quantityComponentAnimatedValue, {
            toValue: 3,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start()
    }

    /* ------------------------- Handlers ------------------------- */

    const handleNavigateToCategoriesListScreen = () => {
        navigation.navigate('CategoriesListScreen', {
            setProductCategory,
            chosenCategory: productCategory,
        })
    }

    const handleNavigateBack = () => {
        if (checkDidMadeChange()) {
            setDiscardChangesAlertVisible(true)
            return
        }

        navigation.goBack()
    }

    const handleSaveAll = async () => {
        try {
            setLoading(true)
            setDiscardChangesAlertVisible(false)

            const productNameChanged = product.name !== productName
            const productUnitChanged = product.unit !== productUnit
            const productQuantityChanged = product.quantity !== productQuantity
            const productCategoryChanged = product.category !== productCategory

            if (productNameChanged)
                await setProductDetail(product, list, { productName })

            if (productUnitChanged)
                await setProductDetail(product, list, { productUnit })

            if (productQuantityChanged)
                await setProductDetail(product, list, { productQuantity })

            if (productCategoryChanged)
                await setProductDetail(product, list, { productCategory })

            navigation.goBack()
        } catch {
            handleError()
        } finally {
            setLoading(false)
        }
    }

    const handleDiscardChanges = () => {
        setDiscardChangesAlertVisible(false)
        navigation.goBack()
    }

    const handleReduceQuantity = () => {
        const isLessOrEqualToZero = productQuantity <= 0

        if (isLessOrEqualToZero) {
            startQuantityComponentAnimation()
            return
        }

        setProductQuantity((prevState) => prevState - 1)
    }

    const handleIncreaseQuantity = () => {
        setProductQuantity((prevState) => prevState + 1)
    }

    const handleQuantityChange = (text: string) => {
        const isEmpty = text.length === 0

        if (isEmpty) {
            startQuantityComponentAnimation()
            setProductQuantity(0)
        } else {
            setProductQuantity(parseInt(text, 10))
        }
    }

    /* ------------------------- Helpers ------------------------- */

    const quantityComponentAnimationStyle = {
        transform: [
            {
                translateX: quantityComponentAnimatedValue.interpolate({
                    inputRange: [0, 0.5, 1, 1.5, 2, 2.5, 3],
                    outputRange: [0, -5, 0, 5, 0, -5, 0],
                }),
            },
        ],
    }

    /* ------------------------- Rendering functions ------------------------- */

    const renderSaveButton = (): JSX.Element => (
        <TouchableOpacity onPress={handleSaveAll}>
            <Text style={styles.saveButtonLabel}>{i18n.t('save')}</Text>
        </TouchableOpacity>
    )

    const renderBackButton = (): JSX.Element => (
        <HeaderBackButton
            label={' '}
            onPress={handleNavigateBack}
            tintColor={APP_COLORS.white}
        />
    )

    const renderActivityIndicator = (): JSX.Element => <AppActivityIndicator />

    const renderHeader = (): JSX.Element => (
        <View style={styles.headerContainer}>
            <Text style={styles.productNameLabel}>
                {i18n.t('product_name')}
            </Text>
            <TextInput
                value={productName}
                onChangeText={setProductName}
                style={styles.productNameTextInput}
                returnKeyType="done"
                selectionColor={APP_COLORS.white}
            />
        </View>
    )

    const renderCategorySection = (): JSX.Element => {
        const { name, image } = productCategory

        return (
            <>
                <Text style={styles.categoryTitle}>{i18n.t('category')}</Text>
                <TouchableOpacity
                    onPress={handleNavigateToCategoriesListScreen}
                    style={styles.categorySectionContainer}>
                    <Text style={styles.categoryName}>{name}</Text>
                    <Image style={styles.categoryImage} source={image} />
                </TouchableOpacity>
            </>
        )
    }

    const renderPopularUnitButtons = (): JSX.Element => (
        <View style={styles.popularUnitButtonsContainer}>
            {renderPopularUnitButton(i18n.t('unit_kg'))}
            {renderPopularUnitButton(i18n.t('unit_g'))}
            {renderPopularUnitButton(i18n.t('unit_l'))}
            {renderPopularUnitButton(i18n.t('unit_ml'))}
        </View>
    )

    const renderPopularUnitButton = (unit: string): JSX.Element => (
        <TouchableOpacity
            style={styles.popularUnitButton}
            onPress={() => setProductUnit(unit)}>
            <Text>{unit}</Text>
        </TouchableOpacity>
    )

    const renderUnitQuantitySection = (): JSX.Element => (
        <View style={styles.unitQuantityContainer}>
            <TextInput
                value={productUnit}
                placeholder={i18n.t('unit')}
                onChangeText={setProductUnit}
                style={styles.unitTextInput}
            />
            <Animated.View
                style={[
                    styles.quantityComponentContainer,
                    quantityComponentAnimationStyle,
                ]}>
                <TouchableOpacity
                    onPress={handleReduceQuantity}
                    style={styles.quantityButtonContainer}>
                    <Image
                        style={styles.quantityButtonImage}
                        source={APP_ICONS.minus}
                    />
                </TouchableOpacity>

                <TextInput
                    value={productQuantity.toString()}
                    keyboardType="numeric"
                    onChangeText={handleQuantityChange}
                    style={styles.quantityTextInput}
                    textAlign="center"
                />

                <TouchableOpacity
                    onPress={handleIncreaseQuantity}
                    style={styles.quantityButtonContainer}>
                    <Image
                        style={styles.quantityButtonImage}
                        source={APP_ICONS.plus}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    )

    const renderDiscardChangesAlert = (): JSX.Element => (
        <Dialog.Container visible={discardChangesAlertVisible}>
            <Dialog.Title>{i18n.t('discard_changes_question')}</Dialog.Title>
            <Dialog.Description>
                {i18n.t('unsaved_changes_description')}
            </Dialog.Description>

            <Dialog.Button
                label={i18n.t('discard_changes')}
                onPress={handleDiscardChanges}
                bold
            />
            <Dialog.Button label={i18n.t('save')} onPress={handleSaveAll} />
        </Dialog.Container>
    )

    return (
        <DismissKeyboardView>
            <View style={styles.container}>
                {renderHeader()}
                <View style={styles.cardContainer}>
                    {renderCategorySection()}
                    {renderUnitQuantitySection()}
                    {renderPopularUnitButtons()}
                </View>
                {loading && renderActivityIndicator()}
                {renderDiscardChangesAlert()}
            </View>
        </DismissKeyboardView>
    )
}

const styles = ScaledSheet.create({
    container: {
        backgroundColor: APP_COLORS.green,
    },
    headerContainer: {
        backgroundColor: APP_COLORS.green,
        margin: '16@ms',
    },
    productNameLabel: {
        color: APP_COLORS.darkGray,
    },
    productNameTextInput: {
        color: APP_COLORS.white,
        fontSize: '20@ms',
    },
    cardContainer: {
        height: '100%',
        backgroundColor: APP_COLORS.white,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: '16@ms',
    },
    categorySectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryTitle: {
        color: APP_COLORS.darkGray,
    },
    categoryName: {
        fontSize: '14@ms',
    },
    categoryImage: {
        width: '10%',
        aspectRatio: 1,
    },
    popularUnitButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    popularUnitButton: {
        flex: 1,
        paddingVertical: '8@ms',
        alignItems: 'center',
        borderRadius: 100,
        borderWidth: '2@ms',
        borderColor: APP_COLORS.darkGray,
        marginHorizontal: '8@ms',
    },
    unitQuantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: '16@ms',
    },
    unitTextInput: {
        fontSize: '16@ms',
        flex: 2,
    },
    quantityComponentContainer: {
        flexDirection: 'row',
        flex: 3,
        alignItems: 'center',
    },
    quantityTextInput: {
        fontSize: '16@ms',
        flex: 1,
    },
    quantityButtonContainer: {
        borderRadius: 100,
        marginHorizontal: '8@ms',
        borderWidth: 2,
        borderColor: APP_COLORS.darkGray,
    },
    quantityButtonImage: {
        width: '8@ms',
        height: '8@ms',
        margin: '8@ms',
    },
    saveButtonLabel: {
        color: APP_COLORS.white,
        paddingRight: '8@ms',
        fontSize: '14@ms',
        fontWeight: '500',
    },
})

export default ProductDetailsScreen
