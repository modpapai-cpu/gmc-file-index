// ===========================
// GMC FILE INDEX PRO
// Version : 1.0
// ===========================

const DATA_URL = "https://pastebin.com/raw/5V47LyDN";

let fileData = [];

fetch(DATA_URL)
  .then(response => response.json())
  .then(data => {
      fileData = data;
  })
  .catch(error => {
      console.error("Database Load Error:", error);
  });


const searchInput = document.getElementById("searchInput");

const fileNo = document.getElementById("fileNo");

const fileName = document.getElementById("fileName");

const resultList = document.getElementById("resultList");

const clearBtn = document.getElementById("clearBtn");

searchInput.addEventListener("input", searchFiles);

clearBtn.addEventListener("click", clearSearch);

// =========================

function searchFiles(){

    const keyword = searchInput.value
        .trim()
        .toLowerCase();

    if(keyword===""){

        fileNo.textContent="-";

        fileName.textContent="Search a file...";

        resultList.innerHTML="<p class='empty'>Start typing to search...</p>";

        return;

    }

    let matches = fileData.filter(file=>{

        return file.name.toLowerCase().includes(keyword)

        ||

        file.no.toString().includes(keyword);

    });

    displayResults(matches);

}

// =========================

function displayResults(matches){

    resultList.innerHTML="";

    if(matches.length===0){

        fileNo.textContent="-";

        fileName.textContent="Not Found";

        resultList.innerHTML="<p class='empty'>No matching file found.</p>";

        return;

    }

    // First Match

    fileNo.textContent=matches[0].no;

    fileName.textContent=matches[0].name;

    // List

    matches.forEach(file=>{

        const div=document.createElement("div");

        div.className="result";

        div.innerHTML=`

            <div>

                <strong>${file.no}</strong>

            </div>

            <div>

                ${file.name}

            </div>

        `;

        div.addEventListener("click",()=>{

            fileNo.textContent=file.no;

            fileName.textContent=file.name;

        });

        resultList.appendChild(div);

    });

}

// =========================

function clearSearch(){

    searchInput.value="";

    fileNo.textContent="-";

    fileName.textContent="Search a file...";

    resultList.innerHTML="<p class='empty'>Start typing to search...</p>";

    searchInput.focus();

}

// =========================

// Ctrl + F

document.addEventListener("keydown",e=>{

    if(e.ctrlKey && e.key==="f"){

        e.preventDefault();

        searchInput.focus();

    }

});

// ESC

document.addEventListener("keydown",e=>{

    if(e.key==="Escape"){

        clearSearch();

    }

});
