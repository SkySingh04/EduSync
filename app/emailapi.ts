
  const callAPI = async (userId:string , data:string ) => {
    console.log("userId is:" + userId)
    console.log(data)
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, data: data }),
        };

    try {
      const response = await fetch("http://127.0.0.1:5000/send-email" ,options);
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData); // Log the response data to the console
        return(JSON.stringify(responseData));
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

    export default callAPI;