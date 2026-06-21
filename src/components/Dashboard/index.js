import { Component } from 'react'

import Cookies from 'js-cookie'

import './index.css'

import {
    FaDollarSign,
    FaPercent,
    FaUsers,
    FaGift,
    FaMoneyBillWave,
    FaWallet,
    FaChartPie,
    FaUniversity,
} from 'react-icons/fa'

const icons = {
    balance: <FaDollarSign />,
    discountPct: <FaPercent />,
    totalRef: <FaUsers />,
    discountAmt: <FaGift />,
    commissionAmt: <FaMoneyBillWave />,
    totalEarn: <FaWallet />,
    commissionDisc: <FaChartPie />,
    bankTransfer: <FaUniversity />,
}

const status = { success: 'SUCCESS', failure: 'FAILURE', progress: 'PROGRESS' }

class Dashboard extends Component {

    state = {
        metrics: [], apiStatus: status.progress, totalData: [], currentPage: 1, searchInput: '',
        sortBy: 'Newest first',
    }

    componentDidMount() {
        this.getReferrals()
    }

    changePage = pageNumber => {
        this.setState({ currentPage: pageNumber })
    }

    goToNextPage = totalPages => {
        const { currentPage } = this.state

        if (currentPage < totalPages) {
            this.setState({
                currentPage: currentPage + 1,
            })
        }
    }

    goToPreviousPage = () => {
        const { currentPage } = this.state

        if (currentPage > 1) {
            this.setState({
                currentPage: currentPage - 1,
            })
        }
    }

    renderLoader = props => {
        console.log(props)
        return (
            <div className="products-details-loader-container loadingcont" data-testid="loader">
                <h1>Loading Dashboard...</h1>
            </div>
        )
    }

