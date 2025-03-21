import React from 'react'
import { ListGroup, Form } from 'react-bootstrap'
import ColorPicker from '../ColorPicker'

const ThemeCustomizer = ({ changeBg, checked }) => {

    const theme = [
        { id: 1, class: 'light', label: 'Light' },
        { id: 2, class: 'dark', label: 'Dark' },
        { id: 3, class: 'semi-dark', label: 'Semi Dark' },
    ]


    return (
        <ListGroup variant="flush" className='last-child-none'>
            {theme.map((theme, idx) => (
                <div key={idx} className={`hr-border2 ${idx < 1 ? 'pb-3' : 'py-3'}`}>
                    <ListGroup.Item className='bg-glass py-1 rounded border-0'>
                        <Form.Check className='lh-lg' type='radio' checked={checked === theme.class ? true : false} onChange={() => changeBg(theme.class)} label={theme.label} id={theme.class} name='theme' />
                    </ListGroup.Item>
                </div>
            ))}
            <div className='d-align pt-3 justify-content-start'>
                <ColorPicker />
            </div>
        </ListGroup>
    )
}

export default ThemeCustomizer