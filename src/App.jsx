import { useState } from "react";

// const API = "https://securenotes-7hbn.onrender.com";
const API = "https://securenotes-1-xqdi.onrender.com"

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [cells, setCells] = useState([]);

  const login = async (password) => {
    const res = await fetch(API + "/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({password})
    });

    const data = await res.json();

    if (data.status === "success") setLoggedIn(true);
    else setWrong(true);
  };

  const addCell = () => {
    setCells([...cells, {text: "", encrypted: "", temp: ""}]);
  };

  const handleChange = async (i, value) => {
    const res = await fetch(API + "/encrypt", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({text: value})
    });

    const data = await res.json();

    const updated = [...cells];
    updated[i].text = value;
    updated[i].encrypted = data.encrypted;

    setCells(updated);
  };

  const copyText = async (i) => {
    const res = await fetch(API + "/decrypt", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({text: cells[i].encrypted})
    });

    const data = await res.json();

    navigator.clipboard.writeText(data.decrypted);

    const updated = [...cells];
    updated[i].temp = data.decrypted;
    setCells(updated);

    setTimeout(() => {
      updated[i].temp = "";
      setCells([...updated]);
    }, 2000);
  };

  if (!loggedIn && !wrong) {
    return (
      <div>
        <h2>Password</h2>
        <input type="password" onKeyDown={(e)=>{
          if(e.key==="Enter") login(e.target.value)
        }} />
      </div>
    );
  }

  if (wrong) return <h1>Hello World</h1>;

  return (
    <div>
      <h2>Secure Notes</h2>
      <button onClick={addCell}>Add Cell</button>

      {cells.map((cell, i) => (
        <div key={i}>
          <textarea onChange={(e)=>handleChange(i,e.target.value)} />
          <button onClick={()=>copyText(i)}>Copy</button>
          <p>{cell.encrypted}</p>
          <p>{cell.temp}</p>
        </div>
      ))}
    </div>
  );
}

export default App;