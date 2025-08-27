import { useForm } from "react-hook-form";
import { RishumShabbatInput } from "../../@Types/chabadType";

const ShabbatFormStep2 = ({ selectedShabbat, setStep, setPersonalData }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstname: "",
            lastname: "",
            phone: "",
            mail: "",
        }
    });

    const onSubmit = (data: RishumShabbatInput) => {
        setPersonalData(data);
        setStep(3);
    };

    return (
        <div className="shabbat-form">
            <h2 className="shabbat-form-title">
                רישום לשבת - {selectedShabbat?.parasha} ({selectedShabbat?.date})
            </h2>

            <form className="shabbat-form-fields" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label className="form-label" htmlFor="firstname">שם פרטי:</label>
                    <input
                        className="form-input"
                        id="firstname"
                        type="text"
                        {...register("firstname", { required: "נא להזין שם פרטי" })}
                        placeholder="הכנס שם פרטי"
                    />
                    {errors.firstname && <span className="error">{errors.firstname.message}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="lastname">שם משפחה:</label>
                    <input
                        className="form-input"
                        id="lastname"
                        type="text"
                        {...register("lastname", { required: "נא להזין שם משפחה" })}
                        placeholder="הכנס שם משפחה"
                    />
                    {errors.lastname && <span className="error">{errors.lastname.message}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="phone">טלפון:</label>
                    <input
                        className="form-input"
                        id="phone"
                        type="text"
                        {...register("phone", {
                            required: "נא להזין מספר טלפון",
                            pattern: {
                                value: /^[0-9]{9,10}$/,
                                message: "נא להזין מספר טלפון תקין",
                            },
                        })}
                        placeholder="הכנס מספר טלפון"
                    />
                    {errors.phone && <span className="error">{errors.phone.message}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="mail">אימייל:</label>
                    <input
                        className="form-input"
                        id="mail"
                        type="email"
                        {...register("mail", {
                            required: "נא להזין כתובת אימייל",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "נא להזין כתובת אימייל תקינה",
                            },
                        })}
                        placeholder="הכנס כתובת אימייל"
                    />
                    {errors.mail && <span className="error">{errors.mail.message}</span>}
                </div>

                <div className="form-actions">
                    <button className="back-btn" type="button" onClick={() => setStep(1)}>חזור</button>
                    <button className="next-btn" type="submit">המשך</button>
                </div>
            </form>
        </div>
    );
};

export default ShabbatFormStep2;