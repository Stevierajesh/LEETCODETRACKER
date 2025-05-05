

let shouldRedirect = true;
redirectToMaintain(shouldRedirect);

function redirectToMaintain(isTrue) {
    if (isTrue) {
        window.location.href = "maintain.html";
    }
}