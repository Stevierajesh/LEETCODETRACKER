

let shouldRedirect = false;
redirectToMaintain(shouldRedirect);

function redirectToMaintain(isTrue) {
    if (isTrue) {
        window.location.href = "/maintain.html";
        console.log("Current page:", window.location.pathname);
    }
}