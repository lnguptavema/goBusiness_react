import { Component } from 'react'

import Cookies from 'js-cookie'

import { Redirect } from 'react-router-dom'

import './index.css'

class Login extends Component {
    state = { errorMsg: '', email: '', password: '' }

    formSubmitted = async event => {
        const { email, password } = this.state
        event.preventDefault()
        const url = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin/'
        const credentials = { email, password }
        const options = {
            method: 'POST',
            body: JSON.stringify(credentials),
        }
        const response = await fetch(url, options)
        console.log(response, 'reasponse')
        if (response.ok) {

            const responseJson = await response.json()
            const token = responseJson.data.token
            Cookies.set('jwt_token', token, { expires: 2 })
            const { history } = this.props
            history.replace('/')
        } else {
            const responseJson = await response.json()
            this.setState({ errorMsg: responseJson.message })
        }
    }

    enterPassword = event => {
        this.setState({ password: event.target.value })
    }

    enterUsername = event => {
        this.setState({ email: event.target.value })
    }

    renderErrorMsg = () => {
        const { errorMsg } = this.state
        return <p className="errorMsg">{errorMsg} </p>
    }

    render() {
        const token = Cookies.get('jwt_token')
        if (token !== undefined) {
            return <Redirect to="/" />
        }
        const { errorMsg, email, password } = this.state
        return (
            <div className="loginMainContainer">
                <div className="loginContainer">
                    <form onSubmit={this.formSubmitted}>
                        <h1 className='gobuis'>Go Business</h1>
                        <p>Sign in to open your referral dashboard.</p>
                        <div>
                            {' '}
                            <div className="loginInputCard">
                                <label htmlFor="userId">Email</label>
                                <input
                                    className="loginInput"
                                    placeholder="you@example.com"
                                    type="input"
                                    onChange={this.enterUsername}
                                    value={email}
                                    id="userId"
                                />
                            </div>{' '}
                        </div>
                        <div className="loginInputCard">
                            <label htmlFor="userId">Password</label>
                            <input
                                placeholder="......."
                                className="loginInput"
                                onChange={this.enterPassword}
                                type="password"
                                value={password}
                                id="userId"
                            />
                        </div>{' '}
                        <button type="submit" className="loginButton">
                            Sign in
                        </button>
                        {this.renderErrorMsg()}
                    </form>
                </div>
            </div>
        )
    }
}
export default Login