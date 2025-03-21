import { useState } from "react";
import { Form } from "react-bootstrap";

const OtpPage = () => {
    const [otpArray, setOtpArray] = useState(new Array(4).fill(""));
    const handelChange = (element, index, e) => {
        if (isNaN(element?.value)) return false;
        if (e.key === "Backspace") {
            if (element?.previousSibling != null) {
                element?.previousSibling?.focus();
            }
            if (index === otpArray.length - 1) {
                setOtpArray([...otpArray?.map((item, currentIndex) => (index === currentIndex) ? "" : item)]);
            } else {
                setOtpArray([...otpArray?.map((item, currentIndex) => (index === currentIndex) ? element?.value : item)]);
            }
        } else {
            setOtpArray([...otpArray?.map((item, currentIndex) => (index === currentIndex) ? element?.value : item)]);
            if (element?.nextSibling != null && element?.value) {
                element?.nextSibling?.focus();
            }
        }
    }
    return (
        <>
            {
                otpArray?.length > 0 &&
                otpArray?.map((item, index) => {
                    return (
                        <Form.Control
                            key={index}
                            type='text'
                            className="fs-4 text-center fw-bold"
                            maxLength={1}
                            value={item}
                            onChange={(e) => handelChange(e.target, index, e)}
                            onFocus={e => e.target.select()}
                            onKeyDown={(e) => handelChange(e.target, index, e)}
                        />
                    )
                })
            }
            {/* {console.log('otpData', otpArray?.join(""))} */}
        </>
    )
}
export default OtpPage
