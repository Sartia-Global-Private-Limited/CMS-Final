import React, { useState, useEffect } from 'react'
import { Col } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import CardComponent from '../components/CardComponent'
import moment from 'moment'
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { useSelector } from 'react-redux'
import { selectNoti } from '../features/notifications/notificationSlice'
import { BsClock } from 'react-icons/bs'
import ReactPagination from '../components/ReactPagination'
import { getAdminAllNotifications } from '../services/authapi'

const AllNotifications = () => {
  // const { noti: notification } = useSelector(selectNoti)
  const [notificationData, setNotificationData] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const fetchAllNotificationsData = async () => {
    const res = await getAdminAllNotifications(search, pageSize, pageNo)
    if (res.status) {
      setNotificationData(res.data)
      setPageDetail(res.pageDetails);
    } else {
      setNotificationData([])
      setPageDetail({});
    }
  }

  useEffect(() => {
    fetchAllNotificationsData()
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>Notifications · CMS Electricals</title>
      </Helmet>
      <CardComponent classbody={'notification-area'} title={'All Notifications'}
        search={true}
        searchOnChange={(e) => { setSearch(e.target.value) }}
      >
        <div className='d-grid gap-2 last-child-none'>
          <SimpleBar className='area ps-1 pe-3'>
            {
              notificationData.length > 0 ? null : <div className='text-center'><img className='p-3 mb-3' alt="no-result" width="360" src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`} /></div>
            }
            {notificationData?.map((noti, idx) => (
              <div className={`mb-2 p-2 bg-white ${!noti.is_admin_read === 1 && 'border-start border-4 border-orange'}`} key={idx}>
                <div className='d-flex justify-content-between'>
                  <div className='d-flex'>
                    <img className='avatar me-2' src={noti.image ? `${process.env.REACT_APP_API_URL}${noti.image}` : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`} alt={noti.name} />
                    <div>
                      <div className='pb-1'><span className={!noti.is_admin_read === 1 && `fw-bold`}>{noti.name}</span> <span className={`small text-gray`}>({noti.title})</span></div>
                      <div className='small t-align'>{noti.message}</div>
                    </div>
                  </div>
                  <span className='fs-11 text-gray'><BsClock /> {moment(noti.created_at).fromNow(true)}</span>
                </div>
              </div>
            ))}
          </SimpleBar>
          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
            }
            nextClassName={
              notificationData.length < pageSize
                ? "danger-combo-disable pe-none"
                : "success-combo"
            }
            title={`Showing ${pageDetail?.pageStartResult || 0} to ${pageDetail?.pageEndResult || 0} of ${pageDetail?.total || 0}`}
            handlePageSizeChange={handlePageSizeChange}
            prevonClick={() => setPageNo(pageNo - 1)}
            nextonClick={() => setPageNo(pageNo + 1)}
          />
        </div>
      </CardComponent>
    </Col>
  )
}

export default AllNotifications