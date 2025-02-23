import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import './EditParasha.scss';

import { useState, useEffect } from "react";
import { getParashaById, updateParasha } from "../../services/parasha-service";
import { ParashaInput } from "../../@Types/chabadType";
import dialogs from "../../ui/dialogs";

const EditParasha = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, setValue, formState: { errors }, control } = useForm<ParashaInput>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "longText"
    });
    const [error, setError] = useState<Error | null>(null);
    const navigate = useNavigate();
    const [image, setImage] = useState<File | null>(null);
    const [imageName, setImageName] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        if (id) {
            getParashaById(id) // Assuming this is fetching the parasha data
                .then(res => {
                    const parasha = res.data;
                    setValue('source', parasha.source);
                    setValue('title', parasha.title);
                    setValue('miniText', parasha.miniText);
                    setValue('alt', parasha.alt || parasha.title);
                    setImageUrl(parasha.image?.url);

                    // Set the longText array
                    setValue('longText', parasha.longText);

                    // If there is an existing image
                    setImageName(parasha.image?.url.split('/').pop() || "");
                })
                .catch(err => setError(err));
        }
    }, [id, setValue]);

    const onSubmit = async (data: ParashaInput) => {
        try {
            if (id) {
                const formData = new FormData();
                formData.append("source", data.source);
                formData.append("title", data.title);
                formData.append("miniText", data.miniText);

                // Add longText
                data.longText.forEach((page, index) => {
                    formData.append(`longText[${index}][title]`, page.title);
                    formData.append(`longText[${index}][text]`, page.text);
                });

                formData.append("alt", data.alt);

                // Check if image is selected
                if (image) {
                    formData.append("image", image);
                } else {
                    // If no new image, keep the URL of the existing image
                    formData.append("imageUrl", imageUrl || "");  // empty string if imageUrl is not available
                }

                await updateParasha(id, formData); // Assuming updateParasha is used to update the parasha
                dialogs.success("הצלחה", "הפרשה עודכנה בהצלחה").then(() => {
                    navigate("/beitChabad/admin");
                });
            }
        } catch (error: any) {
            dialogs.error("שגיאה", error.response?.data?.message || "עדכון הפרשה נכשל");
        }
    };

    if (error) return <div>שגיאה: {error.message}</div>;

    return (
        <div className="edit-parasha-container">
            <h2>עריכת פרשה</h2>
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="parasha-form">
                <section className="input-section">
                    <input className="input-field" placeholder="מקור" {...register("source", { required: "המקור דרוש" })} />
                    {errors.source && <p className="error-message">{errors.source.message}</p>}
                </section>
                <section className="input-section">
                    <input className="input-field" placeholder="כותרת" {...register("title", { required: "הכותרת דרושה" })} />
                    {errors.title && <p className="error-message">{errors.title.message}</p>}
                </section>
                <section className="input-section">
                    <input className="input-field" placeholder="תקציר" {...register("miniText", { required: "התקציר דרוש" })} />
                    {errors.miniText && <p className="error-message">{errors.miniText.message}</p>}
                </section>
                <section>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setImage(file);
                            setImageName(file ? file.name : "");
                        }}
                        className="file-input"
                    />
                    {imageName && <p className="file-name">{imageName}</p>}
                </section>
                <section className="input-section">
                    <input className="input-field" placeholder="תיאור תמונה" {...register("alt", { required: "תיאור התמונה דרוש" })} />
                    {errors.alt && <p className="error-message">{errors.alt.message}</p>}
                </section>

                <section className="pages-section">
                    <h3 className="pages-header">קטעי פרשה:</h3>
                    {fields.map((page, index) => (
                        <div key={page.id} className="parasha-page">
                            <input className="input-field" placeholder="כותרת קטע" {...register(`longText.${index}.title` as const, { required: "כותרת קטע דרושה" })} />
                            <textarea className="textarea-field" placeholder="תוכן קטע" {...register(`longText.${index}.text` as const, { required: "תוכן קטע דרוש" })} />
                            <button type="button" className="remove-text-button" onClick={() => remove(index)}>הסר</button>
                        </div>
                    ))}
                    <button type="button" className="add-text-button" onClick={() => append({ title: "", text: "" })}>הוסף קטע</button>
                </section>

                <button type="submit" className="submit-button">שמור</button>
            </form>
        </div>
    );
};

export default EditParasha;
