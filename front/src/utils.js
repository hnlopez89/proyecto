import jwt from 'jwt-decode'
import axios from 'axios'

const ENDPOINT = 'http://localhost:3000'

export async function loginUser(email, password) {
    const response = await axios.post(`${ENDPOINT}/user/login`, {
        email: email,
        password: password,
    })
    console.log(response);
    setAuthTokenUser(response.data.data.token)
    setIsAdminUser(response.data.data.dbUser[0].role)
    setNameUser(response.data.data.dbUser[0].name)

}

//FUNCION PARA GUARDAR EN LOCALSTORAGE EL JSONWEBTOKEN
export function setAuthTokenUser(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('AUTH_TOKEN_KEY', token)
}

//FUNCION DE GUARDAR EL NOMBRE DE USER EN LOCALSTORAGE
export function setNameUser(user) {
    localStorage.setItem('NAME', user)
}

//FUNCIÓN PARA GUARDAR EL ADMIN DE LOCALSTORAGE
export function setIsAdminUser(admin) {
    localStorage.setItem('ROLE', admin)
}


//FUNCIÓN PARA RECUPERAR EL ADMIN DE LOCALSTORAGE
export function getIsAdminUser() {
    return localStorage.getItem('ROLE')
}


//FUNCION DE RECUPERAR EL NOMBRE DE USER EN LOCALSTORAGE
export function getNameUser() {
    return localStorage.getItem('NAME')
}


export async function loginBusiness(email, password) {
    const response = await axios.post(`${ENDPOINT}/business/login`, {
        email: email,
        password: password,
    })
    setAuthTokenBusiness(response.data.data.token),
        setNameBusiness(response.data.data.dbBusiness[0].name)
}


//FUNCION PARA GUARDAR EN LOCALSTORAGE EL JSONWEBTOKEN
export function setAuthTokenBusiness(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('AUTH_TOKEN_KEY', token)
}

//FUNCION DE GUARDAR EL NOMBRE DE USER EN LOCALSTORAGE
export function setNameBusiness(name) {
    localStorage.setItem('BUSINESS', name)
}

//FUNCION DE RECUPERAR EL NOMBRE DEL MANAGER EN LOCALSTORAGE
export function getNameBusiness() {
    return localStorage.getItem('BUSINESS')
}


//FUNCION PARA RECUPERAR EL TOKEN DESDE EL LOCALSTORAGE
export function getAuthToken() {
    return localStorage.getItem('AUTH_TOKEN_KEY')
}


//FUNCTION PARA CONSEGUIR LA FECHA DE CADUCIDAD DEL TOKEN
export function tokenExpiration(encodedToken) {
    let token = jwt(encodedToken)
    if (!token.exp) {
        return null
    }
    let date = new Date(0)
    date.setUTCSeconds(token.exp)
    return date
}

//FUNCIÓN QUE COMPRUEBA SI EL TOKEN ES VÁLIDO
export function isExpired(token) {
    let expirationDate = tokenExpiration(token)
    return expirationDate < new Date()
}

//FUNCIÓN QUE COMPRUEBA SI EL TOKEN ES VÁLIDO
export function isUser(token) {
    let role = tokenExpiration(token)
    return expirationDate < new Date()
}

//FUNCIÓN PARA SABER SI ES ADMIN O NO
export function checkIsAdminUserOriginal() {
    let role = null
    let admin = getIsAdminUser()

    if (admin === 'true') {
        role = "admin"
    } else {
        role = "customer"
    }
    return role === "admin"
}

//FUNCIÓN PARA SABER SI ES ADMIN O NO
export function checkIsAdminUser() {
    let role = null
    let admin = getIsAdminUser()

    if (admin === 'admin') {
        role = true
    } else {
        role = false
    }
    return role
}

//FUNCIÓN QUE COMPRUEBA SI LA PERSONA ESTÁ LOGUEADA Y SU TOKEN ES VÁLIDO
export function isLoggedInUser() {
    let authToken = getAuthToken()
    return !!authToken && !isExpired(authToken) && !!getNameUser();
}

export function isLoggedInAdmin() {
    let authToken = getAuthToken()
    return !!authToken && !isExpired(authToken) && !!getNameUser();
}

export function isLoggedInBusiness() {
    let authToken = getAuthToken()
    return !!authToken && !isExpired(authToken) && !!getNameBusiness();
}

//SACAR ID TOKEN
export function getIdToken(encodedToken) {
    let token = jwt(encodedToken);
    if (token.id) {
        return token.id;
    } else {
        return null;
    }
}
export function getDate() {
    try {
        return format(new Date(this.$props.date), "MM/dd/yyyy");
    } catch (error) {
        console.log(error);
    }
}

//FUNCION DE LOGOUT
export function logout(token) {
    axios.defaults.headers.common['Authorization'] = ''
    localStorage.removeItem('AUTH_TOKEN_KEY')
    localStorage.removeItem('ROLE')
    localStorage.removeItem('NAME')
    localStorage.removeItem('BUSINESS')


}