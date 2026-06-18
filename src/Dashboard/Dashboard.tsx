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
    id: string,
    task: string,
    taskStatus: boolean,
    createdAt: string,
    userId: string
}

const Dashboard = () => {
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        const token = localStorage.getItem("token") as string

        const fetchTask = async() => {
            const api = await fetch("http://localhost:3002/api/tasks", {
                method: "GET",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type":"application/json"
            },
            })
            if(!api.ok) {
                console.log("can't fetch the tasks rn");
                return
            }
            const data = await api.json()
            setTasks(data)
        }
        
        fetchTask() 
    }, [])


    const toggleTask = async (  
                taskId: string,
                currentStatus: boolean 
            ) =>{

                const token = localStorage.getItem("token")
        const api = await fetch(`http://localhost:3002/api/tasks/${taskId}`,{
            method: "PUT",
            headers: {
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            },
            body:JSON.stringify({
                taskStatus: !currentStatus
            })
        }
    )

    if(!api.ok){
        console.log("Cant toggle the state");
        return   
    }
    // const data = await api.json()
    setTasks((prevTasks)=>
    prevTasks.map(t=> t.id === taskId ? {...t, taskStatus: !t.taskStatus}
        :t)
    )

    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Tasks</h1>
                
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div 
                            key={task.id} 
                            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <input 
                                    type="checkbox" 
                                    checked={task.taskStatus}
                                    onChange={()=>toggleTask(task.id, task.taskStatus)}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className={`text-gray-700 font-medium ${task.taskStatus ? 'line-through text-gray-400' : ''}`}>
                                    {task.task}
                                </span>
                            </div>
                            
                            <button 
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {tasks.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        No tasks available
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard