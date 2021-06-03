const app = {
    el:{
        proList: document.querySelector('.pro-list'),
        proItemNav: document.querySelector('.item-nav'),
        allProductBtn:document.querySelector('#all-product-btn'),
        cartLength:document.querySelector('.cart-length'),
    },
    data:{
        proData :[],
        cartData:[]
    },
    //取得產品列表
    getProList(){
        axios.get(`${apiUrl}/api/livejs/v1/customer/${apiPath}/products`)
        .then(res => {
            this.data.proData = res.data.products;
            this.renderProList(this.data.proData);
            this.filterProList(this.data.proData);
        })
        .catch(err => {
            console.error(err);
        })
    },
    //產品列表渲染
    renderProList(data){
        let str = '';
        data.forEach((item) => {
            str += `<li class="col-md-6 col-lg-4 mb-4 ">
            <div class="card product-card h-100">
                <div class=" position-relative">
                <img src="${item.images}" class="card-img-top" alt="${item.title}">
                <p class="hot-tag text-light position-absolute">新品</p>
                </div>
                <div class="card-body py-2 text-center d-flex flex-column justify-content-center">
                <h3 class="h5">${item.title}</h3>
                <p class="m-0">NT$ ${item.price}</p>
                </div>
                <a href="#" class="d-block bg-primary text-light text-center py-3 add-cart" data-id="${item.id}">加入購物車</a>
            </div>
            </li>`
        })
        this.el.proList.innerHTML = str;
    },
    //篩選
    filterProList(data){
        this.el.proItemNav.addEventListener('click',(e) => {
            e.preventDefault();
            if(e.target.dataset.name === '所有商品'){
                this.created();
                return
            }
            let str = '';
            data.forEach((item) => {
                if(e.target.dataset.name === item.category){
                    str += `<li class="col-md-6 col-lg-4 mb-4 ">
            <div class="card product-card h-100">
                <div class=" position-relative">
                <img src="${item.images}" class="card-img-top" alt="${item.title}">
                <p class="hot-tag text-light position-absolute">新品</p>
                </div>
                <div class="card-body py-2 text-center d-flex flex-column justify-content-center">
                <h3 class="h5">${item.title}</h3>
                <p class="m-0">NT$ ${item.price}</p>
                </div>
                <a href="#" class="d-block bg-primary text-light text-center py-3 add-cart" data-id="${item.id}">加入購物車</a>
            </div>
            </li>`
                }
                this.el.proList.innerHTML = str;
            })
        })
    },
    //取得購物車列表
    getCartProList(){
        axios.get(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts`)
        .then(res => {
            this.data.cartData = res.data.carts;
            this.el.cartLength.textContent = this.data.cartData.length;
        })
        .catch(err => {
            console.log(err);
        })
    },
    //加入購物車
    addCart(){
        this.el.proList.addEventListener('click',e =>{
            e.preventDefault();
            if(e.target.nodeName !== 'A'){
                return
            }
            let targetId = e.target.dataset.id;
            let num = 1;
            this.data.cartData.forEach(item => {
                if(item.product.id == targetId){
                    num = item.quantity += 1;
                }
            })
            axios.post(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts`,{
                "data":{
                    "productId": targetId,
                    "quantity": num
                }
            })
            .then(res => {
                alert('已加入購物車');
                this.getCartProList();
            })
        })
    },
    created(){
        this.getProList();
        this.getCartProList();
        this.addCart();
    }
}
app.created();