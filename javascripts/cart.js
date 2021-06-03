const app = {
    el:{
        cartLength:document.querySelector('.cart-length'),
        cartProList : document.querySelector('.cart-product-list'),
        checkOutBtn:document.querySelector('.checkout-btn')
    },
    data:{
        cartData:[]
    },
    //取得購物車列表
    getCartProList(){
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
    //渲染購物車列表
    renderCartList(data){
        let str = '';
        data.forEach(item => {
            str += `<li class="py-3">
            <div class="row mb-3">
                <div class="col-7 col-lg-3">
                    <div class="cart-pro-bg bg-cover" style="background-image: url('${item.product.images}');"></div>                            
                </div>
                <div class="col-5 col-lg-9 text-primary d-flex flex-column justify-content-between flex-lg-row align-items-center">
                    <div>
                        <h5>${item.product.title}</h5>
                        <p>NT$ ${item.product.price}</p>
                    </div>
                    <div class="row num-box text-center align-items-center no-gutters justify-content-end">
                        <div class="d-flex col-12 col-lg-5">
                            <a href="#" class="d-block p-3 num-minus icon-editNum" data-num="${item.quantity - 1}" data-id="${item.id}"><i class="fas fa-minus" data-num="${item.quantity - 1}" data-id="${item.id}"></i></a>
                            <input type="number" min="1" value="${item.quantity}" class="d-block p-3 text-center">
                            <a href="#" class="d-block p-3 num-add icon-editNum" data-num="${item.quantity + 1}" data-id="${item.id}"><i class="fas fa-plus" data-num="${item.quantity + 1}" data-id="${item.id}"></i></a>
                        </div>
                        <div class="col-lg-4 d-flex align-items-center">
                            <p class="h5 text-primary d-none d-lg-block">NT $ ${item.product.price * item.quantity}</p>
                            <a href="#" class="d-none d-lg-block  border-0"><i class="fas fa-trash num-del" data-id="${item.id}"></i></a>
                        </div>
                    </div>
                </div> 
            </div> 
            <p class="h5 text-primary text-right single-product-total py-3 d-lg-none">NT $ ${item.product.price * item.quantity}</p>
        </li>`
        })
        this.el.cartProList.innerHTML = str;
        if(data.length === 0){
            this.el.cartProList.innerHTML = `<li>購物車目前沒東西 QQ</li>`;
            this.el.checkOutBtn.addEventListener('click', e => {
                e.preventDefault();
                alert('購物車沒有結帳的項目');
                window.location = 'product.html'
            })
        }
        //加減數量
        const iconEditNum = document.querySelectorAll('.icon-editNum');
        iconEditNum.forEach(item => {
            item.addEventListener('click',e =>{
                e.preventDefault();
                console.log(e.target.dataset.num);
                this.cartEditNum(e.target.dataset.id , e.target.dataset.num)
            })
        })

        //刪除單筆購物車
        const trashDelBtn = document.querySelectorAll('.num-del');
        trashDelBtn.forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                this.delSingleCartList(e.target.dataset.id);
            })
        })
    },
    //加減數量
    cartEditNum(id,num){
        if(num > 0){
            axios.patch(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts`,{
                "data": {
                    "id": id,
                    "quantity": parseInt(num)
                }
            })
            .then(res => {
                console.log(res);
                this.getCartProList();
            })
        }else{
            this.delSingleCartList(id);
        }
    },
    delSingleCartList(id){
        axios.delete(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts/${id}`)
        .then(res => {
            this.getCartProList()
        })
    },
    created(){
        this.getCartProList();
    }
}
app.created();