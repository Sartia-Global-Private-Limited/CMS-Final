import { Alert } from 'react-bootstrap';

const Alerts = () => {
    return (
        <Alert className='mb-0 d-md-block d-none py-1 my-alert small' variant="success" dismissible>
            <strong>Happy Birthday 🎉 Ansarul!</strong> From Lorem Ipsum Pvt Ltd.
        </Alert>
    )
}

export default Alerts