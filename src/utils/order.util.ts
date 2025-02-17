
export const generateOrderNumber=()=>{
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const second = date.getMilliseconds().toString().padStart(2, '0');
    const format = year + month + day + second;
    const orderNumber="order-"+format;
    return orderNumber
}


export const generateCheckoutNumber=()=>{
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const second = date.getMilliseconds().toString().padStart(2, '0');
    const format = year + month + day + second;
    const orderNumber="checkout-"+format;
    return orderNumber
}