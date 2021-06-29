const Modal = {
    openModal()
    {
        var element;

        element = document
        .querySelector(".modal-overlay");

        element
        .classList
        .toggle("active");
    }
} 

const Storage = {

    get(){

        return JSON.parse(localStorage.getItem("nar0n-transations")) || []

    },

    set(transactions){

        localStorage.setItem("nar0n-transations", JSON.stringify(transactions))

    }

}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes(){
        let income = 0;

        Transaction.all.forEach (transaction =>{

            if(transaction.amount > 0){
                income += transaction.amount;
            }

        })

        return income;
    },

    expenses(){
        
        let expense = 0;

        Transaction.all.forEach (transaction =>{

            if(transaction.amount < 0){
                expense += transaction.amount;
            }

        })

        return expense;

    },

    total(){

        return Transaction.incomes() + Transaction.expenses();
    }

}

const DOM = {

    transactionsContainer: document.querySelector('#data-table, tbody'),

    addTransaction(transaction, index){

        const tr = document.createElement('tr')

        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)

        tr.dataset.index = index
    
        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <tr>
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        </tr>
        `
        return html
    },

    updateBalance(){

        document
            .querySelector('#incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .querySelector('#expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .querySelector('#totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())

    },

    clearTransactions(){

        DOM.transactionsContainer.innerHTML = ''

    }

}

const Utils = {

    formatAmount(value){

        value = Number(value) * 100
        
        return value
    },
    
    formatDate(date){

        const splittedDate = date.split('-')
        
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){

        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, '')

        value = Number(value)/100

        value = value.toLocaleString('pt-br', {
            style:'currency',
            currency:'BRL'
        })

        return signal + value

    }
}

const Form = {

    description: document.querySelector('#description'),
    amount: document.querySelector('#amount'),
    date: document.querySelector('#date'),

    getValues(){

        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }

    },

    validadeFields(){
        const { description, amount, date} = Form.getValues()

        if(description.trim() === '' || amount.trim() === '' || date.trim() === ''){
            throw new Error('Preencha todos os CAMPOS!')
        }
    },

    formatValues(){

        let { description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount);

        date = Utils.formatDate(date);

        return {

            description,
            amount,
            date

        }

    },

    clearFields(){

        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""

    },

    submit(event) {
        event.preventDefault()

        try {
           
            Form.validadeFields();

            const transaction = Form.formatValues();

            Transaction.add(transaction);

            Form.clearFields();

            Modal.openModal();

        } catch (error) {
            alert(error.message)
        }

    }

}

const App = {

    init(){

        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance();

        Storage.set(Transaction.all)
        
    },

    reload(){

        DOM.clearTransactions() 

        Form.clearFields()

        App.init()
        
    }

}

App.init();