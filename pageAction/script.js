let pdfUrls;
let epubUrls;
let mobiUrls;

function listenForSelectedFileFormats() {
  const checkboxes = document.querySelectorAll(".file-format input");
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", e => {
      const checkboxes = document.querySelectorAll(".file-format input:checked");

      if (checkboxes.length > 0) {
        document.querySelector(".download-button").style.display = "block";
      } else {
        document.querySelector(".download-button").style.display = "none";
      }
    });
  });
}

function onExecuted(result) {
  console.log("Content script executed");

  listenForSelectedFileFormats();

  document.addEventListener("click", async (e) => {
    function zipFiles(downloadUrls) {
      const jsZip = new JSZip();

      downloadUrls.forEach((url) => {
        const filename = new URL(url).pathname.split("/").pop();
        const format = filename.split(".");

        const promise = fetch(url)
          .then(r => r.blob());
        jsZip.file("books" + "/" + format[1] + "/" + filename, promise);
      });

      return jsZip.generateAsync({type: "blob"});
    }

    if (e.target.classList.contains("download-button")) {
      let downloadUrls = [];

      const pdfCheckbox = document.getElementById("pdf");
      if (pdfCheckbox.checked) {
        downloadUrls = [...downloadUrls, ...pdfUrls];
      }

      const epubCheckbox = document.getElementById("epub");
      if (epubCheckbox) {
        downloadUrls = [...downloadUrls, ...epubUrls];
      }

      const mobiCheckbox = document.getElementById("mobi");
      if (mobiCheckbox.checked) {
        downloadUrls = [...downloadUrls, ...mobiUrls];
      }

      zipFiles(downloadUrls)
        .then(content => {
          saveAs(content, "books.zip");
        });
    }
  });
}

function onError(error) {
  console.error(`Failed to execute content script: ${error}`);
}

browser.tabs.executeScript({file: "/content_script.js"})
.then(onExecuted)
.catch(onError);

function handleMessage(request, sender, sendResponse) {
  if (!request.pdfUrls.length && !request.epubUrls.length && !request.mobiUrls.length) {
    document.querySelector(".download-panel").style.display = "none";
  } else {
    pdfUrls = [...request.pdfUrls];
    epubUrls = [...request.epubUrls];
    mobiUrls = [...request.mobiUrls];
  }

  sendResponse({response: "Download URLs received."});
}

browser.runtime.onMessage.addListener(handleMessage);
