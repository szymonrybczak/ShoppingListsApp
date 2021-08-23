import React from 'react'
import { TouchableWithoutFeedback, Keyboard } from 'react-native'

interface DismissKeyboardViewProps {
    children: JSX.Element
}

const DismissKeyboardView: React.FC<DismissKeyboardViewProps> = ({
    children,
}) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
    </TouchableWithoutFeedback>
)

export default DismissKeyboardView
