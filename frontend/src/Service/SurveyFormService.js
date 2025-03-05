import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Use process.env instead of import.meta.env
  headers: { "Content-Type": "application/json" },
});

class surveyService {
    saveUserDetails(payload) {
        // alert("Hello iam  the service file")
        console.log('====================================');
        console.log(payload);
        console.log('====================================');
        return api
      .post(
        "/saveUserDetails",payload
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

    getUserDetails(payload) {
      // alert("Hello iam  the service file")
      console.log('====================================');
      console.log(payload);
      console.log('====================================');
      return api
    .get(
      "/getUserdetails",payload
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

export default new surveyService();

