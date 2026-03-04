import { useState, type ChangeEvent, type FormEvent } from "react";
import type { SigninInput } from "@voraakshat05/writers-hub";
import { AuthHeader } from "../components/AuthHeader";
import { LabelledInput } from "../components/LabelledInput";
import { AuthLink } from "../components/AuthLink";
import { AuthButton } from "../components/AuthButton";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { Quote } from "../components/Quote";
import { Loading } from "../components/Loading";

export const Signin = () => {
    const [ signinInputs, setSigninInputs ] = useState<SigninInput>({
        email: "",
        password: ""
    });

    const [ loading, setLoading ] = useState(false);

    const navigate = useNavigate();

    async function sendRequest(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, signinInputs);

            const token = res.data.token;
            localStorage.setItem("token", token);
            toast.success(res.data.message);

            setSigninInputs({
                email: "",
                password: ""
            });
            
            navigate('/blogs');
        }
        catch(err) {
            const axiosError = err as AxiosError<{ message: string }>;

            const errorMessage = axiosError.response?.data?.message || "Signin Failed"
            toast.error(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>, key: keyof SigninInput) => {
        setSigninInputs(prev => ({
            ...prev,
            [key]: e.target.value
        }));
    }

    return <>
        {loading && <Loading></Loading>}
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="flex items-center justify-center">
                <div className="flex flex-col justify-center">
                    <form onSubmit={sendRequest}>
                        <div className="text-center">
                            <AuthHeader text={"Login to account"} />
                        </div>
                        <div className="mt-3 w-85">
                            <LabelledInput label="Email" placeholder="john.doe@example.com" type="email"  onChange={(e) => {
                                    handleChange(e, "email");
                                }}
                                required={true}
                            />
                            <LabelledInput label="Password" placeholder="******" type="password" onChange={(e) => {
                                    handleChange(e, "password");
                                }}
                                required={true}
                            />
                        </div>
                        <div className="pt-2 text-center text-slate-500">
                            <AuthLink text="Don't have an account?" link="/signup" linkText="Signup"
                            />
                        </div>
                        <AuthButton text="Signin" type="submit" disabled={loading} />
                    </form>
                </div>
            </div>
            <div className="bg-slate-200 hidden lg:flex items-center justify-center">
                <Quote />
            </div>
        </div>
    </>
}