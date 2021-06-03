const app = {
    el:{
        orderList:document.querySelector('#order-list'),
        delAllBtn:document.querySelector('#del-all-btn'),

    },
    data:{
        orderData:[]
    },
    getOrderList(){
        axios.get(`${apiUrl}/api/livejs/v1/admin/${apiPath}/orders`)
        .then(res => {
            this.data.orderData = res.data.orders;
            this.renderOrderList(this.data.orderData);
        })
        .catch(err => {
            console.log(err)
        })
    },
    renderOrderList(data){
        let str = '';
        data.forEach((item,index) => {
            //訂單品項處理
            let orderPro = '';
            item.products.forEach(item => {
                orderPro += `${item.title} x ${item.quantity}`
            })
            //訂單日期處理
            let thisDate = new Date(item.createdAt * 1000);
            let orderDate = `${thisDate.getFullYear()}/${thisDate.getMonth()+1}/${thisDate.getDate()}`;
            str+= `<tr>
            <th scope="row">${index +1}</th>
            <td>${item.user.name}</td>
            <td>${item.user.tel}</td>
            <td>${item.user.address}</td>
            <td>${orderPro}</td>
            <td class="text-center">${orderDate}</td>
            <td class="text-center"><a href="#" class="btn btn-danger" data-id="${item.id}" data-action="remove">刪除</a></td>
        </tr>`
        })
        this.el.orderList.innerHTML = str;
    },
    delSingleOrderList(e){
        const id = e.target.dataset.id;
        const action = e.target.dataset.action;
        if(e.target.getAttribute('data-action') === null){
            return
        }
        axios.delete(`${apiUrl}/api/livejs/v1/admin/${apiPath}/orders/${id}`)
        .then(res => {
            alert('已刪除訂單資料！！');
            app.getOrderList();
        })
    },
    delAllOrderList(e){
        e.preventDefault();
        axios.delete(`${apiUrl}/api/livejs/v1/admin/${apiPath}/orders`)
        .then(res => {
            alert('已刪除訂單');
            app.getOrderList();
        })
        .catch(err => {
            console.log(err)
        })
    },
    created(){
        //取得 token 
        const GoodToken = document.cookie.replace(/(?:(?:^|.*;\s*)GoodToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        //將 token 加到 headers 表頭裡
        axios.defaults.headers.common['Authorization'] = GoodToken;
        this.getOrderList();
        this.el.orderList.addEventListener('click',app.delSingleOrderList);
        this.el.delAllBtn.addEventListener('click',app.delAllOrderList);
    }
}
app.created();