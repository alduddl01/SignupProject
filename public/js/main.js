document.addEventListener("DOMContentLoaded", function () {
  // 비밀번호 정보 가져오기
  let elInputPassword = document.querySelector("#password1");
  let elInputPasswordRetype = document.querySelector("#password2");
  let elMismatchMessage = document.querySelector(".mismatch-message");

  function isMatch(password1, password2) {
    return password1 === password2;
  }

  if (elInputPasswordRetype) {
    elInputPasswordRetype.onkeyup = function () {
      if (elInputPasswordRetype.value.length !== 0) {
        if (isMatch(elInputPassword.value, elInputPasswordRetype.value)) {
          elMismatchMessage.classList.add("hide"); // 실패 메시지가 가려짐
        } else {
          elMismatchMessage.classList.remove("hide"); // 실패 메시지가 보여야 함
        }
      } else {
        elMismatchMessage.classList.add("hide"); // 실패 메시지가 가려짐
      }
    };
  }

  // ID 중복확인 버튼 클릭
  const idDuplBtn = document.querySelector("#id-dupl");
  if (idDuplBtn) {
    idDuplBtn.addEventListener("click", function () {
      const userId = document.querySelector("#userid").value;
      axios
        .post("/api/check-id", { userId: userId })
        .then((response) => {
          const idCheckMessage = document.querySelector("#id-check-message");
          idCheckMessage.textContent = response.data;
          idCheckMessage.classList.remove("hide");
        })
        .catch((error) => {
          const idCheckMessage = document.querySelector("#id-check-message");
          idCheckMessage.textContent = error.response.data;
          idCheckMessage.classList.remove("hide");
        });
    });
  }

  // 가입 버튼 클릭
  const submitBtn = document.querySelector("#submit-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      const userId = document.querySelector("#userid").value;
      const nickname = document.querySelector("#nickname").value;
      const password = document.querySelector("#password1").value;
      const userName = document.querySelector("#username").value;
      const phonenumber = document.querySelector("#phonenumber").value;
      const formData = { userId, nickname, password, userName, phonenumber };

      // 회원가입
      axios
        .post("/api/register", formData)
        .then((response) => {
          alert("회원가입 성공");
          window.location.href = "/"; // 로그인 페이지 이동
        })
        .catch((error) => {
          const errorMessageElement = document.querySelector("#error-message");
          if (errorMessageElement) {
            errorMessageElement.textContent =
              "회원가입 실패: " + error.response.data;
            errorMessageElement.classList.remove("hide");
          }
        });
    });
  }

  // 로그인 버튼 클릭
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await axios.post("/", { username, password });
        const responseMessage = document.getElementById("responseMessage");
        responseMessage.textContent = response.data.message;
        responseMessage.classList.remove("hide");

        if (response.data.success) {
          document.getElementById("viewProfileBtn").style.display =
            "inline-block"; // "회원정보 조회" 버튼 보이기
        }
      } catch (error) {
        console.error(error);
        const responseMessage = document.getElementById("responseMessage");
        responseMessage.textContent =
          "로그인 실패 : 아이디와 비밀번호를 확인해주세요.";
        responseMessage.classList.remove("hide");
      }
    });
  }

  // "회원정보 조회" 버튼 클릭
  const viewProfileBtn = document.getElementById("viewProfileBtn");
  if (viewProfileBtn) {
    viewProfileBtn.addEventListener("click", () => {
      window.location.href = "/mypage"; // 마이페이지로 이동
    });
  }

  // 회원가입 버튼 클릭
  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      window.location.href = "/signup"; // 회원가입 페이지로 이동
    });
  }

  // 마이페이지 로드 시 회원 정보 조회
  if (window.location.pathname === "/mypage") {
    axios
      .get("/api/user-info")
      .then((response) => {
        const userInfo = response.data;
        document.getElementById("userId").value = userInfo.UserId;
        document.getElementById("nickname").value = userInfo.Nickname;
        document.getElementById("userName").value = userInfo.UserName;
        document.getElementById("phonenumber").value = userInfo.Phonenumber;
      })
      .catch((error) => {
        alert("회원 정보 로드 실패.");
      });
  }

  // 마이페이지 수정 버튼 클릭
  const updateBtn = document.getElementById("updateBtn");
  if (updateBtn) {
    updateBtn.addEventListener("click", async () => {
      const nickname = document.getElementById("nickname").value;
      const userName = document.getElementById("userName").value;
      const phonenumber = document.getElementById("phonenumber").value;
      try {
        const response = await axios.post("/api/update-user", {
          nickname,
          userName,
          phonenumber,
        });
        const responseMessage = document.getElementById("responseMessage");
        responseMessage.textContent = response.data.message;
        responseMessage.classList.remove("hide");
      } catch (error) {
        console.error(error);
        const responseMessage = document.getElementById("responseMessage");
        responseMessage.textContent = "에러 발생";
        responseMessage.classList.remove("hide");
      }
    });
  }
});