    getReferrals = async () => {
        const jwtToken = Cookies.get('jwt_token')

        const { searchInput, sortBy } = this.state

        let url =
            'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals'

        const queryParams = []

        if (searchInput.trim() !== '') {
            queryParams.push(`search=${searchInput}`)
        }

        if (sortBy) {
            queryParams.push(`sort=${sortBy}`)
        }

        if (queryParams.length > 0) {
            url = `${url}?${queryParams.join('&')}`
        }

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
                totalData: data.data,
                metrics: data.data.metrics,
                currentPage: 1,
                apiStatus: status.success,
            })
        }
    }

    logout = () => {
        const { history } = this.props
        Cookies.remove('jwt_token')
        history.replace('/login')
    }

    renderNavBar = () =>
        <div className='dashboardNavBar'>
            <h1 className='gobuis'>Go Business</h1>
            <div>
                <button className='tryhead'>Try for free</button>
                <button className='logoutbtn' onClick={this.logout}>Logout</button>
            </div>
        </div>

    renderOverview = () => {
        const { metrics } = this.state
        return (
            <div className="overviewCard">
                <h1 className="overviewHeading">Overview</h1>

                <div className="overviewValuesContainer">
                    {metrics.map(item => (
                        <div
                            key={item.id}
                            className="overviewValueContainer"
                        >
                            <div className="iconContainer">
                                {icons[item.id]}
                            </div>

                            <h1 className="overviewValue">{item.value}</h1>
                            <p>{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    renderService = () => {
        const { totalData } = this.state
        const { serviceSummary = {} } = totalData

        const {
            service,
            yourReferrals,
            activeReferrals,
            totalRefEarnings,
        } = serviceSummary

        return (<>

            <div className="service-summary-card">
                <h1>Service Summary</h1>

                <div className="summary-column">
                    <span className="summary-label">SERVICE</span>
                    <span className="summary-value link-text">{service}</span>
                </div>

                <div className="summary-column">
                    <span className="summary-label">YOUR REFERRALS</span>
                    <span className="summary-value">{yourReferrals}</span>
                </div>

                <div className="summary-column">
                    <span className="summary-label">ACTIVE REFERRALS</span>
                    <span className="summary-value">{activeReferrals}</span>
                </div>

                <div className="summary-column">
                    <span className="summary-label">TOTAL REF. EARNINGS</span>
                    <span className="summary-value">{totalRefEarnings}</span>
                </div>
            </div>

        </>
        )
    }

    renderReferFriend = () => {
        const { totalData } = this.state
        const { referral = {} } = totalData

        const { link, code } = referral

        return (
            <div className="refer-container">
                <h3 className="refer-title">Refer friends and earn more</h3>

                <div className="refer-cards-wrapper">

                    <div className="refer-card">
                        <label className="refer-label">YOUR REFERRAL LINK</label>
                        <div className="refer-input-group">
                            <input
                                type="text"
                                className="refer-input"
                                value={link || ''}
                                readOnly
                            />
                            <button className="copy-button">
                                Copy
                            </button>
                        </div>
                    </div>

                    <div className="refer-card">
                        <label className="refer-label">YOUR REFERRAL CODE</label>
                        <div className="refer-input-group">
                            <input
                                type="text"
                                className="refer-input"
                                value={code || ''}
                                readOnly
                            />
                            <button className="copy-button">
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderStatus = () => {
        const { apiStatus } = this.state
        switch (apiStatus) {
            case status.success:
                return this.renderOverview()
            case status.failure:
                return this.renderFailure()
            case status.progress:
                return this.renderLoader()
            default:
                return null
        }
    }

    onClickReferral = id => {
        const { history } = this.props
        history.push(`/referrals/${id}`)
    }

    renderAllreferrals = () => {
        const {
            totalData,
            currentPage,
            searchInput,
            sortBy,
        } = this.state

        const { referrals = [] } = totalData

        const referralsPerPage = 10

        const totalPages = Math.ceil(
            referrals.length / referralsPerPage,
        )

        const startIndex =
            (currentPage - 1) * referralsPerPage

        const endIndex =
            startIndex + referralsPerPage

        const currentReferrals = referrals.slice(
            startIndex,
            endIndex,
        )

        return (
            <div className="referrals-container">
                <h3 className="referrals-title">
                    All referrals
                </h3>

                <div className="table-card">
                    <div className="table-controls">
                        <div className="search-box">
                            <label className="control-label">
                                Search
                            </label>

                            <input
                                type="search"
                                aria-label="Search referrals"
                                placeholder="Name or service…"
                                className="search-input"
                                value={searchInput}
                                onChange={this.onChangeSearch}
                            />
                        </div>

                        <div className="sort-box">
                            <label className="control-label">
                                Sort by date
                            </label>

                            <select
                                className="sort-dropdown"
                                value={sortBy}
                                onChange={this.onChangeSort}
                            >
                                <option value="desc">Newest first</option>
                                <option value="asc">Oldest first</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table className="referrals-table">
                            <thead>
                                <tr>
                                    <th>NAME</th>
                                    <th>SERVICE</th>
                                    <th>DATE</th>
                                    <th>PROFIT</th>
                                </tr>
                            </thead>

                            <tbody className="table-body">
                                {currentReferrals.map(item => (
                                    <tr
                                        onClick={() => this.onClickReferral(item.id)}
                                        className="table-row" key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.serviceName}</td>
                                        <td>{item.date}</td>
                                        <td>
                                            $
                                            {item.profit.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-footer">
                        <span className="entries-info">
                            Showing {startIndex + 1}-
                            {Math.min(
                                endIndex,
                                referrals.length,
                            )}
                            {' '}of {referrals.length} entries
                        </span>

                        <div className="pagination">
                            <button
                                className="page-btn text-btn"
                                onClick={this.goToPreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            {[...Array(totalPages)].map(
                                (_, index) => (
                                    <button
                                        key={index + 1}
                                        className={`page-btn ${currentPage === index + 1
                                            ? 'active'
                                            : ''
                                            }`}
                                        onClick={() =>
                                            this.changePage(index + 1)
                                        }
                                    >
                                        {index + 1}
                                    </button>
                                ),
                            )}

                            <button
                                className="page-btn text-btn"
                                onClick={() =>
                                    this.goToNextPage(totalPages)
                                }
                                disabled={
                                    currentPage === totalPages
                                }
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onChangeSort = event => {
        const sortBy = event.target.value

        this.setState(
            {
                sortBy,
                currentPage: 1,
            },
            this.getReferrals,
        )
    }

    onChangeSearch = event => {
        const searchInput = event.target.value

        this.setState(
            {
                searchInput,
                currentPage: 1,
            },
            this.getReferrals,
        )
    }

    renderFooter = () => <footer className="footer-container">
        <div className="footer-content">
            {/* Brand Text */}
            <span className="footer-brand">Go Business</span>

            {/* Navigation Links */}
            <nav className="footer-nav" aria-label="Footer">
                <a href="#about" className="footer-link">About</a>
                <a href="#contact" className="footer-link">Contact</a>
                <a href="#privacy" className="footer-link">Privacy</a>
            </nav>

            {/* Copyright notice */}
            <p className="footer-copyright">
                &copy; 2024 Go Business. All rights reserved.
            </p>
        </div>
    </footer>

    render() {
        return (
            <div className='dashboardContainer'>
                {this.renderNavBar()}
                <h1>Referral Dashboard</h1>
                <p>Track your referrals and earnings, and partner activity in one place.</p>
                {this.renderStatus()}
                {this.renderService()}
                {this.renderReferFriend()}
                {this.renderAllreferrals()}
                {this.renderFooter()}
            </div>
        )
    }
}

export default Dashboard
