import { useState } from "react"
import { useNavigate } from "react-router-dom"

const SignUp = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    async function handleSubmit(){
        try {
            const api = await fetch("http://localhost:3002/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify({
                    name: name,
                    email: email, 
                    password: password
                })
            })

            const data = await api.json()

            if(!api.ok){
                console.log("Signup failed", data.message);
                return
                
            }
            localStorage.setItem("token", data.token)
            navigate("/dashboard")

        } catch(error){
            console.log("This is the error",error);
            
        }
    }

  return (
    <div>
        <input 
            type="text" 
            placeholder="Name" 
            value={name}
            onChange={(e)=>{
                setName(e.target.value)
            }}
        /> 

        <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e)=>{
                setEmail(e.target.value)
            }}
        />

        <input 
            type="password" 
            placeholder="password" 
            value={password}
            onChange={(e)=>{
                setPassword(e.target.value)
            }}
        />

        <button onClick={handleSubmit}>SignIn</button>


    </div>
  )
}

export default SignUp