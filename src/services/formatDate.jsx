export const formatDate = (dateString)=>{
    //define options for formatting the date
    const options = {year:"numeric", month:"long", day:"numeric"};

    //create  a new Date object with provided dateString
    const date = new Date(dateString);

    // Format the date using the toLocaleDateString method with the provided options
    const formatedDate = date.toLocaleDateString("en-US",options);

     // Extract hour and minutes from the date
     const hour = date.getHours();
     const minutes = date.getMinutes();

     //determine if it's AM or PM based on the hour
     const period = hour >= 12 ? "PM" : "AM";

      // Format the time as hours:minutes with leading zero for minutes and AM/PM
      const formatedTime = `${hour%12}:${minutes.toString().padStart(2,"0")}${period}`;

        // Combine the formatted date and time with a separator and return the result
        return `${formatedDate} | ${formatedTime}`;
}