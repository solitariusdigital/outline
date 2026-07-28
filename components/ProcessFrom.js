import { Fragment, useContext, useState } from "react";
import { StateContext } from "@/context/stateContext";
import { useRouter } from "next/router";
import classes from "./ProcessFrom.module.scss";
import Image from "next/legacy/image";
import CloseIcon from "@mui/icons-material/Close";
import loaderImage from "@/assets/loader.png";
import {
  areAllStatesValid,
  extractParagraphs,
  fourGenerator,
  sixGenerator,
  uploadMedia,
  toFarsiNumber,
  isValidDateFormat,
} from "@/services/utility";

export default function ProcessFrom() {
  const [imagesPreview, setImagesPreview] = useState([]);
  const [uploadImages, setUploadImages] = useState([]);
  const [alert, setAlert] = useState("");
  const [loader, setLoader] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const sourceLink = "https://bucket.outlinecommunity.com";
  const router = useRouter();

  const removeImageInputFile = () => {
    const input = document.getElementById("inputImage");
    input.value = null;
  };

  const handleImageChange = (event) => {
    const array = Array.from(event.target.files);
    setUploadImages(array);
    setImagesPreview(
      array.map((item) => ({
        file: item,
        link: URL.createObjectURL(item),
      })),
    );
  };

  const handleSubmit = async () => {
    if (imagesPreview.length === 0) {
      showAlert("انتخاب عکس یا ویدئو");
      return;
    }

    setLoader(true);
    setDisableButton(true);

    let mediaLinks = [];
    const mediaFolder = "process";
    const processId = `prc${sixGenerator()}`;

    if (imagesPreview.length > 0) {
      const imageFormat = ".jpg";
      for (const media of uploadImages) {
        const mediaId = `img${fourGenerator()}`;
        const mediaLink = `${sourceLink}/${mediaFolder}/${processId}/${mediaId}${imageFormat}`;
        await uploadMedia(media, mediaId, mediaFolder, processId, imageFormat);
        mediaLinks.push({
          link: mediaLink,
          type: "image",
          active: true,
        });
      }
    }

    console.log(mediaLinks);

    // showAlert("ذخیره شد");
    // router.reload(router.asPath);
  };

  return (
    <div>
      <div className={classes.formAction}>
        <div className={classes.mediaContainer}>
          <div className={classes.media}>
            <label className="file">
              <input
                onChange={handleImageChange}
                id="inputImage"
                type="file"
                accept="image/*"
                multiple
              />
              <p>عکس</p>
            </label>
            <CloseIcon
              className={classes.clearMedia}
              onClick={() => {
                setImagesPreview([]);
                removeImageInputFile();
              }}
              sx={{ fontSize: 16 }}
            />
            <div className={classes.preview}>
              {imagesPreview.map((image, index) => (
                <Image
                  key={index}
                  width={300}
                  height={200}
                  objectFit="contain"
                  src={image.link}
                  alt="image"
                  priority
                />
              ))}
            </div>
          </div>
        </div>
        <p
          className={classes.alert}
          style={{
            fontFamily: "Farsi",
          }}
        >
          {alert}
        </p>
        {loader && (
          <div>
            <Image width={50} height={50} src={loaderImage} alt="isLoading" />
          </div>
        )}
        <button
          disabled={disableButton}
          style={{
            fontFamily: "FarsiMedium",
          }}
          onClick={() => handleSubmit()}
        >
          ذخیره
        </button>
      </div>
    </div>
  );
}
