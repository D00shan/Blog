document.querySelectorAll(".special-link").forEach((link) => {

    const url = new URL(window.location.href);
    const params = url.searchParams;

    const newParamKey = "page";
    const newParamValue = link.dataset.redirect;

    params.set(newParamKey, newParamValue);

    const newUrl = url.origin + url.pathname + "?" + params.toString();

    link.href = newUrl
})