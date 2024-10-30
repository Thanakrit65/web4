"use client"; 

import { useState, useEffect } from 'react';
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer.jsx";
import DateInputForm from '../components/DateInputForm';
import Linechartsearchform from '../components/Linechartsearchform';
import { useSession } from 'next-auth/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import "../components/dashboard.css";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [searchResult, setSearchResult] = useState([]);
  const [cases, setCases] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("");
  const [showDetails, setShowDetails] = useState(null); // สำหรับ Drill-down
  let displaycase
  let displaydeath

  const handleSearch = async (date) => {
    const response = await fetch('/api/getDataByDate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date })
    });

    const result = await response.json();
    if(result){
      displaycase = result.map(function(data){
        return(<p key = {0}>{data.cases}</p>)
      })
      displaydeath = result.map(function(data){
        return(<h key = {1}>{data.deaths}</h>)
      })
      setCases(displaycase);
      setDeaths(displaydeath);
    }
    else{
      console.log("not found")
    }
  }
  

  const lineSearch = async () => {
    const response = await fetch('/api/getDataForChart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

    });

    const result = await response.json();
    setSearchResult(result);
  };

  // Sorting ฟังก์ชัน
  const sortedData = [...searchResult].sort((a, b) => {
    if (sortBy === "cases") return b.cases - a.cases;
    if (sortBy === "deaths") return b.deaths - a.deaths;
    return new Date(b.date) - new Date(a.date);
  });

  // Filtering ฟังก์ชัน
  const filteredData = sortedData.filter(item => {
    if (!filterBy) return true;
    return item.cases >= filterBy;
  });

  return (
    <main>
      <Container>
        <Navbar session={session} />
        <div className="flex-grow text-center p-10 dashboard">
          <p className="text-3xl mt-1 mb-5">Dashboard</p>

          <DateInputForm onSearch={handleSearch} />

          <div className="container">
            <div className="item zone1">
              <div className="itemzone1">
                <p className="text-2xl mb-10 bg-[#ffa242] text-white p-3 rounded-lg">CASE</p>
                <p className="text-3xl text-black" value ={cases} >{cases}</p>
              </div>
              <div className="itemzone1">
                <p className="text-2xl mb-10 bg-[#dc493f] text-white p-3 rounded-lg">DEATH</p>
                <p className="text-3xl text-black" value ={deaths} >{deaths}</p>
              </div>
              <div className="itemzone1">
                <p className="text-2xl mb-10 bg-[#5d8d73] text-white p-3 rounded-lg">RECOVERED</p>
                <p className="text-3xl text-white">{cases + deaths}</p>
              </div>
            </div>
            <Linechartsearchform onSearch={lineSearch} />

            {/* Zone2: แสดงกราฟเส้น */}
            <div className="item zone2">
              <LineChart width={1000} height={300} data={searchResult}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cases" stroke="#ffa242" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="deaths" stroke="#dc493f" />
              </LineChart>
            </div>

            {/* Zone3: แสดงตารางผลลัพธ์ */}
            <div className="item zone3">
              <div className="itemzone3">
                <h2 className="text-2xl mb-5">Search Results</h2>

                {/* Sort By */}
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="ml-2 p-2 border">
                  <option value="date">Date</option>
                  <option value="cases">Cases</option>
                  <option value="deaths">Deaths</option>
                </select>

                {/* Filter By Cases */}
                <label className="ml-5">Filter Cases &gt;=</label>
                <input
                  type="number"
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="ml-2 p-2 border"
                />

                {/* ตารางข้อมูล */}
                <table className="min-w-full divide-y divide-gray-200 mt-5">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cases</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deaths</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((result, index) => (
                      <tr key = {index}>
                        <td className="px-6 py-4 whitespace-nowrap">{result.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{result.cases}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{result.deaths}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setShowDetails(showDetails === index ? null : index)}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            {showDetails === index ? "Hide Details" : "Show Details"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* แสดงรายละเอียดเพิ่มเติม (Drill-down) */}
                {showDetails !== null && (
                  <div className="p-5 bg-gray-100 rounded mt-5">
                    <h3 className="text-xl font-bold mb-3">Details for {filteredData[showDetails].date}</h3>
                    <p>New Cases: {filteredData[showDetails].new_cases}</p>
                    <p>New Deaths: {filteredData[showDetails].new_deaths}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </Container>
    </main>
  );
}

//export default DashboardPage;
