

let shouldRedirect = true;
redirectToMaintain(shouldRedirect);

function redirectToMaintain(isTrue) {
    if (isTrue && !currentPage.includes("maintain.html")) {
        window.location.href = "maintain.html";
    }
}