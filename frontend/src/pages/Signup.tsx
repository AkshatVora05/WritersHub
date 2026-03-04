import { useState, type ChangeEvent, type FormEvent } from "react"
import type { SignupInput } from "@voraakshat05/writers-hub"
import { AuthHeader } from "../components/AuthHeader"
import { LabelledInput } from "../components/LabelledInput"
import { AuthLink } from "../components/AuthLink"
import { AuthButton } from "../components/AuthButton"
import axios, { AxiosError } from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"
import { Quote } from "../components/Quote"
import { Loading } from "../components/Loading"

export const Signup = () => {
    const [ signupInputs, setSignupInputs ] = useState<SignupInput>({
        email: "",
        password: "",
        name: ""
    });
    const [ loading, setLoading ] = useState(false);

    const navigate = useNavigate();

    async function sendRequest(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, signupInputs);

            toast.success(res.data.message);

            setSignupInputs({
                email: "",
                password: "",
                name: ""
            });

            navigate('/signin');
        }
        catch(err) {
            const axiosError = err as AxiosError<{ message: string }>;

            const errorMessage = axiosError.response?.data?.message || "Signup failed";
            toast.error(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>, key: keyof SignupInput) => {
        setSignupInputs(prev => ({
            ...prev,
            [key]: e.target.value
        }));
    }


    return <>
        {loading && <Loading></Loading>}
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="flex items-center justify-center">
                <div className="flex flex-col justify-center">
                    <div className="text-center">
                        <AuthHeader 
                            text={"Create an account"}
                        />
                    </div>
                    <form onSubmit={sendRequest}>
                        <div className="mt-3 w-85">
                            <LabelledInput label="Email" placeholder="john.doe@example.com" type="email" onChange={(e) => {
                                    handleChange(e, "email");
                                }}
                                required={true}
                            />
                            <LabelledInput label="Password" placeholder="******" type="password" onChange={(e) => {
                                    handleChange(e, "password");
                                }}
                                required={true} 
                            />
                            <LabelledInput label="Full Name" placeholder="John Doe" type="text" onChange={(e) => {
                                    handleChange(e, "name");
                                }} 
                                required={false} 
                            />
                        </div>
                        <div className="pt-2 text-center text-slate-500">
                            <AuthLink text="Already have an account?" link="/signin" linkText="Signin"
                            />
                        </div>
                        <AuthButton text="Signup" type="submit" disabled={loading} />
                    </form>
                </div>
            </div>
            <div className="bg-slate-200 hidden lg:flex items-center justify-center">
                <Quote></Quote>
            </div>
        </div>
    </>
}