const cash = document.getElementById("cash"); //input
const output = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
const cashInDraw = document.getElementById("cid");
const totalChange = document.getElementById("total-change");
const totalPrice = document.getElementById("total-price");


// let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]; 
// let price = 3.26;

let cid = [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];
let price = 19.5;

const currencyUnit = [["PENNY", 0.01], ["NICKEL", 0.05], ["DIME", 0.1], ["QUARTER", 0.25], ["DOLLAR", 1], ["FIVE", 5], ["TEN", 10], ["TWENTY", 20], ["ONE HUNDRED", 100]];

let changeResult = "";
let totalResult = [];
let emptyCid = false;


//DISPLAYING RESULTS

cid.forEach((elem) => cashInDraw.innerHTML += `<p class="currency-total">${elem[0]}: $${elem[1]}</p>`);
totalPrice.innerText = `Total Price: $${price}`;

const displayTotalPriceAndChange = () => {
    totalChange.innerText = `Total Change: $${(cash.value - price).toFixed(2)}`
};

const updateCid = (cid) => {
    const cidTotal = document.querySelectorAll(".currency-total")

    for (let i = 0; i < cidTotal.length; i++) {
        cidTotal[i].innerText = `${cid[i][0]}: $${cid[i][1].toFixed(2)}`
    }

};

const displayResult = (string) => {
    output.innerHTML = `<p id="status">Status: OPEN ${string}</p>` //ej "TWENTY $60 TEN $30"
};

const displayResultConcat = (currency, value) => {
    changeResult += `${currency}: $${(value).toFixed(2)} `
};

const cleanDuplicates = (array) => {
    let valueTracker = {};

    array.forEach((item) => {
        let name = item[0];
        let value = item[1];

        if (valueTracker.hasOwnProperty(name)) {
            valueTracker[name] += value;
        } else {
            valueTracker[name] = value;
        }
    });

    let resultArray = [];
    for (let name in valueTracker) {
        resultArray.push([name, valueTracker[name]]);
    }
    return resultArray;
}

const displayResultArrayMaker = (array) => {

    let cleanArray = cleanDuplicates(array)

    cleanArray.forEach((elem) => {
        displayResultConcat(elem[0], elem[1])
    })
};

//CASH IN DRAW FUNCTIONS

const calculateCid = (change) => {

    for (let i = cid.length - 1; i >= 0; i--) {

        if (change >= currencyUnit[i][1] && cid[i][1] > 0) {
            while (change >= currencyUnit[i][1] && cid[i][1] >= currencyUnit[i][1]) {
                totalResult.push([cid[i][0], currencyUnit[i][1]])
                change -= currencyUnit[i][1];
                cid[i][1] -= currencyUnit[i][1];
            }
            let totalCidCash = cid.reduce((acc, elem) => acc + elem[1], 0).toFixed(2);

            console.log(totalCidCash, "totalCidCash");
            console.log(change, "change");
            console.log(cid[i][1], "-", currencyUnit[i][1]);
            if (change > 0) {
                calculateCid(parseFloat(change.toFixed(2)));
            }

            if(change > 0 && totalCidCash == 0){
                emptyCid = true;
            }

            return;
        }
    }
};


purchaseBtn.addEventListener("click", () => {

    let change = parseInt(cash.value) - price;

    if (cash.value < price) {
        output.innerText = "Status: INSUFFICIENT_FUNDS"
        alert("Customer does not have enough money to purchase the item");
        return;
    };

    if (cash.value == price) {
        output.innerText = "No change due - customer paid with exact cash"
        alert("No change due - customer paid with exact cash");
        return;
    };
    
    calculateCid(change);
    updateCid(cid);
    if (emptyCid) {
        output.innerText = "Status: INSUFFICIENT_FUNDS"
        return;
    } else {
        displayResultArrayMaker(totalResult);
        displayResult(changeResult);
        displayTotalPriceAndChange();
    }
})
