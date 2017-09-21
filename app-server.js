// -----------
// 1단계. 서버파일(app-passpassport-mysql-split) <- 쪼갬.
// 뷰 (views / mysql / auth / *.jade) 로 login, regisnter
//      이 파일에서는 템플릿 엔진을 jade로 쓸것 정의해주고, npm install jade 모듈 package에 추가
// 2단계 라우터 쪼갬
//      routes/mysql/auth.js
//      해당 파일에 passport 모듈쓰고 있어서 넘겨줌.
// -----------

//------------------
// :: 5. express 설정관련한것도 따로 뺌.
//------------------
var app = require('./config/mysql/express')();

//-----------------------------------------
// :: 3번 인증관련 passport 파일 config로 분리 아래 auth(passport) 사용
// :: 4번은 express mysql 관련한거 뺌 config/mysql/express.js
//-----------------------------------------
var passport = require('./config/mysql/passport')(app);

app.get('/welcome', function(req, res){
    if(req.user && req.user.displayName) {
        res.send(`
            <h1>Hello, ${req.user.displayName}</h1>
            <a href="/auth/logout">logout</a>
        `);
    } else {
        res.send(`
            <h1>Welcome</h1>
            <ul>
                <li><a href="/auth/login">Login</a></li>
                <li><a href="/auth/register">Register</a></li>
            </ul>
        `);
    }
});

//-----------------------------------------
// :: 2. router 관련 설정 아래 2줄로 파일로 뺐음.
//    :: 아래 passport라고 한거 함수로 호출한거. passport 넘김
//-----------------------------------------
var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/', auth);

app.listen(4000, function(){
    console.log('Connected 4000 port!!!');
});
