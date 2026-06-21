import Cookies from 'js-cookie'
import { Component } from 'react'

import './index.css'

const apiStatusConstants = { success: 'SUCCESS', failure: 'FAILURE', progress: 'PROGRESS' }

class ReferralId extends Component {

    componentDidMount() {
        this.getReferrals()
    }

    state = {
        metrics: {},
        totalData: {},
        referralData: {},
        status: apiStatusConstants.progress,
    }

    renderLoader = props => {
        console.log(props)
        return (
            <div className="products-details-loader-container loadingcont" data-testid="loader">
                <h1>Loading Details...</h1>
            </div>
        )
    }

    getReferrals = async () => {
        const jwtToken = Cookies.get('jwt_token')

        const { match } = this.props
        const { id } = match.params

        const url = `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`

        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        }

        const response = await fetch(url, options)
        const data = await response.json()

        if (response.ok) {
            this.setState({
                referralData: data.data.referrals[0],
                status: apiStatusConstants.success,
            })
        } else {
            console.log('Error:', data)
            this.setState({ status: apiStatusConstants.failure })

        }
    }

    backToDashboard = () => {
        window.location.href = '/';
    }

    logout = () => {
        Cookies.remove('jwt_token')
        this.props.history.replace('/login')
    }
    renderNavBar = () =>
        <div className='dashboardNavBar'>
            <h1 className='gobuis' onClick={this.backToDashboard}>Go Business</h1>
            <div>
                <button className='tryhead'>Try for free</button>
                <button className='logoutbtn' onClick={this.logout}>Logout</button>
            </div>
        </div>

    rendrerReferralDetails = () => {
        const { referralData } = this.state
        console.log(referralData, 'referralData')
        return (
            <div className="referral-page-container">
                <div className="dashboard-content">
                    <div className="details-card">
                        <div className="card-header">
                            <h2 className="card-title">{referralData.name}</h2>
                            <span className="badge-hr">{referralData.serviceName}</span>
                        </div>

                        <div className="card-body">
                            <div className="info-row">
                                <span className="info-label">REFERRAL ID</span>
                                <span className="info-value">{referralData.id}</span>
                            </div>

                            <div className="info-row">
                                <span className="info-label">NAME</span>
                                <span className="info-value">{referralData.name}</span>
                            </div>

                            <div className="info-row">
                                <span className="info-label">SERVICE NAME</span>
                                <span className="info-value">{referralData.serviceName}</span>
                            </div>

                            <div className="info-row">
                                <span className="info-label">DATE</span>
                                <span className="info-value">{referralData.date}</span>
                            </div>

                            <div className="info-row">
                                <span className="info-label">PROFIT</span>
                                <span className="info-value profit-weight">{referralData.profit}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderStatus = () => {
        const { status } = this.state
        console.log(status, 'status')
        switch (status) {
            case apiStatusConstants.success:
                return this.rendrerReferralDetails()
            case apiStatusConstants.failure:
                return this.renderFailureView()
            case apiStatusConstants.progress:
                return this.renderLoader()
            default:
                return null
        }
    }

    render() {

        return (
            <div className="referralcard">
                {this.renderNavBar()}
                <h1 className="backdash" onClick={this.backToDashboard} style={{ cursor: 'pointer' }}>
                    ←Back to dashboard
                </h1>
                <h1 className='refdeta'>Referrals Details</h1>
                <p className='refdeta'>Full Information for this referral partner</p>

                {this.renderStatus()}
            </div>
        )
    }
}

export default ReferralId