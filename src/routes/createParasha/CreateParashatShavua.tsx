import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IParashaInput } from "../../@Types/productType";
import { createNewParasha } from "../../services/parasha-service";
import dialogs from "../../ui/dialogs";
import { useAuth } from "../../hooks/useAuth";
import CandleLightingTimes from "../../components/CandleLightingTimes/CandleLightingTimes";
import { useState } from "react";

const CreateParasha = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, control } = useForm<IParashaInput>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "components"
    });
    const [image, setImage] = useState<File | null>(null);
    const [imageName, setImageName] = useState<string>("");

    const onSubmit = async (data: IParashaInput) => {
        if (!token) {
            dialogs.error("Error", "No authentication token found.");
            return;
        }

        const formData = new FormData();
        formData.append("title", data.title);

        // הוספת רכיבי Parasha (כמו טקסט, כותרת וכו')
        data.components.forEach((component, index) => {
            formData.append(`components[${index}][type]`, component.type);
            formData.append(`components[${index}][content]`, component.content);

            // אם יש רכיב תמונה - הוסף אותו ל-FormData
            if (image) {
                formData.append("image", image);
            }
        });

        try {
            await createNewParasha(formData);
            dialogs.success("Success", "Parasha Created Successfully")
                .then(() => {
                    navigate("/parasha");
                });
        } catch (error: any) {
            dialogs.error("Error", error.response?.data?.message || "Failed to create Parasha");
        }
    };

    return (
        <div className="create-parasha-container bg-[#ffffff] text-gray-800 dark:bg-slate-600">
            <h2 className="dark:text-white">Create New Parasha</h2>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <section>
                    <input placeholder="Title" {...register("title", { required: "Title is required" })} />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                </section>

                <section>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setImage(file);
                            setImageName(file ? file.name : "");
                        }}
                    />
                    {imageName && <p className="file-name">{imageName}</p>}
                </section>

                <section>
                    <h3 className="mb-2">Components:</h3>
                    {fields.map((component, index) => (
                        <div key={component.id} className="component">
                            <select {...register(`components.${index}.type` as const, { required: "Component type is required" })}>
                                <option value="banner">Banner</option>
                                <option value="image">Image</option>
                                <option value="title">Title</option>
                                <option value="text">Text</option>
                            </select>
                            <input placeholder="Content" {...register(`components.${index}.content` as const, { required: "Content is required" })} />

                            {/* העלאת תמונה עבור רכיב מסוג image */}
                            {component.type === "image" && (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setImage(file);
                                            setImageName(file ? file.name : "");
                                        }}
                                    />
                                    <input
                                        placeholder="Image Description"
                                        {...register(`components.${index}.alt` as const, { required: "Image description is required" })}
                                    />
                                </>
                            )}

                            <button type="button" className="removeButton" onClick={() => remove(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="add-component-button" onClick={() => append({ type: "text", content: "" })}>Add Component</button>
                </section>

                <button type="submit" className="submit-button bg-slate-600 text-white dark:bg-slate-900">Create Parasha</button>
            </form>
        </div>
    );
};

export default CreateParasha;
