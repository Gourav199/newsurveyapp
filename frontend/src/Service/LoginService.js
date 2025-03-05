import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Use process.env instead of import.meta.env
  headers: { "Content-Type": "application/json" },
});

class loginService {
    loginUser(payload) {
        // alert("Hello iam  the service file")
        console.log('====================================');
        console.log(payload);
        console.log('====================================');
        return api
      .post(
        "/login",payload
      )
      .then((res) => {
        console.log(res)
        return res;
        
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
    }

    adminLogin(payload) {
      // alert("Hello iam  the service file")
      console.log('====================================');
      console.log(payload);
      console.log('====================================');
      return api
    .post(
      "/admin-login",payload
    )
    .then((res) => {
      console.log(res)
      return res;
      
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
    });
  }
}

export default new loginService();

