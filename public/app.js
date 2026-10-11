const filenameInput = document.getElementById("filename");
const filecontentInput = document.getElementById("content");
const messageInput = document.getElementById("message");


async function createFile() {
    const fileName = filenameInput.value;
    const filecontent = filecontentInput.value;
    console.log(fileName, filecontent);

    const response = await fetch("/api/createFile", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ fileName: fileName, filecontent: filecontent })
    })

    const data = await response.json();
    console.log(data);

    messageInput.textContent = data.message;
    // success message
    messageInput.textContent = "File created successfully";
}

async function getFiles() {
    const response = await fetch("/api/files");
    const data = await response.json();
    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";
    data.files.forEach((file) => {
        const li = document.createElement("li");
        li.onclick = () => openFile(file);
        li.textContent = file;
        fileList.appendChild(li);
    });

}


async function getSystemInfo() {

    const response = await fetch("/api/systemInfo");
    const data = await response.json();

    // const systemInfo = document.getElementById("systemInfo");

    document.getElementById("systemInfo").textContent =
        "OS : " + data.os +
        " | Platform: " + data.platform +
        " | CPU: " + data.cpu +
        " | Cores: " + data.cores +
        " | Total RAM: " + data.totalRAM +
        " | Free RAM: " + data.freeRAM;
}


async function openFile(filename) {
    const output = document.getElementById("fileContent");
    output.textContent = "Loading...";

    try {
        const response = await fetch(
            "/api/readFile?name=" + encodeURIComponent(filename)
        );

        const data = await response.json();

        if (!response.ok) {
            output.textContent = data.message;
            return;
        }

        output.textContent =
            "File Name: " + data.fileName + "\n\n" + data.content;

    } catch (error) {
        console.error(error);
        output.textContent = "File content load nahi ho paya.";
    }
}



