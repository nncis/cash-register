const cash = document.getElementById("cash"); //input
const output = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");

//quantity      101                  41                31               17           90          11            2                3                 1
let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]; //cash in drawer
let price = 19.5; //total pay
const currencyUnit = [["PENNY", 0.01], ["NICKEL", 0.05], ["DIME", 0.1], ["QUARTER", 0.25], ["DOLLAR", 1], ["FIVE", 5], ["TEN", 10], ["TWENTY", 20], ["ONE HUNDRED", 100]]

class CashRegister {
    constructor(){
        this.cashDrawer = {};
        this.cashQuantity = {};
    }

    addCashDrawer(totalCash){
        totalCash.forEach(cash => {
            this.cashDrawer[cash[0]] = cash[1];
        });
    }

    calculateCashQuantity(totalCash, currency){
        for(let i = 0; i < totalCash.length; i++){
            this.cashQuantity[totalCash[i][0]] = Math.round(totalCash[i][1] / currency[i][1])
        };
    }
   

    cashChange(){
        const totalChange = cash.value - price;
        
    }


}

const register = new CashRegister();





purchaseBtn.addEventListener("click", () => {
    if(cash.value < price){
        alert("Customer does not have enough money to purchase the item");
        return;
    };

    if(cash.value == price){
        alert("No change due - customer paid with exact cash");
        return;
    };

    register.addCashDrawer(cid);
    register.calculateCashQuantity(cid, currencyUnit);

    console.log(register.cashQuantity, "cash quantity");
    console.log(register.cashDrawer, "cash drawer");
})