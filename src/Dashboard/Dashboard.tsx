// import { useEffect, useState } from 'react'

// type Task = {
//     id: string,
//     task: string,
//     taskStatus: boolean,
//     createdAt: string,
//     userId: string
// }
// const Dashboard = () => {

//     const [tasks, setTasks] = useState<Task[]>([])

    

//     useEffect(()=>{

//         const token = localStorage.getItem("token") as string

//         const fetchTask = async() =>{
//             const api = await fetch("http://localhost:3002/api/tasks",{
//                 method: "GET",
//                 headers: { "Authorization": `Bearer ${token}` },
//             })
//             if(!api.ok){
//                 console.log("can't fetch the tasks rn");
//                 return
//             }
//             const data = await api.json()
//             setTasks(data)
//         }
        
//         fetchTask() 
//     },[])
    

//   return (
//     <div>
//         {tasks.map((task)=>(
//             <div key={task.id}>
//                 {task.task}

//                 <input type="checkbox" 
//                 checked= {task.taskStatus}
//                 readOnly
//                 />

//                 <button>Delete</button>
//             </div>
            
//         ))}


//     </div>
//   )
// }

// export default Dashboard

import { useEffect, useState } from 'react'

type Task = {
    id: string
    task: string
    taskStatus: boolean
    createdAt: string
    userId: string
}

const Dashboard = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTasks, setNewTasks] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token") as string

        const fetchTask = async () => {
            try {
                const api = await fetch("http://localhost:3002/api/tasks", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                })
                if (!api.ok) {
                    setErrorMsg("Couldn't load tasks. Try refreshing.")
                    return
                }
                const data = await api.json()
                setTasks(data)
            } catch {
                setErrorMsg("Couldn't reach the server.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchTask()
    }, [])

    const toggleTask = async (taskId: string, currentStatus: boolean) => {
        const token = localStorage.getItem("token")

        // optimistic update — flip immediately, revert on failure
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, taskStatus: !t.taskStatus } : t))

        const api = await fetch(`http://localhost:3002/api/tasks/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ taskStatus: !currentStatus })
        })

        if (!api.ok) {
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, taskStatus: currentStatus } : t))
            setErrorMsg("Couldn't update that task.")
        }
    }

    const deleteTask = async (taskId: string) => {
        const token = localStorage.getItem("token")
        const api = await fetch(`http://localhost:3002/api/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        if (!api.ok) {
            setErrorMsg("Couldn't delete that task.")
            return
        }
        setTasks(prev => prev.filter(t => t.id !== taskId))
    }

    const addTask = async () => {
        if (!newTasks.trim()) return
        const token = localStorage.getItem("token") as string
        const api = await fetch(`http://localhost:3002/api/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ task: newTasks })
        })
        if (!api.ok) {
            setErrorMsg("Couldn't add that task.")
            return
        }
        const data = await api.json()
        setTasks(prev => [...prev, data])
        setNewTasks("")
    }

    const pending = tasks.filter(t => !t.taskStatus)
    const done = tasks.filter(t => t.taskStatus)
    const ordered = [...pending, ...done]

    return (
        <div className="min-h-screen bg-[#0F0F11] text-[#EDEAE4] px-6 py-16 font-[Inter]">
            <div className="max-w-xl mx-auto">

                {/* Header */}
                <div className="flex items-baseline justify-between mb-10">
                    <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
                    <span className="font-mono text-xs text-[#7A766E]">
                        {pending.length} open · {done.length} done
                    </span>
                </div>

                {/* Error banner */}
                {errorMsg && (
                    <div className="mb-6 flex items-center justify-between rounded-md border border-[#C75450]/30 bg-[#C75450]/10 px-4 py-2.5 text-sm text-[#E08B87]">
                        <span>{errorMsg}</span>
                        <button onClick={() => setErrorMsg("")} className="text-[#E08B87]/60 hover:text-[#E08B87]">✕</button>
                    </div>
                )}

                {/* Add task */}
                <div className="flex gap-2 mb-10">
                    <input
                        type="text"
                        value={newTasks}
                        onChange={(e) => setNewTasks(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTask()}
                        placeholder="Add a task and press Enter"
                        className="flex-1 bg-transparent border-b border-[#2A2A2E] focus:border-[#E8A33D] outline-none py-2 text-[15px] placeholder-[#5C5950] transition-colors"
                    />
                    <button
                        onClick={addTask}
                        disabled={!newTasks.trim()}
                        className="px-4 text-sm font-medium text-[#0F0F11] bg-[#E8A33D] rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F0B158] transition-colors"
                    >
                        Add
                    </button>
                </div>

                {/* Loading skeleton */}
                {isLoading && (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-11 rounded-md bg-[#18181B] animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && tasks.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-[#5C5950] text-sm">Nothing here yet — add your first task above.</p>
                    </div>
                )}

                {/* Task list */}
                <ul className="space-y-1">
                    {ordered.map((task) => (
                        <li
                            key={task.id}
                            className="group flex items-center gap-3 px-2 py-3 rounded-md hover:bg-[#18181B] transition-colors"
                        >
                            <button
                                onClick={() => toggleTask(task.id, task.taskStatus)}
                                aria-label={task.taskStatus ? "Mark as not done" : "Mark as done"}
                                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                                    ${task.taskStatus
                                        ? "bg-[#5FA776] border-[#5FA776] scale-95"
                                        : "border-[#3A3A3E] hover:border-[#E8A33D]"}`}
                            >
                                {task.taskStatus && (
                                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8.5L6.5 12L13 4" stroke="#0F0F11" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>

                            <span
                                className={`flex-1 text-[15px] transition-all duration-200
                                    ${task.taskStatus ? "text-[#5C5950] line-through" : "text-[#EDEAE4]"}`}
                            >
                                {task.task}
                            </span>

                            <button
                                onClick={() => deleteTask(task.id)}
                                aria-label="Delete task"
                                className="opacity-0 group-hover:opacity-100 text-[#5C5950] hover:text-[#C75450] transition-opacity text-sm px-1"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Dashboard