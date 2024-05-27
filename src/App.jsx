import React, { useState, useEffect } from "react"

function App() {
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [timeEntries, setTimeEntries] = useState([])
  const [totalTime, setTotalTime] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")

  useEffect(() => {
    const tiles = JSON.parse(localStorage.getItem("timeEntries"))

    if (tiles && tiles.length > 0) {
      setTimeEntries(tiles)

      setTotalTime(calculateTotalTime(tiles, selectedMonth))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("timeEntries", JSON.stringify(timeEntries))

    console.log(timeEntries)
  }, [timeEntries])

  const handleCalculateTime = () => {
    if (startDate && startTime && endTime) {
      const startDateTime = new Date(startDate + " " + startTime)
      const endDateTime = new Date(startDate + " " + endTime)

      const timeDifference = Math.abs(endDateTime - startDateTime)
      const hoursDifference = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutesDifference = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      )

      const timeEntry = {
        startDate,
        startTime,
        endTime,
        hoursDifference,
        minutesDifference,
      }

      const newTimeEntries = [...timeEntries, timeEntry].sort((a, b) => {
        const dateA = new Date(a.startDate + " " + a.startTime)
        const dateB = new Date(b.startDate + " " + b.startTime)
        return dateA - dateB
      })

      setTimeEntries(newTimeEntries)
      setTotalTime(calculateTotalTime(newTimeEntries, selectedMonth))

      // Reset input fields
      setStartDate("")
      setStartTime("")
      setEndTime("")
    }
  }

  const calculateTotalTime = (entries, month) => {
    let totalHours = 0
    let totalMinutes = 0

    entries.forEach((entry) => {
      const entryMonth = new Date(entry.startDate).getMonth()
      if (month === "" || entryMonth.toString() === month) {
        totalHours += entry.hoursDifference
        totalMinutes += entry.minutesDifference
      }
    })

    totalHours += Math.floor(totalMinutes / 60)
    totalMinutes %= 60

    return `${totalHours} hours and ${totalMinutes} minutes`
  }

  const handleDeleteEntry = (index) => {
    const updatedEntries = [...timeEntries]
    updatedEntries.splice(index, 1)
    setTimeEntries(updatedEntries)
    setTotalTime(calculateTotalTime(updatedEntries, selectedMonth))
  }

  const handleEditEntry = (index) => {
    const entryToEdit = timeEntries[index]
    setStartDate(entryToEdit.startDate)
    setStartTime(entryToEdit.startTime)
    setEndTime(entryToEdit.endTime)
    handleDeleteEntry(index)
  }

  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value
    setSelectedMonth(selectedMonth)
    setTotalTime(calculateTotalTime(timeEntries, selectedMonth))
  }

  return (
    <div className=" min-h-screen container mx-auto p-4 bg-zinc-900 text-[#dadada]">
      <h1 className="text-3xl font-bold mb-4">Monthly Attendance Hours</h1>
      <div className="flex flex-col gap-8">
        <div>
          <label className="block"> Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-md border text-black bg-slate-300 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-1 mt-1 w-full"
          />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block">In Time:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-md border text-black bg-slate-300 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-1 mt-1 w-full"
            />
          </div>
          <div className="w-1/2">
            <label className="block">Out Time:</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-md border text-black bg-slate-300 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-1 mt-1 w-full"
            />
          </div>
        </div>
        <div>
          <label className="block">Filter by Month:</label>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="rounded-md border text-black bg-slate-300 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-1 mt-1 w-full"
          >
            <option value="">All Months</option>
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
          </select>
        </div>
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 mt-4 rounded"
        onClick={handleCalculateTime}
      >
        Save
      </button>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Time Entries</h2>
        <ul>
          {timeEntries.map((entry, index) => {
            const entryMonth = new Date(entry.startDate).getMonth()
            if (
              selectedMonth === "" ||
              entryMonth.toString() === selectedMonth
            ) {
              return (
                <li
                  key={index}
                  className="border-b border-gray-200 py-4"
                >
                  <div>
                    <strong>Date:</strong> {entry.startDate}
                  </div>
                  <div>
                    <strong>In Time:</strong> {entry.startTime} |{" "}
                    <strong>Out Time:</strong> {entry.endTime}
                  </div>
                  <div>
                    <strong>Hours:</strong> {entry.hoursDifference} hours and{" "}
                    {entry.minutesDifference} minutes
                  </div>
                  <div className="mt-2">
                    <button
                      className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 mr-2 rounded"
                      onClick={() => handleEditEntry(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
                      onClick={() => {
                        const result = confirm("Are you sure to delete?")
                        result ? handleDeleteEntry(index) : ""
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )
            } else {
              return null
            }
          })}
        </ul>
        <h3 className="text-xl font-bold mt-4">
          Total Time for{" "}
          {selectedMonth === ""
            ? "All Months"
            : `Month ${parseInt(selectedMonth) + 1}`}
          :
        </h3>
        <p>{totalTime}</p>
      </div>
    </div>
  )
}

export default App
