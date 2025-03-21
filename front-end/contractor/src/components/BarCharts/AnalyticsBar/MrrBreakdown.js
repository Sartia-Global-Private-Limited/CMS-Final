import React from 'react'

const MrrBreakdown = () => {
  const mrr = [
    {
      id: 1,
      number: 10,
      title: 'New Bussiness Mrr',
      total: '1,200',
      color: 'success',
    },
    {
      id: 2,
      number: '08',
      title: 'Expansion Mrr',
      total: '1,150',
      color: 'success',
    },
    {
      id: 3,
      number: '06',
      title: 'New Bussiness Mrr',
      total: '-1,300',
      color: 'red',
      text: 'danger'
    },
  ]
  return (
    <div className='d-grid gap-4'>
      {mrr.map((mr, idx) => (
        <div key={idx} className={`d-align justify-content-between text-${mr.text}`}>
          <span><span className={`social-btn-re ${mr.color}-combo`}>{mr.number}</span> {mr.title}</span> <span>₹{mr.total}</span>
        </div>
      ))}
      <div className='hr-border2' />
      <div className='d-align justify-content-between'>
        <span>Net Mrr Movement</span> <strong>₹1,050</strong>
      </div>
    </div>
  )
}

export default MrrBreakdown
