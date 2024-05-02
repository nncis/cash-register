const cash = document.getElementById("cash"); //input
const output = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
const cashInDraw = document.getElementById("cid");
const totalChange = document.getElementById("total-change");
const totalPrice = document.getElementById("total-price");


// let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]; 
// let price = 3.26;

// let cid = [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];
// let price = 19.5;


let cid = [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]];
let price = 19.5;

const currencyUnit = [["PENNY", 0.01], ["NICKEL", 0.05], ["DIME", 0.1], ["QUARTER", 0.25], ["DOLLAR", 1], ["FIVE", 5], ["TEN", 10], ["TWENTY", 20], ["ONE HUNDRED", 100]];

let changeResult = "";
let totalResult = [];
let emptyCid = false;
let closeDrawer = false;

let cashDrawer = [...cid]

//DISPLAYING RESULTS

cid.forEach((elem) => cashInDraw.innerHTML += `<p class="currency-total">${elem[0]}: $${elem[1]}</p>`);
totalPrice.innerText = `Total Price: $${price}`;

function formatNumber(number) {
    let formattedNumber = Number(number).toFixed(2).replace(/\.?0*$/, '');
    return formattedNumber;
}

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
    output.innerHTML = `<p id="status">Status: ${closeDrawer ? "CLOSED" : "OPEN"} ${string}</p>` //ej "TWENTY $60 TEN $30"
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


 const restCid = () => {

 }

const calculateCid = (remainingChange, cidConverted, currencyConverted) => {
//crear una copia de cid con los valores convertidos a centavos (multplicados por 100) para luego divirlos en 100

    for (let i = cidConverted.length - 1; i >= 0; i--) {
        if (remainingChange >= currencyConverted[i][1] && cidConverted[i][1] > 0) {
            while (remainingChange >= currencyConverted[i][1] && cidConverted[i][1] >= currencyConverted[i][1]) {
                remainingChange -= currencyConverted[i][1];
                cidConverted[i][1] -= currencyConverted[i][1];
                totalResult.push([cidConverted[i][0], currencyConverted[i][1] / 100])
            }

           // console.log(totalCidCash, "totalCidCash");
            console.log(remainingChange, "remainingChange");

            if (remainingChange > 0) {
                calculateCid(remainingChange, cidConverted, currencyConverted);
            }
 let totalCidCash = cidConverted.reduce((acc, elem) => acc + elem[1], 0);
        //     console.log(cid, "cash in raw");
            for(let i = 0; i < cashDrawer.length; i++){ //update cid to display
                cashDrawer[i][1] = cidConverted[i][1] / 100
            }

            if(totalCidCash == 0 && remainingChange == 0){
                closeDrawer = true;
            }
            
             if(remainingChange > 0 && totalCidCash == 0){
                 emptyCid = true;
             }
           return;
        }
    }
};


purchaseBtn.addEventListener("click", () => {

    let change = parseInt(cash.value) - price;

    let cidConverted = cid.map((value) => [value[0], Math.round(value[1] * 100)]);
    let currencyConverted = currencyUnit.map((value) => [value[0], Math.round(value[1] * 100)]);
    let remainingChange = Math.round(change * 100); 

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
    
    calculateCid(remainingChange, cidConverted, currencyConverted);
    updateCid(cashDrawer);
    if (emptyCid) {
        output.innerText = "Status: INSUFFICIENT_FUNDS"
        return;
    } else {
        displayResultArrayMaker(totalResult);
        displayResult(changeResult);
        displayTotalPriceAndChange();
    }
})
