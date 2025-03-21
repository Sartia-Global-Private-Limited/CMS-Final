/* function  which covert number to string */
const converToNumber = value => {
  if (typeof value == 'string') {
    return Number(value);
  } else {
    return value;
  }
};
export default converToNumber;
