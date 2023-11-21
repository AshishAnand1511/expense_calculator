import { React, useState } from 'react'
import "./App.css";
import { toast } from "react-toastify"

const App = () => {

  const [type, settype] = useState("Groceries")
  const [expense, setexpense] = useState("")
  const [amount, setamount] = useState("")
  const [date, setdate] = useState("")
  const [transaction, settransaction] = useState([])
  const [showbalance, setshowbalance] = useState(0)
  const [showincome, setshowincome] = useState(0)
  const [showexpense, setshowexpense] = useState(0)
  const [editingTransaction, setEditingTransaction] = useState(null);



  const submitHandler = (e) => {
    e.preventDefault();

    // create new transaction here
    const newTransaction = {
      type,
      expense,
      amount,
      date
    };

    // edit transaction part
    if (editingTransaction !== null) {
      const updatedTransactions = transaction.map((t, index) =>
        index === editingTransaction ? newTransaction : t
      );
      settransaction(updatedTransactions);
      setEditingTransaction(null);
    } else {
      settransaction([...transaction, newTransaction]);
    }

    // calculating balance

    let newShowIncome = showincome;
    let newShowExpense = showexpense;
    let newShowBalance = showbalance;


    if (newTransaction.type === 'Income') {
      newShowIncome += parseFloat(amount);
      newShowBalance += parseFloat(amount);
    } else {
      newShowExpense += parseFloat(amount);
      newShowBalance -= parseFloat(amount);
    }



    setshowincome(newShowIncome);
    setshowexpense(newShowExpense);
    setshowbalance(newShowBalance);

    // resetting form fields
    settype("Groceries");
    setexpense("");
    setamount("");
    setdate("");

  }

  // for deleting a transaction
  const deleteTransaction = (index) => {
    const deletedTransaction = transaction[index];

    if (index === editingTransaction) {
      setEditingTransaction(null);
    }

    if (deletedTransaction.type === "Income") {
      setshowincome((prevIncome) => prevIncome - parseFloat(deletedTransaction.amount));
      setshowbalance((prevBalance) => prevBalance - parseFloat(deletedTransaction.amount));
    } else {
      setshowexpense((prevExpense) => prevExpense - parseFloat(deletedTransaction.amount));
      setshowbalance((prevBalance) => prevBalance + parseFloat(deletedTransaction.amount));
    }

    const updatedTransaction = transaction.filter((_, i) => i !== index);
    settransaction(updatedTransaction);
  };


  const editTransaction = (index) => {
    const selectedTransaction = transaction[index];

    if (selectedTransaction.type === "Income") {
      setshowincome((prevIncome) => prevIncome - parseFloat(selectedTransaction.amount));
      setshowbalance((prevBalance) => prevBalance - parseFloat(selectedTransaction.amount));
    } else {
      setshowexpense((prevExpense) => prevExpense - parseFloat(selectedTransaction.amount));
      setshowbalance((prevBalance) => prevBalance + parseFloat(selectedTransaction.amount));
    }


    settype(selectedTransaction.type);
    setexpense(selectedTransaction.expense);
    setamount(parseFloat(selectedTransaction.amount));
    setdate(selectedTransaction.date);
    setEditingTransaction(index);
  };

  return (
    <div id='main'>
      <h1 id='expense'>Expense Tracker</h1>
      <div id='data'>
        <div id="income"><h1>Income</h1> <h1><span>{showincome}</span></h1></div>
        <div id="balance"><h1>Balance : {showbalance}</h1></div>
        <div id="expensee"><h1>Expense</h1> <h1><span>{showexpense}</span></h1></div>
      </div>
      <div id="form">
        <h2>New Transaction</h2>
        <form onSubmit={submitHandler}>
          <select onChange={(e) => settype(e.target.value)} required value={type}>
            <option value="Groceries">Groceries</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value='Income'>Income</option>
            <option value="something else">something else</option>
          </select>
          <input type="text" placeholder='enter expense' value={expense} onChange={(e) => setexpense(e.target.value)} required />
          <input type="number" placeholder='enter amount' value={amount} onChange={(e) => setamount(e.target.value)} required />
          <input type="date" value={date} onChange={(e) => setdate(e.target.value)} required />
          <input id='btn' type="submit" value="addTransaction" />
        </form>
      </div>
      <hr />
      <h1>Transaction History</h1>
      <ul>
        {transaction.map((transaction, index) => (
          <li key={index}>
            <span>Type : {transaction.type}</span>
            <span>Expense : {transaction.expense}</span>
            <span>Amount : {transaction.amount}</span>
            <span>Date : {transaction.date}</span>
            <button onClick={() => editTransaction(index)}>Edit</button>
            <button onClick={() => { deleteTransaction(index) }}>Delete</button>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default App