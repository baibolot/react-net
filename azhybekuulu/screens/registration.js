import React, {useState} from 'react'
import {AsyncStorage, Button, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native'
import {showMessage} from "react-native-flash-message"
import {useApolloClient, useMutation} from "@apollo/client"
import {REG} from "../gqls/user/mutations"
import {USER} from "../gqls/user/queries"
import LoadingBar from "../components/loadingBar"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 15,
    },
    input: {
        borderWidth: 0.5,
        borderRadius: 10,
        alignSelf: 'stretch',
    }
})

const Registration = ({navigation}) => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const apollo = useApolloClient()

    const [reg, {loading}] = useMutation(REG, {
        onCompleted: async ({registerUser}) => {
            await AsyncStorage.setItem('token', registerUser.token)
            showMessage({
                message: 'Регистрация прошла успешно',
                type: 'info'
            })
            apollo.writeQuery({query: USER, data: {user: registerUser.user}})
            navigation.goBack()
        },
        onError: ({message}) => {
            if (message === 'GraphQL error: Unique constraint failed on the fields: (`login`)') {
                showMessage({
                    message: 'Такой логин уже существует',
                    type: 'danger'
                })
                return null
            }
            showMessage({
                message: 'Что то пошло не так',
                type: 'danger'
            })
        }
    })

    const validate = () => {
        if (login === '') {
            showMessage({
                message: "Введите логин",
                type: "danger",
            })
            return false
        }
        if (password === '') {
            showMessage({
                message: "Введите пароль",
                type: "danger",
            })
            return false
        }
        if (password !== confirmPassword) {
            showMessage({
                message: "Пароли не совпадают",
                type: "danger",
            })
            return false
        }
        return true
    }

    const createUser = () => {
        if (!validate())
            return null
        reg({
            variables: {
                data: {
                    password,
                    login
                }
            }
        })
    }

    if (loading)
        return (
            <LoadingBar/>
        )

    return (
        <ScrollView
            style={styles.container}
        >
            <Text>Логин</Text>
            <TextInput
                onChangeText={text => setLogin(text)}
                value={login}
                style={[styles.input,{marginTop: 8}]}
                placeholder={'Введите логин'}
            />
            <Text style={{marginTop: 24}}>Пароль</Text>
            <TextInput
                onChangeText={text => setPassword(text)}
                value={password}
                secureTextEntry={true}
                style={[styles.input, {marginTop: 8}]}
                placeholder={'Введите пароль'}
            />
            <TextInput
                onChangeText={text => setConfirmPassword(text)}
                value={confirmPassword}
                secureTextEntry={true}
                style={[styles.input, {marginTop: 8}]}
                placeholder={'Повторите пароль'}
            />
            <View
                style={
                    {
                        marginTop: 24,
                        alignItems: 'center'
                    }
                }
            >
                <Button
                    title={'Создать'}
                    onPress={createUser}
                />
            </View>
            <View
                style={
                    {
                        marginTop: 24,
                        alignItems: 'center'
                    }
                }
            >
                <Button
                    title={'Назад'}
                    onPress={
                        () => {
                            navigation.goBack()
                        }
                    }
                />
            </View>
        </ScrollView>
    )
}

export default Registration
