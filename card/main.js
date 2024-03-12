let bool = false;
let b = document.querySelector(".css-1uo2k8e");

function showModal() {
    if (!bool) {
        b.style.display = "flex";
        bool = true;
    } else {
        b.style.display = "none";
        bool = false;
    }
}