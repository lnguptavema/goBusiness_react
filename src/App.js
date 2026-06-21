import { Component } from 'react'
import './App.css'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Login from './components/Login'
import NotFound from './components/NotFound'
import DashBoard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ReferralId from './components/referralId'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={DashBoard} />
          <ProtectedRoute exact path="/referrals/:id" component={ReferralId} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App