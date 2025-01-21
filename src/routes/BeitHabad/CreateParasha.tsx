/* import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import dialogs from "../../ui/dialogs";
import { Parasha } from "../../@Types/chabadType";
import { createNewParasha } from "../../services/parasha-service";

const CreateParasha = () => {
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
            dialogs.error("Error", "Please select an image.");
            return;
        }

        if (!data.longText.length) {
            dialogs.error("Error", "Please add at least one Parasha page.");
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
            console.log("Form Data:", Object.fromEntries(formData.entries())); // לוג לפני שליחה
            await createNewParasha(formData);
            dialogs.success("Success", "Parasha Created Successfully")
                .then(() => {
                    navigate("/beitChabad/parasha");
                });
        } catch (error: any) {
            console.error("Form Data Error:", error);
            dialogs.error("Error", error.response?.data?.message || "Failed to create Parasha");
        }
    };

    return (
        <div className="create-card-container bg-[#ffffff] text-gray-800 dark:bg-slate-600">
            <h2 className="dark:text-white">Create New Parasha</h2>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <section>
                    <input placeholder="source" {...register("source", { required: "source is required" })} />
                    {errors.source && <p className="text-red-500">{errors.source.message}</p>}
                </section>
                <section>
                    <input placeholder="Title" {...register("title", { required: "Title is required" })} />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                </section>
                <section>
                    <textarea placeholder="Mini Text" {...register("miniText", { required: "Mini Text is required" })} />
                    {errors.miniText && <p className="text-red-500">{errors.miniText.message}</p>}
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
                    <input placeholder="Image Description" {...register("alt", { required: "Image description is required" })} />
                    {errors.alt && <p className="text-red-500">{errors.alt.message}</p>}
                </section>

                <section>
                    <h3 className="mb-2">Parasha Pages:</h3>
                    {fields.map((page, index) => (
                        <div key={page.id} className="variant">
                            <input placeholder="Page Title" {...register(`longText.${index}.title` as const, { required: "Page title is required" })} />
                            <textarea placeholder="Page Text" {...register(`longText.${index}.text` as const, { required: "Page text is required" })} />
                            <button type="button" className="removeButton" onClick={() => remove(index)}>Remove Page</button>
                        </div>
                    ))}
                    <button type="button" className="add-variant-button" onClick={() => append({ title: "", text: "" })}>Add Page</button>
                </section>
                <button type="submit" className="submit-button bg-slate-600 text-white dark:bg-slate-900">Create Parasha</button>
            </form>
        </div>
    );
};

export default CreateParasha;
 */