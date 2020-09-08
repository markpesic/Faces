const openNewPost = (e) => {
	document.querySelector(".form-newpost").classList.toggle("open");
	console.log("open");
};
document.querySelector("#newpost").setAttribute("onclick", "openNewPost()");
