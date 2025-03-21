import React from 'react'
import { BsStarFill, BsStarHalf, } from "react-icons/bs";
import ReactStars from "react-rating-stars-component";


const RatingStar = () => {
    const ratingChanged = (newRating) => {
        console.log(`Total Stars: is ${newRating}`);
    };

    return (
        <ReactStars count={5} onChange={ratingChanged} size={24} isHalf={true} emptyIcon={<BsStarFill />} halfIcon={<BsStarHalf />} fullIcon={<BsStarFill />} activeColor="#f16a1b" />
    )
}

export default RatingStar