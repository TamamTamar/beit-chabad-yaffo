import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import dialogs from "../../ui/dialogs";
import { Parasha } from "../../@Types/chabadType";
import { createNewParasha } from "../../services/parasha-service";
import './createNewParasha.scss';

const CreateNewParasha = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, control } = useForm<Parasha>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "longText"
    });
    const [image, setImage] = useState<File | null>(null);
    const [imageName, setImageName] = useState<string>("");

    const onSubmit = async (data: Parasha) => {
        if (!image) {
            dialogs.error("שגיאה", "אנא בחר תמונה.");
            return;
        }

        if (!data.longText.length) {
            dialogs.error("שגיאה", "אנא הוסף לפחות קטע פרשה אחד.");
            return;
        }

        const formData = new FormData();
        formData.append("source", data.source);
        formData.append("title", data.title);
        formData.append("miniText", data.miniText);
        formData.append("alt", data.alt);

        data.longText.forEach((page, index) => {
            formData.append(`longText[${index}][title]`, page.title);
            formData.append(`longText[${index}][text]`, page.text);
        });

        if (image) {
            formData.append("image", image);
        }

        try {
            console.log("נתוני הטופס:", Object.fromEntries(formData.entries())); // לוג לפני שליחה
            await createNewParasha(formData);
            dialogs.success("הצלחה", "הפרשה נוצרה בהצלחה")
                .then(() => {
                    navigate("/beitChabad/admin");
                });
        } catch (error: any) {
            console.error("שגיאה בנתוני הטופס:", error);
            dialogs.error("שגיאה", error.response?.data?.message || "לא הצלחנו ליצור את הפרשה");
        }
    };

    return (
        <div className="create-parasha-container">
            <h2 className="create-parasha-title">יצירת פרשה חדשה</h2>
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="form-container">
                <section className="parasha-section">
                    <input
                        className="parasha-input"
                        placeholder="מקור"
                        {...register("source", { required: "המקור הוא שדה חובה" })}
                    />
                    {errors.source && <p className="errorMessage">{errors.source.message}</p>}
                </section>
                <section className="parasha-section">
                    <input
                        className="parasha-input"
                        placeholder="כותרת"
                        {...register("title", { required: "הכותרת היא שדה חובה" })}
                    />
                    {errors.title && <p className="errorMessage">{errors.title.message}</p>}
                </section>
                <section className="parasha-section">
                    <textarea
                        className="parasha-textarea"
                        placeholder="תיאור קצר"
                        {...register("miniText", { required: "תיאור קצר הוא שדה חובה" })}
                    />
                    {errors.miniText && <p className="errorMessage">{errors.miniText.message}</p>}
                </section>

                <section className="parasha-section">
                    <input
                        className="parasha-input-file"
                        type="file"
                        accept="image/*"
                        id="file-input"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setImage(file);
                            setImageName(file ? file.name : "");
                        }}
                    />
                    {imageName && <p className="parasha-file-name">{imageName}</p>}
                </section>

                <section className="parasha-section">
                    <input
                        className="parasha-input"
                        placeholder="תיאור התמונה"
                        {...register("alt", { required: "תיאור התמונה הוא שדה חובה" })}
                    />
                    {errors.alt && <p className="errorMessage">{errors.alt.message}</p>}
                </section>

                <section className="parasha-section">
                    <h3 className="parasha-section-title">קטעי פרשה:</h3>
                    {fields.map((page, index) => (
                        <div key={page.id} className="variant">
                            <input
                                className="parasha-input"
                                placeholder="כותרת הקטע"
                                {...register(`longText.${index}.title` as const)} // הסר את 'required'
                            />
                            <textarea
                                className="parasha-textarea"
                                placeholder="תוכן הקטע"
                                {...register(`longText.${index}.text` as const, { required: "תוכן הקטע הוא שדה חובה" })}
                            />
                            <button
                                type="button"
                                className="remove-parasha-button"
                                onClick={() => remove(index)}
                            >
                                הסרת קטע
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="add-parasha-button"
                        onClick={() => append({ title: "", text: "" })}
                    >
                        הוסף קטע
                    </button>
                </section>

                <button type="submit" className="create-parasha-button">צור פרשה</button>
            </form>
        </div>
    );
};

export default CreateNewParasha;
