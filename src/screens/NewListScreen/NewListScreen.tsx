import React, { useState } from 'react'
import {
    KeyboardAvoidingView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ScaledSheet } from 'react-native-size-matters'
import ShoppingListsRouteParams from '../../navigation/ShoppingLists/ShoppingListsRouteParams'
import APP_COLORS from '../../common/colors'
import i18n from '../../common/i18n/i18n'
import AppAlertManager, { handleError } from '../../helpers/AppAlertManager'
import { createList } from '../../helpers/deviceStorage'
import List from '../../models/List'
import DismissKeyboardView from '../../components/DismissKeyboardView'

type NewListScreenNavigationProp = StackNavigationProp<
    ShoppingListsRouteParams,
    'NewListScreen'
>

interface NewListsScreenProps {
    navigation: NewListScreenNavigationProp
}

const NewListScreen: React.FC<NewListsScreenProps> = ({ navigation }) => {
    const [listName, setListName] = useState<string>(i18n.t('list_name'))

    /* ------------------------- Handlers ------------------------- */

    const handleCreateList = async () => {
        try {
            const isListNameEmpty = listName.trim().length === 0
            if (isListNameEmpty) {
                AppAlertManager.showErrorToast(
                    undefined,
                    i18n.t('list_name_is_empty')
                )
            }

            const id = Math.floor(100000 + Math.random() * 900000) // Creates 6 numbers length id

            const list: List = {
                id,
                name: listName,
                products: [],
                archived: false,
            }

            await createList(list)

            AppAlertManager.showSuccessfulToast(
                undefined,
                i18n.t('successfully_created_list')
            )

            navigation.navigate('ShoppingListDetailsScreen', { list })
        } catch {
            handleError()
        }
    }

    /* ------------------------- Rendering functions ------------------------- */

    const renderTextInput = (): JSX.Element => (
        <TextInput
            multiline
            autoFocus
            selectTextOnFocus
            returnKeyType="done"
            onSubmitEditing={handleCreateList}
            value={listName}
            onChangeText={(text: string) => setListName(text)}
            style={styles.textInput}
            textAlign="center"
        />
    )

    const renderCancelButton = (): JSX.Element => (
        <TouchableOpacity
            onPress={navigation.goBack}
            style={[styles.baseButton, styles.backButton]}>
            <Text style={styles.backButtonLabel}>{i18n.t('back')}</Text>
        </TouchableOpacity>
    )

    const renderCreateButton = (): JSX.Element => (
        <TouchableOpacity
            onPress={handleCreateList}
            style={[styles.baseButton, styles.createButton]}>
            <Text style={styles.createButtonLabel}>{i18n.t('create')}</Text>
        </TouchableOpacity>
    )

    return (
        <DismissKeyboardView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                {renderTextInput()}

                <View style={styles.buttonsContainer}>
                    {renderCancelButton()}
                    {renderCreateButton()}
                </View>
            </KeyboardAvoidingView>
        </DismissKeyboardView>
    )
}

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLORS.blue,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16@ms',
    },
    textInput: {
        backgroundColor: APP_COLORS.white,
        alignSelf: 'stretch',
        padding: '16@ms',
        paddingTop: '16@ms',
    },
    buttonsContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: '16@ms',
    },
    baseButton: {
        flex: 1,
        alignItems: 'center',
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
        color: APP_COLORS.blue,
        fontSize: '16@ms',
    },
})

export default NewListScreen
