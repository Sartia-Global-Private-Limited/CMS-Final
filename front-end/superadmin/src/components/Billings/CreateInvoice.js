import React, { useState } from 'react'
import { Card, Col, Form, Row, Table } from 'react-bootstrap'
import { BsCheck2, BsShieldShaded, BsUpload } from 'react-icons/bs'
import Modaljs from '../Modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import InvoiceEdit from './InvoiceEdit';
import SwiperSlider from '../SwiperSlider';
import { SwiperSlide } from 'swiper/react';
import TextareaAutosize from 'react-textarea-autosize';

const CreateInvoice = () => {
  // const { quillRef } = useQuill();
  const [preview, setPreview] = useState(false);
  function CardBox({ title, children, icon }) {
    return (
      <Col md={12}>
        <Card className='bg-new'>
          <div className='p-3 fs-20 d-align justify-content-between'>
            <strong>{title}</strong>{icon}
          </div>
          <Card.Body className='pb-5 row g-4'>{children}</Card.Body>
        </Card>
      </Col>
    );
  }
  return (
    <Row className='g-4'>
      <CardBox title={'Company Information'} icon={<span className='my-btn d-align'><BsShieldShaded /></span>}>
        <Form.Group as={Col} md={4}>
          <Form.Label>Company Name</Form.Label>
          <Form.Control type='text' />
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Company Email</Form.Label>
          <Form.Control type='email' />
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Company Address</Form.Label>
          <Form.Control type='text' />
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Phone Number</Form.Label>
          <Form.Control type='number' />
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>City</Form.Label>
          <Form.Control type='text' />
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Zip/postalcode</Form.Label>
          <Form.Control type='text' />
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>State/Province</Form.Label>
          <Form.Select>
            <option>--</option>
          </Form.Select>
        </Form.Group>
      </CardBox>

      <CardBox title={'Client Information'}>
        <Form.Group as={Col} md={4}>
          <Form.Label>Select User</Form.Label>
          <Form.Select>
            <option>--</option>
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Invoice Number</Form.Label>
          <Form.Control type='text' />
        </Form.Group>
        <Form.Group as={Col} md={2}>
          <Form.Label>Issue Date</Form.Label>
          <Form.Control type='date' />
        </Form.Group>
        <Form.Group as={Col} md={2}>
          <Form.Label>Due Date</Form.Label>
          <Form.Control type='date' />
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>User Name</Form.Label>
          <Form.Control type='text' />
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>User Email (Optional)</Form.Label>
          <Form.Control type='email' />
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>User Address</Form.Label>
          <Form.Control type='text' />
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Phone Number</Form.Label>
          <Form.Control type='text' />
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>City</Form.Label>
          <Form.Control type='text' />
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Zip/Postalcode</Form.Label>
          <Form.Control type='text' />
        </Form.Group>
      </CardBox>

      <CardBox title={'Line Items'}>
        <Form.Group as={Col} md={4}>
          <Form.Label>Select Modules</Form.Label>
          <Form.Select>
            <option>Energy Company Admin & Sub-User Panel</option>
          </Form.Select>
          <TextareaAutosize minRows={15} className='mt-4 edit-textarea' placeholder='Description...' />
        </Form.Group>
        <Form.Group as={Col} md={8}>
          <SwiperSlider showpage={2}>
            {['Basic', 'Gold', 'Premium'].map((item, ide) => (
              <SwiperSlide>
                <Card key={ide} className='bg-new text-center'>
                  <Card.Body>
                    <img width={100} src="https://i.ibb.co/N9Kk8Zg/vscode-icons-file-type-kite.png" alt='Plan' />
                    <p className='mt-2 fw-bold fs-20'>{item}</p>
                    <p className='small mb-0 mt-2 text-truncate2 line-clamp-2'><BsCheck2 className='social-btn-re p-2 me-2 purple-combo' /> Lorem Ipsum is Simple Dummy.</p>
                    <p className='small mb-0 mt-2 text-truncate2 line-clamp-2'><BsCheck2 className='social-btn-re p-2 me-2 purple-combo' /> Lorem Ipsum is Simple Dummy.</p>
                    <p className='small mb-0 mt-2 text-truncate2 line-clamp-2'><BsCheck2 className='social-btn-re p-2 me-2 purple-combo' /> Lorem Ipsum is Simple Dummy.</p>
                    <div className='hr-border2 pb-4' />
                    <p className='mt-2 mb-0 fw-bold text-secondary fs-20'>₹ 10 / <span className='fs-15'>Month</span></p>
                  </Card.Body>
                </Card>
              </SwiperSlide>
            ))}
          </SwiperSlider>
        </Form.Group>
      </CardBox>

      <CardBox title={'Summary'}>
        <Col md={8}>
          <Row className='g-4'>
            <Form.Group as={Col} md={6}>
              <TextareaAutosize minRows={15} className='edit-textarea' placeholder='Add Messages...' />
            </Form.Group>
            <Form.Group as={Col} md={6}>
              <Card className='bg-new-re'>
                <Card.Body className='px-1'>
                  <div className='overflow-auto'>
                    <Table>
                      <tbody>
                        <tr>
                          <td colSpan={2}>Subtotal</td>
                          <th>₹52,412.00</th>
                        </tr>
                        <tr>
                          <td>Discount</td>
                          <th><Form.Control type="text" placeholder="Enter Amount" /></th>
                          <th> <Form.Select>
                            <option value="1">%</option>
                            <option value="2">₹</option>
                          </Form.Select></th>
                        </tr>
                        <tr>
                          <td>Cgst Tax</td>
                          <th>13%</th>
                          <th>₹52,412.00</th>
                        </tr>
                        <tr>
                          <td>Sgst Tax</td>
                          <th>0</th>
                          <th>₹52,412.00</th>
                        </tr>
                        <tr>
                          <td>Igst</td>
                          <th>0</th>
                          <th>₹52,412.00</th>
                        </tr>
                        <tr className='text-secondary'>
                          <th colSpan={2}>Grand Total</th>
                          <th>₹52,412.00</th>
                        </tr>
                        <tr className='text-secondary'>
                          <th colSpan={3}>Fifty-four thousand five hundred -Only</th>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Form.Group>
            <Form.Group as={Col} md={12}>
              <Form.Control type="text" placeholder="Payment Upi ID or Link" />
            </Form.Group>
          </Row>
        </Col>
        <Form.Group as={Col} md={4}>
          <Row className='g-4'>
            <Col md={12}>
              <Form.Control type="text" placeholder="Authorized Signature Name" />
            </Col>
            <Col md={12}>
              <Card className='bg-new-re text-center'>
                <Card.Body>
                  <div className='text-center py-5'>
                    <p className='mb-2 small text-muted'>Upload Signature Jpg, Png</p>
                    <Form.Label controlId="uploadphoto" className="fs-3 cursor-pointer mb-0">
                      <BsUpload />
                      <Form.Control type='file' className='d-none' />
                    </Form.Label>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12}>
              <Card className='bg-new-re text-center'>
                <Card.Body>
                  <div className='text-center py-5'>
                    <p className='mb-2 small text-muted'>Upload Upi - Scan to Pay Jpg, Png</p>
                    <Form.Label controlId="uploadphoto" className="fs-3 cursor-pointer mb-0">
                      <BsUpload />
                      <Form.Control type='file' className='d-none' />
                    </Form.Label>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form.Group>
      </CardBox>

      <Col md={12}>
        <div className='d-align gap-2 my-4'>
          <div onClick={() => setPreview(true)} className='social-btn text-gray px-4 w-auto d-align'>Preview</div>
          <div className='social-btn text-gray px-4 w-auto d-align'>Save Invoice</div>
        </div>
      </Col>

      <Modaljs open={preview} size={'xl'} closebtn={'Cancel'} Savebtn={'OK'} close={() => setPreview(false)} title={"Preview Invoice"}>
        <Row>
          <Col md={8}>
            <Card className='bg-new-re'>
              <Card.Body>
                {/* <div ref={quillRef}>
                  <InvoiceEdit />
                </div> */}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className='bg-new-re position-sticky top-0 h-100'>
              <Card.Body>
                <div className="d-grid gap-4">
                  {['Send Invoice', 'Download', 'Print', 'Edit Invoice'].map((name, idp) => (
                    <div key={idp} className="social-btn d-align w-auto">{name}</div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modaljs>
    </Row>
  )
}

export default CreateInvoice