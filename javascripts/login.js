// document.cookie = `goodToken=${token}; expires=${expires}`;

const app = {
    el:{
        loginUser:document.querySelector('#loginUser'),
        loginPassword:document.querySelector('#loginPassword'),
        loginBtn:document.querySelector('#loginBtn')
    },
    data:{
        user:{
            username:'test@gmail.com',
            password:'12345',
        }
    },
    login(e){
        e.preventDefault();
        if(app.el.loginUser.value === '' || app.el.loginPassword.value === ''){
            alert('請完整輸入帳號密碼！');
            alert('測試用：帳號 test@gmail.com、密碼：12345。即可登入後台');
            return
        }else if(app.el.loginUser.value === app.data.user.username && app.el.loginPassword.value === app.data.user.password){
            document.cookie = `GoodToken=${token};`;
            alert('登入成功！歡迎使用');
            window.location = 'admin.html'
        }
    },
    created(){
        this.el.loginBtn.addEventListener('click',this.login);
    }
}
app.created();