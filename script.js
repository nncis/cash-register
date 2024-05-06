cash = document.getElementById("cash"); //input
const output = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
const cashInDraw = document.getElementById("cid");
const totalChange = document.getElementById("total-change");
const totalPrice = document.getElementById("total-price");

let cid = [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];
let price = 19.5;

//  let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]; 
//  let price = 3.26;

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


cid.forEach((value) => [value[0], Math.round(value[1] * 100)]);
currencyUnit.forEach((value) => [value[0], Math.round(value[1] * 100)]);

const calculateCid = (change, cashDrawer, currencyValue) => {
	for (let i = cashDrawer.length - 1; i >= 0; i--) { //iterate reverse the cid
		if (change >= currencyValue[i][1] && cashDrawer[i][1] > 0) { //find a currency[i] equal or major to change and if cid[i] has that amount of money 
			while (change >= currencyValue[i][1] && cashDrawer[i][1] >= currencyValue[i][1]) { //a bucle while to rest change and cid[i] the amount of the currency[i], until change will be major or equal to the currency[i] and 
				change -= currencyValue[i][1];																				//cid[i] will be major or equal to currency[i]. 
				cashDrawer[i][1] -= currencyValue[i][1];
				setResult(currencyValue[i]); //call set result passing as argument the currencyValue[i] to set this.result obj
			}
			if (change > 0) { //if still have change, just call calculateCid() and pass change as argument (recursive)
				console.log(cashDrawer[i]);
				if(cashDrawer[0][1] == 0 && change > 0){
					insufficientFound = true;
				}else if (change > 0) {
					calculateCid(change, cashDrawer, currencyValue);					
				}
			}
			return;	//avoid rest others currencies in cashDrawer
		}
	}
};

const setResult = (arr) => { //add to result obj the name of currency[i][0] as key and currency[i][1] as the value, if the key already exist sum the value
	let name = arr[0];
	let value = arr[1];

	if (result.hasOwnProperty(name)) {
		result[name] += value;
	} else {
		result[name] = value;
	}
};

const setDisplayMessage = (resultObj) => {
	for (let value in resultObj) {
		display += `${value}: $${resultObj[value] / 100} ` //divive here to avoid float point
	}
};

const setDisplay = () => {
	output.innerText = `Status: ${statusMsg} ${statusMsg !== "INSUFFICIENT_FUNDS" ? display : ""}`
}

purchaseBtn.addEventListener("click", () => {
	let totalCid = cid.reduce((acc, elem) => acc + elem[1], 0);
	let cashDrawer = cid.map((value) => [value[0], Math.round(value[1] * 100)]);
	let currencyValue = currencyUnit.map((value) => [value[0], Math.round(value[1] * 100)]);

	let change = cash.value - price;

	calculateCid(change * 100, cashDrawer, currencyValue);
	if (cash.value < price) {
		alert("Customer does not have enough money to purchase the item");
	}
	if (cash.value == price) {
		output.innerText = "No change due - customer paid with exact cash";
		return;
	}

	if (change == totalCid) {
		statusMsg = "CLOSED";
	} else if (change > totalCid || insufficientFound) {
		statusMsg = "INSUFFICIENT_FUNDS";
	} else {
		statusMsg = "OPEN";
	}
	setDisplayMessage(result);
	setDisplay();
})
