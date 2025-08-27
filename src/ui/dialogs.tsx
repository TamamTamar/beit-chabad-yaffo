import Swal from "sweetalert2";
import './dialogs.scss';

export const showSuccessDialog = (title: string, html: string) => {
    return Swal.fire({
        title,
        html,
        position: "center",
        icon: "success",
        showConfirmButton: false,
        width: 400,
        timer: 1500,
        customClass: {
            popup: 'custom-font-size'
        }
    });
};

export const showErrorDialog = (title: string, text: string) => {
    return Swal.fire({
        title,
        text,
        icon: "error",
        position: "center",
        showConfirmButton: false,
        width: 400,
        timer: 2000,
        customClass: {
            popup: 'custom-font-size'
        }
    });
};

export const showConfirmDialog = async (title: string, text: string) => {
    return await Swal.fire({
        title,
        text,
        icon: "warning",
        position: "center",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    });
}

export const showPopup = (title: string, html: string) => {
    return Swal.fire({
        title,
        html: `<button class="close-button" onclick="Swal.close()">×</button>
               ${html}`,
        position: "top-end",
        showConfirmButton: false,
        width: 300,
        customClass: {
            popup: 'custom-font-size swal2-drawer'
        },
        backdrop: false,
        showClass: {
            popup: 'animate__animated animate__slideInRight'
        },
        hideClass: {
            popup: 'animate__animated animate__slideOutRight'
        }
    });
};

const dialogs = { success: showSuccessDialog, error: showErrorDialog, confirm: showConfirmDialog, showPopup };
export default dialogs;
