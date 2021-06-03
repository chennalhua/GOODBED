const app = {
    el:{
        cartLength:document.querySelector('.cart-length'),
        cartProList : document.querySelector('.cartPro-list'),
        //訂單資料
        customerName : document.querySelector('#customerName'),
        customerPhone : document.querySelector('#customerPhone'),
        customerEmail : document.querySelector('#customerEmail'),
        customerAddress : document.querySelector('#customerAddress'),
        tradeWay : document.querySelector('#tradeWay'),
        orderInfoBtn : document.querySelector('.orderInfoBtn'),
        form : document.querySelector('form')
    },
    data:{
        cartData:[]
    },
    getCartList(){
        axios.get(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts`)
        .then(res => {
            this.data.cartData = res.data.carts;
            this.el.cartLength.textContent = this.data.cartData.length;
            this.renderCartList(this.data.cartData);
            //取得總金額
            const subtotal = document.querySelector('.subtotal');
            subtotal.textContent = `NT $${res.data.finalTotal}`
            const cartTotal = document.querySelector('.cart-total');
            cartTotal.textContent = `NT $${res.data.finalTotal + 300}`
        })
        .catch(err => {
            console.log(err);
        })
    },
    renderCartList(data){
        let str = '';
        data.forEach(item => {
            str += `<li class="d-flex justify-content-between row align-items-center mb-4">
            <div class="col-4">
              <img src="${item.product.images}" alt="${item.product.title}" class="w-100">
            </div>
            <div class="col-8">
              <p class="h5">${item.product.title}</p>
              <p class="m-0">NT$ ${item.product.price}</p>
            </div>
        </li>`
        })
        this.el.cartProList.innerHTML = str;
    },
    SendCartOrder(e){
        e.preventDefault();
        console.log(app.data.cartData)
        if(app.data.cartData.length === 0){
            alert('購物車空空喔！請選擇一件商品');
            window.location = 'product.html';
            return
        }
        if(app.el.customerName.value == '' || app.el.customerPhone.value == '' || app.el.customerEmail.value == '' || app.el.customerAddress.value == ''){
            alert('請正確填寫資料！！');
            return
        }
        axios.post(`${apiUrl}/api/livejs/v1/customer/${apiPath}/orders`,{
        "data": {
            "user": {
                "name": app.el.customerName.value,
                "tel": app.el.customerPhone.value,
                "email": app.el.customerEmail.value,
                "address": app.el.customerAddress.value,
                "payment": app.el.tradeWay.value
            }
            }
        })
        .then(res => {
            alert('訂單建立成功！');
            app.getCartList();
            window.location = 'checkout-finish.html';
        })
        .catch(err => {
            console.log(err);
        })
    },
    created(){
        this.getCartList();
        this.el.orderInfoBtn.addEventListener('click',this.SendCartOrder);
    }
}
app.created();