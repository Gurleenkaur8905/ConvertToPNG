import './App.css';
import { useState } from 'react';
function App() {

  const [showDropdown, setShowDropdown] = useState(false);
  const setDropdown = () => setShowDropdown(!showDropdown);
  const [selectedImg, setselectedImg] = useState("");
  const [inputMethod, setinputMethod] = useState("file");

  const JPG_to_PNG_converter = (() => {
    function converter(imageFileBlob, options) {
      options = options || {}

      //* Creating a canvas element and then putting the image (jpg) there
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      const imageElement = createImage()
      const downloadLink = document.createElement("a")

      //* Here we create our image blob
      function createImage(options) {
        options = options || {}
        const img = document.createElement("img")

        img.style.width = options.width ? `${options.width}px` : "auto"
        img.style.height = options.height ? `${options.height}px` : "auto"

        return img
      }

      function updateDownloadLink(jpgFileName, pngBlob) {
        const linkElement = downloadLink
        const pngFileName = jpgFileName.replace(/jp?g/i, "png")

        linkElement.setAttribute("download", pngFileName)
        linkElement.href = URL.createObjectURL(pngBlob)

        document.body.appendChild(linkElement); // Append the link to the document body
        linkElement.click()
        document.body.removeChild(linkElement); // Remove the link from the document body after download
      }

      function process() {
        const imageUrl = URL.createObjectURL(imageFileBlob)

        imageElement.addEventListener("load", e => {
          canvas.width = e.target.width
          canvas.height = e.target.height
          context.drawImage(e.target, 0, 0, e.target.width, e.target.height)
          canvas.toBlob(
            updateDownloadLink.bind(window, imageFileBlob.name),
            "image/png"
          )
        })

        imageElement.src = imageUrl
      }

      return {
        process: process,
      }
    }

    return converter
  })()

  const onFileChange = (event) => {
    const fileNameSpan = document.getElementById('span');
    const selectedFile = event.target.files[0];

    if (fileNameSpan && selectedFile) {
      fileNameSpan.innerHTML = selectedFile.name;
      setselectedImg(selectedFile);
      // Check if the selected file is a JPEG image
      if (selectedFile.type.match(/image\/jpg/i) !== null || selectedFile.type.match(/image\/jpeg/i) !== null) {

      } else {
        alert('Please select a valid JPEG image file.');
      }
    } else {
      console.error('File input element or span element not found.');
    }
  };
  const ImageDownloader = (imageUrl) => {
    const fileName = "image.png";
    //const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        JPG_to_PNG_converter(blob).process();
        // Create a blob URL for the image
        const url = window.URL.createObjectURL(blob);
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        // Simulate a click on the link
        document.body.appendChild(link);
        link.click();
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch(error => console.error('Error downloading image:', error));
  }


  const convertURLToPNGAndDownload = (imageUrl) => {
    //const fileName = "image.png";
    ImageDownloader(imageUrl);
    // fetch(imageUrl)
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch image');
    //     }
    //     return response.blob();
    //   })
    //   .then((blob) => {

    //     const temporaryLink = document.createElement("a");
    //     temporaryLink.href = URL.createObjectURL(blob);
    //     temporaryLink.download = fileName;
    //     temporaryLink.style.display = "none";
    //     document.body.appendChild(temporaryLink);
    //     temporaryLink.click();
    //     URL.revokeObjectURL(temporaryLink.href);
    //     setTimeout(() => {
    //       document.body.removeChild(temporaryLink);
    //     }, 100);
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching or converting image:', error);
    //     alert('Error fetching or converting image. Please try again.');
    //   });
  };
  const downloadImg = () => {
    // Call the converter to process the file
    if (inputMethod === "file") {
      JPG_to_PNG_converter(selectedImg).process();
    }
    else if (inputMethod === "url") {
      convertURLToPNGAndDownload(selectedImg);
    }

  }

  const showUrlInput = () => {
    console.log("selected url");
    setinputMethod("url");
  }
  // const showDriveStorage = () => {
  //   console.log("From google derive");
  // }
  const showDeviceStorage = () => {
    setinputMethod("file");
  }

  //handle url input text field change 
  const handleUrlInputChange = (event) => {
    setselectedImg(event.target.value);
  }

  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <h4>
              <a href="/">JPEG/JPG TO PNG</a>
            </h4>
          </li>
          <li id="github">
            <a href="https://github.com/Gurleenkaur8905"><i className="fa fa-github" style={{ fontSize: "30px", color: "black" }}></i></a>
          </li>
        </ul>
      </nav>
      <main className="App-header">
        <div className="inner">
          <h1>ConvertToPNG</h1>
          <div id="span"></div>
          <form method="post" encype="multipart/form-data">
            {inputMethod === "file" && (<>

              <label id="lable_file" htmlFor="file">Choose File</label>
              <input type="file" name="file" onChange={onFileChange} id="file" />
            </>)}
            {inputMethod === "url" && (
              <>
                <label htmlFor="urlInput"></label>
                <input type="text" name="url" id="urlInput" placeholder="Enter URL here..." onChange={handleUrlInputChange} />
              </>
            )}
            <span id="select" onClick={setDropdown}><i className="fa fa-angle-down"></i> </span>
            {showDropdown && <ul id="dropdown" className="show">
              <li onClick={showDeviceStorage}>
                <span >From Device</span>
              </li>
              {/* <li onClick={showDriveStorage}> 
                <span>From Google Drive</span>
              </li>*/}
              <li onClick={showUrlInput}>
                <span >From Url</span>
              </li>
            </ul>}

          </form>

          {/* <a href="/convert"> */}
          <button onClick={downloadImg}>Convert Now </button>
          {/* </a> */}
        </div>
      </main>
    </div>
  );
}

export default App;
