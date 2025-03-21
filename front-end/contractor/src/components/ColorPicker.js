import React, { useState } from 'react'
import { SketchPicker } from 'react-color';

const ColorPicker = () => {
  const [color, setColor] = useState({
    r: '225',
    g: '155',
    b: '99',
    a: '2',
  })
  const handleChangeColor = (selected) => {
    localStorage.setItem('body-bg', JSON.stringify(selected.rgb))
    setColor(selected.rgb)

    const bg = `rgba(${selected.rgb.r},${selected.rgb.g},${selected.rgb.b},${selected.rgb.a})`
    document.documentElement.style.setProperty('--bs-indigo', bg);
  };

  return (
    <SketchPicker className='w-100' color={color} onChange={handleChangeColor} />
  )
}

export default ColorPicker