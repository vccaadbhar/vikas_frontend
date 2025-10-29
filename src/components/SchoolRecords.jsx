import React, { useEffect, useState } from "react";
import axios from "axios";
import { utils, writeFile } from "xlsx";

const API = "http://localhost:4000";

function SchoolRecords({ onBack }) {
  const [view, setView] = useState("menu");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // ---- States ----
  const [payments, setPayments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teacherPayments, setTeacherPayments] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [overview, setOverview] = useState(null);
  const [feeStructures, setFeeStructures] = useState([]);
  const [teacherStructures, setTeacherStructures] = useState([]);

  // Filters
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  // Forms
  const [newFee, setNewFee] = useState({ studentId: "", feeType: "", month: "", receiptNo: "", amountPaid: "", status: "paid" });
  const [newPayment, setNewPayment] = useState({ teacherId: "", month: "", amount: "", status: "paid" });
  const [newExpense, setNewExpense] = useState({ title: "", amount: "", category: "other" });
  const [newStructure, setNewStructure] = useState({ className: "", feeType: "", amount: "", dueDate: "" });
  const [newTeacherStructure, setNewTeacherStructure] = useState({ teacherId: "", salaryType: "fixed", amount: "", month: "" });

  // Helpers
  const monthsAll = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const calcFeeTotals = (list=[]) => {
    let collected=0, remaining=0;
    for(const p of list){
      if(p.status==="paid") collected+=Number(p.amountPaid||0);
      else remaining+=Number(p.amountPaid||0);
    }
    return {collected, remaining};
  };
  const groupByStudent = (list=[])=>{
    const map=new Map();
    for(const p of list){
      const sid=p?.student?._id;
      const prev=map.get(sid)||{student:p.student, rows:[]};
      prev.rows.push(p);
      map.set(sid,prev);
    }
    return Array.from(map.values());
  };

  // ---- Loaders ----
  useEffect(()=>{
    if(view==="studentFees") loadStudentFees();
    if(view==="teacherPayments") loadTeachers();
    if(view==="expenses") loadExpenses();
    if(view==="overview") loadOverview();
    if(view==="feeStructure") loadFeeStructures();
    if(view==="teacherStructure") loadTeacherStructures();
  },[view]);

  const loadStudentFees = async ()=>{
    const res = await axios.get(`${API}/api/fees/filter`,{headers,params:{name:search,className:classFilter,section:sectionFilter,status:statusFilter}});
    setPayments(res.data||[]);
  };
  const loadTeachers=async()=>{const res=await axios.get(`${API}/api/admin/teachers`,{headers});setTeachers(res.data)};
  const loadTeacherPayments=async(id)=>{const res=await axios.get(`${API}/api/teacher/${id}/payments`,{headers});setTeacherPayments(p=>({...p,[id]:res.data}))};
  const loadExpenses=async()=>{const res=await axios.get(`${API}/api/expenses`,{headers});setExpenses(res.data)};
  const loadOverview=async()=>{const res=await axios.get(`${API}/api/reports/overview`,{headers});setOverview(res.data)};
  const loadFeeStructures=async()=>{const res=await axios.get(`${API}/api/fees/structure`,{headers});setFeeStructures(res.data)};
  const loadTeacherStructures=async()=>{const res=await axios.get(`${API}/api/teacher/structure`,{headers});setTeacherStructures(res.data)};

  // ---- Add Handlers ----
  const addFee=async(e)=>{e.preventDefault();await axios.post(`${API}/api/fees/payment`,newFee,{headers});setNewFee({studentId:"",feeType:"",month:"",receiptNo:"",amountPaid:"",status:"paid"});loadStudentFees();};
  const addTeacherPayment=async(e)=>{e.preventDefault();await axios.post(`${API}/api/teacher/${newPayment.teacherId}/payments`,newPayment,{headers});setNewPayment({teacherId:"",month:"",amount:"",status:"paid"});loadTeacherPayments(newPayment.teacherId);};
  const addExpense=async(e)=>{e.preventDefault();await axios.post(`${API}/api/expenses`,newExpense,{headers});setNewExpense({title:"",amount:"",category:"other"});loadExpenses();};
  const addFeeStructure=async(e)=>{e.preventDefault();await axios.post(`${API}/api/fees/structure`,newStructure,{headers});setNewStructure({className:"",feeType:"",amount:"",dueDate:""});loadFeeStructures();};
  const addTeacherStructure=async(e)=>{e.preventDefault();await axios.post(`${API}/api/teacher/structure`,newTeacherStructure,{headers});setNewTeacherStructure({teacherId:"",salaryType:"fixed",amount:"",month:""});loadTeacherStructures();};

  // ---- Export ----
  const exportToExcel=(data,name)=>{if(!data||!data.length) return alert("No data");const ws=utils.json_to_sheet(data);const wb=utils.book_new();utils.book_append_sheet(wb,ws,"Report");writeFile(wb,`${name}.xlsx`)};

  // ---- Render ----
  return (
    <div className="p-6">
      <button onClick={onBack} className="mb-4 px-3 py-1 border rounded">⬅ Back</button>
      <h2 className="text-2xl font-bold mb-6">📊 School Records</h2>

      {/* MENU */}
      {view==="menu"&&(
        <div className="space-y-3">
          <button onClick={()=>setView("studentFees")} className="w-full border rounded px-4 py-2">👨‍🎓 Student Fees</button>
          <button onClick={()=>setView("teacherPayments")} className="w-full border rounded px-4 py-2">👨‍🏫 Teacher Payments</button>
          <button onClick={()=>setView("expenses")} className="w-full border rounded px-4 py-2">💸 Expenses</button>
          <button onClick={()=>setView("feeStructure")} className="w-full border rounded px-4 py-2">📘 Fee Structure</button>
          <button onClick={()=>setView("teacherStructure")} className="w-full border rounded px-4 py-2">👨‍🏫 Teacher Payment Structure</button>
          <button onClick={()=>setView("overview")} className="w-full border rounded px-4 py-2">📊 Overall Report</button>
        </div>
      )}

      {/* STUDENT FEES */}
      {view==="studentFees"&&(
        <div>
          <div className="flex gap-4 mb-4">
            {(()=>{const {collected,remaining}=calcFeeTotals(payments);return(<>
              <div className="border px-3 py-2 rounded">💰 Collected: ₹{collected}</div>
              <div className="border px-3 py-2 rounded">🧾 Remaining: ₹{remaining}</div>
            </>);})()}
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <input placeholder="Class" value={classFilter} onChange={e=>setClassFilter(e.target.value)} className="border px-2" />
            <input placeholder="Section" value={sectionFilter} onChange={e=>setSectionFilter(e.target.value)} className="border px-2" />
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="border px-2">
              <option value="">All</option><option value="paid">Paid</option><option value="pending">Unpaid</option><option value="partial">Partial</option>
            </select>
            <input placeholder="Search Name" value={search} onChange={e=>setSearch(e.target.value)} className="border px-2" />
            <button onClick={loadStudentFees} className="bg-blue-500 text-white px-3 rounded">🔍 Search</button>
            <button onClick={()=>exportToExcel(payments,"student-fees")} className="bg-green-600 text-white px-3 rounded">⬇ Export</button>
          </div>
          <form onSubmit={addFee} className="mb-4 flex flex-wrap gap-2">
            <input placeholder="Student ID" value={newFee.studentId} onChange={e=>setNewFee({...newFee,studentId:e.target.value})}/>
            <input placeholder="Fee Type" value={newFee.feeType} onChange={e=>setNewFee({...newFee,feeType:e.target.value})}/>
            <input placeholder="Month" value={newFee.month} onChange={e=>setNewFee({...newFee,month:e.target.value})}/>
            <input placeholder="Receipt No" value={newFee.receiptNo} onChange={e=>setNewFee({...newFee,receiptNo:e.target.value})}/>
            <input type="number" placeholder="Amount" value={newFee.amountPaid} onChange={e=>setNewFee({...newFee,amountPaid:e.target.value})}/>
            <button type="submit" className="bg-blue-500 text-white px-3">➕ Add Fee</button>
          </form>
          <table className="w-full border">
            <thead className="bg-gray-100"><tr><th>Name</th><th>Class</th><th>Section</th><th>Month</th><th>Receipt</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {payments.map(p=>(
                <tr key={p._id}><td>{p.student?.name}</td><td>{p.student?.className}</td><td>{p.student?.section}</td><td>{p.month}</td><td>{p.receiptNo}</td><td>₹{p.amountPaid}</td><td>{p.status}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TEACHER PAYMENTS */}
      {view==="teacherPayments"&&(
        <div>
          <form onSubmit={addTeacherPayment} className="mb-3 flex gap-2">
            <select value={newPayment.teacherId} onChange={e=>setNewPayment({...newPayment,teacherId:e.target.value})}><option>Select Teacher</option>{teachers.map(t=><option key={t._id} value={t._id}>{t.name}</option>)}</select>
            <input placeholder="Month" value={newPayment.month} onChange={e=>setNewPayment({...newPayment,month:e.target.value})}/>
            <input type="number" placeholder="Amount" value={newPayment.amount} onChange={e=>setNewPayment({...newPayment,amount:e.target.value})}/>
            <button className="bg-blue-500 text-white px-3">➕ Add Payment</button>
          </form>
          {teachers.map(t=>(
            <div key={t._id} className="mb-3 border p-2 rounded">
              <b>{t.name}</b> <button onClick={()=>loadTeacherPayments(t._id)} className="ml-2 border px-2">Show</button>
              <div className="flex gap-1 mt-2">{monthsAll.map(m=><span key={m} className={`px-2 ${teacherPayments[t._id]?.some(p=>p.month===m&&p.status==="paid")?"bg-green-400":"bg-red-300"}`}>{m}</span>)}</div>
            </div>
          ))}
        </div>
      )}

      {/* EXPENSES */}
      {view==="expenses"&&(
        <div>
          <form onSubmit={addExpense} className="mb-3 flex gap-2">
            <input placeholder="Title" value={newExpense.title} onChange={e=>setNewExpense({...newExpense,title:e.target.value})}/>
            <input type="number" placeholder="Amount" value={newExpense.amount} onChange={e=>setNewExpense({...newExpense,amount:e.target.value})}/>
            <select value={newExpense.category} onChange={e=>setNewExpense({...newExpense,category:e.target.value})}><option value="other">Other</option><option value="salary">Salary</option></select>
            <button className="bg-blue-500 text-white px-3">➕ Add</button>
          </form>
          <ul>{expenses.map(e=><li key={e._id}>{e.title} – ₹{e.amount} ({e.category})</li>)}</ul>
        </div>
      )}

      {/* FEE STRUCTURE */}
      {view==="feeStructure"&&(
        <div>
          <form onSubmit={addFeeStructure} className="mb-3 flex gap-2">
            <input placeholder="Class" value={newStructure.className} onChange={e=>setNewStructure({...newStructure,className:e.target.value})}/>
            <input placeholder="Fee Type" value={newStructure.feeType} onChange={e=>setNewStructure({...newStructure,feeType:e.target.value})}/>
            <input type="number" placeholder="Amount" value={newStructure.amount} onChange={e=>setNewStructure({...newStructure,amount:e.target.value})}/>
            <button className="bg-blue-500 text-white px-3">➕ Add</button>
          </form>
          <ul>{feeStructures.map(s=><li key={s._id}>{s.className} – {s.feeType} – ₹{s.amount}</li>)}</ul>
        </div>
      )}

      {/* TEACHER STRUCTURE */}
      {view==="teacherStructure"&&(
        <div>
          <form onSubmit={addTeacherStructure} className="mb-3 flex gap-2">
            <select value={newTeacherStructure.teacherId} onChange={e=>setNewTeacherStructure({...newTeacherStructure,teacherId:e.target.value})}>
              <option>Select Teacher</option>{teachers.map(t=><option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
            <input type="number" placeholder="Amount" value={newTeacherStructure.amount} onChange={e=>setNewTeacherStructure({...newTeacherStructure,amount:e.target.value})}/>
            <button className="bg-blue-500 text-white px-3">➕ Add</button>
          </form>
          <ul>{teacherStructures.map(s=><li key={s._id}>{s.teacher?.name} – ₹{s.amount} ({s.month})</li>)}</ul>
        </div>
      )}

      {/* OVERALL */}
      {view==="overview"&&(
        <div>
          {overview?<div>
            <p>Total Collected: ₹{overview.totalCollected}</p>
            <p>Total Pending: ₹{overview.totalPending}</p>
            <p>Salaries: ₹{overview.totalSalaries}</p>
            <p>Expenses: ₹{overview.totalExpenses}</p>
            <p>Debit: ₹{overview.debit}</p>
            <p>Balance: ₹{overview.balance}</p>
            <button onClick={()=>exportToExcel([overview],"overview")} className="bg-green-500 text-white px-3">⬇ Export</button>
          </div>:<p>Loading...</p>}
        </div>
      )}
    </div>
  );
}

export default SchoolRecords;
