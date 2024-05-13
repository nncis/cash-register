const cash = document.getElementById("cash"); //input
const output = document.getElementById("change-due");
const changeOutput = document.getElementById("change-output")
const purchaseBtn = document.getElementById("purchase-btn");
const cashInDraw = document.getElementById("cid");
const totalChange = document.getElementById("total-change");
const totalPrice = document.getElementById("total-price");
const numPad = document.querySelectorAll(".num-pad > button");
const deleteBtn = document.getElementById("delete-btn")

// let cid = [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];
// let price = 19.5;

 let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]; 
 let price = 3.26;

// let cid = [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];
// let price = 19.5;


//let cid = [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];
//let price = 19.5;

const currencyUnit = [["PENNY", 0.01], ["NICKEL", 0.05], ["DIME", 0.1], ["QUARTER", 0.25], ["ONE", 1], ["FIVE", 5], ["TEN", 10], ["TWENTY", 20], ["ONE HUNDRED", 100]];

let statusMsg = "";
let display = "";
let changeResult = "";
let result = {};
let insufficientFound = false;

cid.forEach((elem) => cashInDraw.innerHTML += `<p class="cid-values">${elem[0]}: $${elem[1]}</p>`)
totalPrice.innerText = `Total Price: $${price}`

const updateCid = (cid) => {
	let values = document.querySelectorAll(".cid-values");

	for(let i = 0; i < values.length; i++){
		values[i].innerText = `${cid[i][0]}: $${cid[i][1]}`
	}
}

//The idea of the calculateCid function is to find the value of a bill that is greater than or equal to the change and verify that there is money of that bill in the cash drawer (cid)
//Then, it subtracts the value of the bill (currencyUnit) from the amount of bills in the drawer and from the change, until there is no amount of that bill left in the drawer or until the value of the change is 0.
//If there is no amount of that bill left in the drawer and there is still change, the function will be executed again to look for another bill to subtract from. This process will repeat until the value of the change is 0.

const calculateCid = (change, cashDrawer, currencyValue) => { 
	for (let i = cashDrawer.length - 1; i >= 0; i--) { 
			//iterate reverse the cid.
		if (change >= currencyValue[i][1] && cashDrawer[i][1] > 0) { 
			//find a currency[i] equal or major to change and if cid[i] has that amount of money.
			while (change >= currencyValue[i][1] && cashDrawer[i][1] >= currencyValue[i][1]) { 
			//a bucle while to rest change and cid[i] the value of the currency[i], until change will be major or equal to the currency[i] and cid[i] will be major or equal to currency[i].
				change -= currencyValue[i][1];
				cashDrawer[i][1] -= currencyValue[i][1];
				setResult(currencyValue[i]); 
				//call set result passing as argument the currencyValue[i] to set result obj.
			}
			if (change > 0) {                                            
				if(cashDrawer[0][1] == 0 && change > 0){
					insufficientFound = true; //this case is when the cid doesn't have enough money to give the change
				} else if (change > 0) {
					//if still have change, just call calculateCid() and pass the arguments (recursive)
					calculateCid(change, cashDrawer, currencyValue);					
				}
				 cid[i][1] = cashDrawer[i][1] / 100 //reasing the values of cid[i] and divide to 100 to display the correct value
			}
			//return here because the bucle "for" will still iterate and it will making rest on others values minor than the currency[i]
			return;	
		}
	}
};

//add to result obj the name of currency[i][0] as key and currency[i][1] as the value, if the key already exist sum the value
const setResult = (arr) => { 
	let name = arr[0];
	let value = arr[1];

	if (result.hasOwnProperty(name)) {
		result[name] += value;
	} else {
		result[name] = value;
	}
};

const displayChangeOutput = (resultObj) => {
	Object.keys(resultObj).forEach(key => {
		const p = document.createElement("p");
		p.innerHTML = `${key}: $${resultObj[key] / 100}`;
		changeOutput.appendChild(p);
	})
};

const displayStatus = () => {
	changeOutput.innerHTML = `<p>Status: <span id="status-msg">${statusMsg}</span></p>`;
};

//ONLY FOR TEST
//I can't use <p> elements to break lines because the FCC's test fails, so the only way I found to pass the test was concat a string to display it...
const setDisplayMessage = (resultObj) => {
	for (let value in resultObj) {
		display += `${value}: $${resultObj[value] / 100} ` //divive here to avoid float point issues
	}
};

const setDisplay = () => {
	output.innerHTML = `<p>Status: ${statusMsg} ${statusMsg !== "INSUFFICIENT_FUNDS" ? display : ""}</p>`
}
//---------------------

purchaseBtn.addEventListener("click", () => {
	//multiplay the data * 100 for avoiding float point issues
	let totalCid = cid.reduce((acc, elem) => acc + elem[1], 0);
	let cashDrawer = cid.map((value) => [value[0], Math.round(value[1] * 100)]);
	let currencyValue = currencyUnit.map((value) => [value[0], Math.round(value[1] * 100)]);
	let change = cash.value - price;
	let convertedChange = change * 100;

	totalChange.innerText = `Total Change: $${(convertedChange / 100).toFixed(2)}`

	calculateCid(convertedChange, cashDrawer, currencyValue);
	updateCid(cid);

	if (cash.value < price) {
		alert("Customer does not have enough money to purchase the item");
	}
	if (cash.value == price) {
		output.innerText = "No change due - customer paid with exact cash";
		return;
	}

	//set the statusMsg variable
	if (change == totalCid) {
		statusMsg = "CLOSED";
	} else if (change > totalCid || insufficientFound) {
		statusMsg = "INSUFFICIENT_FUNDS";
		
	} else {
		statusMsg = "OPEN";
	}
	
	//only for FCC's test
	setDisplayMessage(result);
	setDisplay();
	//-----//

	displayStatus();
	if(statusMsg != "INSUFFICIENT_FUNDS"){
		displayChangeOutput(result);
	};

	//adding color msg
	if(statusMsg == "INSUFFICIENT_FUNDS"){
		document.querySelector("#status-msg").style.color = "red";
	} else {
		document.querySelector("#status-msg").style.color = "green";
	}

	cash.value = ""

})

numPad.forEach(elem => {
	elem.addEventListener("click", () => {
		cash.value += elem.innerText;
	})
})

deleteBtn.addEventListener("click", () => {
	if(cash.value.length > 0){
		cash.value = cash.value.slice(0, -1)
	}
})
