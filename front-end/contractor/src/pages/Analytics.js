import React from 'react'
import { Col, NavDropdown } from 'react-bootstrap'
import CardComponent from '../components/CardComponent'
import { Helmet } from 'react-helmet'
import NewUserThisWeek from '../components/BarCharts/AnalyticsBar/NewUserThisWeek'
import SessionDurationThisWeek from '../components/BarCharts/AnalyticsBar/SessionDurationThisWeek'
import ActiveUser from '../components/BarCharts/AnalyticsBar/ActiveUser'
import SessionThisYear from '../components/BarCharts/AnalyticsBar/SessionThisYear'
import NewSessionThisWeek from '../components/BarCharts/AnalyticsBar/NewSessionThisWeek'
import MonthlyRecurringRevenue from '../components/BarCharts/AnalyticsBar/MonthlyRecurringRevenue'
import MrrMovements from '../components/BarCharts/AnalyticsBar/MrrMovements'
import Subscribers from '../components/BarCharts/AnalyticsBar/Subscribers'
import ActivateVsCancelled from '../components/BarCharts/AnalyticsBar/ActivateVsCancelled'
import MrrBreakdown from '../components/BarCharts/AnalyticsBar/MrrBreakdown'

const Analytics = () => {
    function NavDrop() {
        return (
            <NavDropdown title='This Week'>
                {['Weekly', 'Monthly', 'Yearly'].map((menu) => (
                    <NavDropdown.Item href="#action3" key={menu}>{menu}</NavDropdown.Item>
                ))}
            </NavDropdown>
        )
    }

    const analytics = [
        {
            id: 1,
            col: 6,
            title: 'New User This Week',
            chart: <NewUserThisWeek />,
            drop: '25,000',
        },
        {
            id: 2,
            col: 6,
            title: 'Session Duration This Week',
            chart: <SessionDurationThisWeek />,
            drop: '0.45 Min',
        },
        {
            id: 3,
            col: 4,
            title: 'Active User',
            chart: <ActiveUser />,
            drop: 132,
        },
        {
            id: 4,
            col: 4,
            title: 'Session This Year',
            chart: <SessionThisYear />,
            drop: 500,
        },
        {
            id: 5,
            col: 4,
            title: 'New Session This Week',
            chart: <NewSessionThisWeek />,
            drop: 550,
        },
        {
            id: 6,
            col: 6,
            title: 'Monthly Recurring Revenue',
            chart: <MonthlyRecurringRevenue />,
        },
        {
            id: 7,
            col: 6,
            title: 'Mrr Movements',
            chart: <MrrMovements />,
        },
        {
            id: 8,
            col: 4,
            title: 'Subscribers',
            chart: <Subscribers />,
            drop: <div>Last 20 Days <small className='text-danger'>[-0.09%]</small></div>,
        },
        {
            id: 9,
            col: 4,
            title: 'Activate Vs Cancelled',
            chart: <ActivateVsCancelled />,
        },
        {
            id: 10,
            col: 4,
            title: 'Mrr Breakdown',
            chart: <MrrBreakdown />,
            drop: <NavDrop />,
        },
    ]

    return (
        <>
            <Helmet>
                <title>Analytics · CMS Electricals</title>
            </Helmet>
            {analytics.map((items, idx) => (
                <Col key={idx} md={items.col}>
                    <CardComponent custom={items.select}
                        icon={items.drop} title={<span className='d-grid'><strong className='text-truncate'>{items.title}</strong></span>}>
                        {items.chart}
                    </CardComponent>
                </Col>
            ))
            }
        </>
    )
}

export default Analytics