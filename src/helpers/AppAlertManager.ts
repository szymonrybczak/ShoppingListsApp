import { Alert } from 'react-native'
import DropdownAlert, { DropdownAlertType } from 'react-native-dropdownalert'
import i18n from '../common/i18n/i18n'

export default class AppAlertManager {
    static dropdown: DropdownAlert

    static setDropdown(dropdown: DropdownAlert) {
        this.dropdown = dropdown
    }

    static showDefaultAlert() {
        return this.dropdown === undefined
    }

    static showSuccessfulToast(
        title: string = i18n.t('alert_successful_title'),
        description: string
    ) {
        if (this.showDefaultAlert()) {
            Alert.alert(title, description)
            return
        }

        this.showAlert('success', title, description)
    }

    static showErrorToast(
        title: string = i18n.t('alert_error_title'),
        description: string
    ) {
        if (this.showDefaultAlert()) {
            Alert.alert(title, description)
            return
        }

        this.showAlert('error', title, description)
    }

    static showAlert(
        type: DropdownAlertType,
        title: string,
        description: string
    ) {
        if (this.showDefaultAlert()) {
            Alert.alert(title, description)
            return
        }

        this.dropdown.alertWithType(type, title, description)
    }
}

export const handleError = () => {
    AppAlertManager.showErrorToast(
        undefined,
        i18n.t('error_occurred_please_try_again')
    )
}
