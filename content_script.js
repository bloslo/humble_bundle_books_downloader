(function () {
  const pdfAnchorTags = document.querySelectorAll("a[href*='.pdf']");
  const pdfDownloadUrls = [...pdfAnchorTags].map((tag) => tag.href);

  const epubAnchorTags = document.querySelectorAll("a[href*='.epub']");
  const epubDownloadUrls = [...epubAnchorTags].map(tag => tag.href);

  const mobiAnchorTags = document.querySelectorAll("a[href*='.mobi']");
  const mobiDownloadUrls = [...mobiAnchorTags].map(tag => tag.href);

  browser.runtime.sendMessage({
    pdfUrls: pdfDownloadUrls,
    epubUrls: epubDownloadUrls,
    mobiUrls: mobiDownloadUrls,
  })
  .then(handleResponse, handleError);

  function handleResponse(message) {
    console.log(message.response);
  }

  function handleError(error) {
    console.error(`Error: ${error}`);
  }
})();
