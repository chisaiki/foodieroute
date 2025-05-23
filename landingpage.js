
function goToMainPage()
{
    console.log("MAIN PAGE");
    window.location.href = "index.html";
}

const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", goToMainPage);