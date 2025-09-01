import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import dialogs from "../ui/dialogs";
import "./Login.scss";
import patterns from "../validations/patterns";
import { useAuth } from "../hooks/useAuth";
import { ILogin } from "../@Types/types";

const Login: FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ILogin>({ mode: "onSubmit" });

    const onLogin: SubmitHandler<ILogin> = async (data) => {
        console.log("Login submitted with:", data);
        try {
            await login(data.email, data.password);
            console.log("Login success");
            await dialogs.success("Login", "Logged in");
            console.log("Navigating to home");
            navigate("/");
        } catch (e: any) {
            console.error("Login error:", e);
            dialogs.error(
                "Login Error",
                e?.response?.data?.message || e?.message || "Unknown error"
            );
        }
    };

    const onError = (errs: any) => {
        console.log("RHF errors:", errs);
        const first = Object.values(errs)[0] as any;
        dialogs.error("Validation", first?.message ?? "Invalid input");
    };

    return (
        <div className="create-card-container bg-[#3c2a1d] text-white dark:bg-slate-600">
            <form noValidate onSubmit={handleSubmit(onLogin, onError)}>
                {/* email */}
                <section>
                    <input
                        {...register("email", {
                            required: "This field is mandatory",
                            pattern: patterns.email,
                        })}
                    />
                    {errors.email && <p>{errors.email.message}</p>}
                </section>

                {/* password */}
                <section>
                    <input
                        {...register("password", {
                            required: "This field is mandatory",
                            pattern: patterns.password,
                        })}
                    />
                    {errors.password && <p>{String(errors.password.message)}</p>}
                </section>

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>

                <div className="relative flex items-center mt-8">
                    <div className="border h-0 w-2/4 border-stone-300"></div>
                    <div className="text-stone-300 px-4 text-sm font-normal">OR</div>
                    <div className="border h-0 w-2/4 border-stone-300"></div>
                </div>

                <Link
                    to="/register"
                    className="border border-[#3c2a1d] rounded-lg text-center text-[#3c2a1d] bg-white text-base font-semibold w-full py-3 mt-9 dark:hover:bg-slate-200 hover:bg-[#967d68] hover:text-white"
                >
                    Signup now
                </Link>
            </form>
        </div>
    );
};

export default Login;
