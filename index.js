const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mysql = require("mysql2");
const app = express();
const path = require("path");
const port = 3001;

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: "192.168.0.101",
  user: "traveler",
  password: "1212",
  database: "dasol",
  connectionLimit: 30,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL 연결됨");
});

//bodyParser모듈
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//세션관리
app.use(
  session({
    secret: "@testsecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

// 정적파일 제공하기
app.use(express.static(path.join(__dirname, "public")));

//회원가입 경로 라우팅
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

//로그인 경로 라우팅
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

//마이페이지 경로 라우팅
app.get("/mypage", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mypage.html"));
});

// 로그인 API
app.post("/", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM Users WHERE UserId = ? AND Password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).send({ message: err });
    if (results.length > 0) {
      req.session.user = results[0];
      console.log("로그인 성공:", req.session.user); // 세션 값 확인
      res.send({ message: "로그인 성공", success: true });
    } else {
      res
        .status(401)
        .send({ message: "아이디 또는 비밀번호가 잘못되었습니다." });
    }
  });
});

// 사용자 정보 API
app.get("/api/user-info", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("로그인 필요");
  }
  const userId = req.session.user.UserId;
  const query =
    "SELECT UserName, UserId, Nickname, Phonenumber, CreatedAt FROM Users WHERE UserId = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    if (results.length > 0) {
      res.send(results[0]);
    } else {
      res.status(404).send("User not found");
    }
  });
});

// ID 중복 확인 엔드포인트
app.post("/api/check-id", (req, res) => {
  const { userId } = req.body;
  const query = "SELECT COUNT(*) as count FROM Users WHERE UserId = ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    if (result[0].count > 0) {
      return res.status(400).send("사용중인 ID입니다.");
    } else {
      return res.send("사용가능한 ID입니다.");
    }
  });
});

// 회원가입 엔드포인트
app.post("/api/register", (req, res) => {
  const { userId, password, nickname, userName, phonenumber } = req.body;
  const queryCheck = "SELECT COUNT(*) as count FROM Users WHERE UserId = ?";
  const queryInsert =
    "INSERT INTO Users (UserName, UserId, Nickname, Password, Phonenumber, CreatedAt) VALUES (?, ?, ?, ?, ?, NOW())";

  db.query(queryCheck, [userId], (err, result) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    if (result[0].count > 0) {
      return res.status(400).send("사용중인 ID입니다.");
    } else {
      db.query(
        queryInsert,
        [userName, userId, nickname, password, phonenumber],
        (err, result) => {
          if (err) {
            return res.status(500).send("회원가입 실패 Database error");
          }
          return res.status(201).send("회원가입이 완료되었습니다.");
        }
      );
    }
  });
});

// 회원 정보 수정 엔드포인트
app.post("/api/update-user", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("로그인 필요");
  }

  const { nickname, userName, phonenumber } = req.body;
  const userId = req.session.user.UserId;
  const query =
    "UPDATE Users SET Nickname = ?, UserName = ?, Phonenumber = ? WHERE UserId = ?";

  db.query(query, [nickname, userName, phonenumber, userId], (err, result) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    req.session.user.Nickname = nickname;
    req.session.user.UserName = userName;
    req.session.user.Phonenumber = phonenumber;
    return res.send({ message: "사용자 정보가 업데이트되었습니다." });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
