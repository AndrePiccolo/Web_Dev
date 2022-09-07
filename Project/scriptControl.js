const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
var reserveArr = [];

let populateCalendar = function(){

    //Create month and year options
    creatBoxList();

    //clean selected days when change month
    cleanCalendar();

    let selectedMonth = document.getElementById("month").value;
    let selectedYear = document.getElementById("year").value;

    let providedDate;
    if(selectedMonth < 0 || selectedYear <= 0){
        providedDate = new Date(Date.now()); //if no date provided, use current month
    }else{
        providedDate = new Date(selectedYear, selectedMonth, 0)
    }

    //Create calendar based on days of week and position in calendar
    createCalendar(providedDate);
    
    //Mark on calendar reserved days
    markReservedDay(providedDate);
}

//Create month and year options
let creatBoxList = function(){
    let yearBoxList = document.getElementById("year");
    if(yearBoxList.length <= 1){
        for (let interator = 2021; interator <= 2050; interator++) {
            let option = document.createElement('option');
            option.value = interator;
            option.innerHTML = interator;
            yearBoxList.appendChild(option);
        }
    }

    let monthBoxList = document.getElementById("month");
    if(monthBoxList.length <= 1){
        let counter = 1;
        for (let month of monthNames) {
            let option = document.createElement('option');
            option.value = counter;
            option.innerHTML = month;
            counter++;
            monthBoxList.appendChild(option);
        }
    }
}

//clean selected days when change month
let cleanCalendar = function(){
    let tableStyle = document.querySelectorAll("td");
    for(let cell of tableStyle){
        cell.style.backgroundImage = "linear-gradient(to right, white, white)";
    }

    for(let control = 1; control <= 42; control++){
        let tableCell = document.getElementById(control);
        tableCell.innerHTML = "";
    }
}

//Mark on calendar reserved days
let markReservedDay = function(dateInformation){
    let reserveArr = JSON.parse(localStorage.getItem("reserve"));
    
    if(reserveArr != null){
        let calendarTable = document.querySelectorAll("td");

        for(let appointment of reserveArr){
            let storageDate = new Date(appointment.date);

            if(dateInformation.getUTCMonth() == storageDate.getUTCMonth() && 
            dateInformation.getUTCFullYear() == storageDate.getUTCFullYear()){

                for(let iterator = 0; iterator < calendarTable.length; iterator++){
                    if(storageDate.getUTCDate() == calendarTable[iterator].innerHTML){
                        calendarTable[iterator].innerHTML += ` - ${appointment.firstName} ${appointment.lastName}`
                        calendarTable[iterator].style.backgroundImage = "linear-gradient(to right, orange,yellow)";
                    }
                }
            }
        }
    }
}

//Create calendar based on days of week and position in calendar
let createCalendar = function(dateInformation){

    let month = document.getElementById("currentMonth");
    month.innerHTML = monthNames[dateInformation.getUTCMonth()] + " " + dateInformation.getUTCFullYear();

    let numberOfDays = new Date(dateInformation.getUTCFullYear(), dateInformation.getUTCMonth()+1, 0).getDate();

    let startCount = false;
    let day = 1;
    for(let control = 1; control <= 42; control++){
        if(startCount){
            day++;
        }
        if(day > numberOfDays){
            break;
        }
        let dayOfWeek = new Date(dateInformation.getUTCFullYear(), dateInformation.getUTCMonth(), day).getDay()
        let tableCell = document.getElementById(control);
        if(control != dayOfWeek+1 && !startCount){
            tableCell.innerHTML = "";
        } else{
            startCount = true;
            tableCell.innerHTML = day;
        }
    }
}

//Add new reservation in the reserve list
let newAppointment = function(form){
    
    if(form[0].value == "" || form[1].value == "" || form[2].value == "" ||
        form[3].value == "" || form[4].value == ""){
        alert("First Name, Last Name, Date, Email and Phone Number are required");
    } else{
        reserveArr = JSON.parse(localStorage.getItem("reserve"))

        let appointmentDetails = {
            firstName: form[0].value,
            lastName: form[1].value,
            date: form[2].value,
            email: form[3].value,
            phone: form[4].value,
            comments: form[5].value 
        }
    
        appointmentDetails.date = appointmentDetails.date.replaceAll("-","/");
    
        if(new Date(Date.now()) > new Date(appointmentDetails.date)){
            alert("Date must be bigger than today");
       
        }else if(reserveArr == null){
            reserveArr = [appointmentDetails];
    
            localStorage.setItem("reserve", JSON.stringify(reserveArr));
        
            alert("Reserve Success\nName: " + appointmentDetails.firstName + " " + appointmentDetails.lastName +
            "\nDate: " + appointmentDetails.date + "\nComments: " + appointmentDetails.comments);
        
            form[0].value = '';
            form[1].value = '';
            form[2].value = '';
            form[3].value = '';
            form[4].value = '';
            form[5].value = '';
    
        }else if(!checkIfDateAvailable(appointmentDetails)){
            alert("Date not available");
        }else{
            reserveArr.push(appointmentDetails);
    
            localStorage.setItem("reserve", JSON.stringify(reserveArr));
        
            alert("Reserve Success\nName: " + appointmentDetails.firstName + " " + appointmentDetails.lastName +
            "\nDate: " + appointmentDetails.date + "\nComments: " + appointmentDetails.comments);
        
            form[0].value = '';
            form[1].value = '';
            form[2].value = '';
            form[3].value = '';
            form[4].value = '';
            form[5].value = '';
        }
    }
}

//Check if date is available, only one reserve per day is allowed
let checkIfDateAvailable = function(selectedDay){
    let reservationArrray = JSON.parse(localStorage.getItem("reserve"));
    let daySelected = new Date(selectedDay.date);

    for(let reservation of reservationArrray){
        let reservedDays = new Date(reservation.date)

        if(reservedDays.getFullYear() == daySelected.getFullYear() &&
           reservedDays.getUTCMonth() == daySelected.getUTCMonth() &&
           reservedDays.getUTCDate() == daySelected.getUTCDate()){
            return false;
        }
    }
    return true;
}

//Calculate value based on party type and number of guests
let calculateValue = function(typeParty){
    let totalPrice;
    switch (typeParty) {
        case 'E':
            let economic = document.getElementById("guestsEconomic").value;
            if(economic <= 0){
                alert("Number of guests need to be more than zero");
            }else{
                totalPrice = economic*15;
                alert(`Total Price: $${totalPrice.toFixed(2)} for economic package`)
            }
            break;

        case 'C':
            let classic = document.getElementById("guestsClassic").value;
            if(classic <= 0){
                alert("Number of guests need to be more than zero");
           }else{
                totalPrice = classic*25;
                alert(`Total Price: $${totalPrice.toFixed(2)} for classic package`)
            }
            break;

        case 'P':
            let premium = document.getElementById("guestsPremium").value;
            if(premium <= 0){
                alert("Number of guests need to be more than zero");
            }else{
                totalPrice = premium*35;
                alert(`Total Price: $${totalPrice.toFixed(2)} for premium package`)
            }
        break;
        default:
            break;
    }
}