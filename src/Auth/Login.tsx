import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    async function handleSubmit(){
        try {
            const api = await fetch("http://localhost:3002/api/auth/login",{
                method: "POST",
                headers: { "Content-Type":"application/json" },
                body:JSON.stringify({
                    email: email,
                    password: password
                })

            })
            const data = await api.json()

            if(!api.ok){ //!!api.ok means "if the response was NOT successful."
                console.log("Login failed", data.message);
                return
            }

            localStorage.setItem("token", data.token)
            navigate("/dashboard")
        } catch (error) {
            console.log(error);
            
        }
    }

  return (
    <div>
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

        <button onClick={handleSubmit}>Login</button>


    </div>
  )
}

export default Login