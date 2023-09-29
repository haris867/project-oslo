import { useState } from "react";
import useGetData from "../../hooks/api/getData";
import { fetchUrl } from "../../utils/constants";
import { PrimaryButton, SecondaryButton } from "../commonStyles/buttons";
import { Link } from "react-router-dom";
import heic2any from "heic2any";
import { v4 as uuidv4 } from "uuid";
import { save } from "../../hooks/storage";
import { AccessInput } from "../../pages/home";
import { Jelly } from "@uiball/loaders";
import { BiSort } from "react-icons/bi";

function getSingleAdventureUrl(adventureId) {
  return `https://k0wle2wy.api.sanity.io/v2021-10-21/data/query/production?query=*%5B_type+%3D%3D+%22adventures%22+%26%26+_id+%3D%3D+%22${adventureId}%22+%5D%7B%0A++_id%2C%0A++title%2C%0A++year%2C%0A++images%5B%5D%7B%0A++++%22imageUrl%22%3A+image.asset-%3Eurl%2C%0A++++caption%2C%0A++++_key%0A++%7D%0A%7D%0A%0A%0A`;
}

const rotateImage = (src, callback) => {
  const img = new Image();
  img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.height;
    canvas.height = img.width;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((90 * Math.PI) / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    callback(canvas.toDataURL());
  };
  img.src = src;
};

export default function AdventureCards() {
  const { data } = useGetData(fetchUrl);
  const [isReversed, setIsReversed] = useState(false);
  const sortedData = data.sort((a, b) => a.year - b.year);

  const [collapsed, setCollapsed] = useState({});
  const [preview, setPreview] = useState({
    image: null,
    caption: "",
    adventureId: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const toggleSortOrder = () => {
    setIsReversed((prev) => !prev);
  };

  const toggleCollapse = (id) => {
    setCollapsed((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleUpload = async (fileToUpload) => {
    setIsUploading(true);
    const projectId = "k0wle2wy";
    const dataset = "production";
    const apiVersion = "v2021-10-21";
    const token =
      "skQXBZxoC3J1ch9qK2xi7tE7h3rfUm7dt0OvXDUmsJmEULZO7mg3kQVna8Itj22FSzFGr5rEqBygZfRcO9NdvvNLRUFhQgivM3bcvbkEUJbH0HOcs9gECvR8WBaRh1suom3zp5WKAB5VCkO7HWRM0aTmzH5zsWkZRntVq5GhO04Z31KEEJFl";

    const arrayBuffer = await fileToUpload.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);

    const uploadUrl = `https://${projectId}.api.sanity.io/${apiVersion}/assets/images/${dataset}`;
    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": fileToUpload.type,
      },
      body: byteArray,
    });

    if (uploadRes.ok) {
      const uploadData = await uploadRes.json();
      setIsUploading(false);
      return uploadData.document._id;
    } else {
      console.error("Failed to upload image");
      return null;
    }
  };

  const updateAdventureWithImage = async (adventureId, imageId, caption) => {
    const projectId = "k0wle2wy";
    const dataset = "production";
    const apiVersion = "v2021-10-21";
    const token =
      "skQXBZxoC3J1ch9qK2xi7tE7h3rfUm7dt0OvXDUmsJmEULZO7mg3kQVna8Itj22FSzFGr5rEqBygZfRcO9NdvvNLRUFhQgivM3bcvbkEUJbH0HOcs9gECvR8WBaRh1suom3zp5WKAB5VCkO7HWRM0aTmzH5zsWkZRntVq5GhO04Z31KEEJFl";

    const getUrl = `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}?query=*[_id=="${adventureId}"][0]`;
    const getRes = await fetch(getUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!getRes.ok) {
      console.error("Failed to fetch adventure");
      return;
    }

    const adventure = await getRes.json();
    const currentImages = adventure.result.images || [];

    const imageWithCaption = {
      _type: "imageWithCaption",
      _key: uuidv4(),
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageId,
        },
      },
      caption: caption, // Use the caption from the function argument
    };

    console.log("Current Images:", currentImages);
    currentImages.push(imageWithCaption);
    console.log("Updated Images:", currentImages);

    const postUrl = `https://${projectId}.api.sanity.io/${apiVersion}/data/mutate/${dataset}`;
    const postRes = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mutations: [
          {
            patch: {
              id: adventureId,
              set: {
                images: currentImages,
              },
            },
          },
        ],
      }),
    });

    if (postRes.ok) {
      console.log("Image added to adventure successfully");
    } else {
      console.error("Failed to add image to adventure");
    }
  };

  const handleFileChange = async (event, adventureId) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      if (file.type === "image/heic") {
        rotateImage(reader.result, (rotatedImage) => {
          setPreview({
            image: rotatedImage,
            caption: "",
            adventureId: adventureId,
          });
        });
      } else {
        setPreview({
          image: reader.result,
          caption: "",
          adventureId: adventureId,
        });
      }
    };

    if (file) {
      if (file.type === "image/heic") {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 1,
          keepOrientation: true,
        });
        reader.readAsDataURL(convertedBlob);
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleConfirmUpload = async () => {
    const file = dataURLtoFile(preview.image, "preview.jpg");
    let assetId;
    if (file.type === "image/heic") {
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 1,
      });
      assetId = await handleUpload(convertedBlob);
    } else {
      assetId = await handleUpload(file);
    }
    if (assetId) {
      await updateAdventureWithImage(
        preview.adventureId,
        assetId,
        preview.caption
      );
      const response = await fetch(getSingleAdventureUrl(preview.adventureId));
      const updatedAdventureData = await response.json();

      const updatedAdventure = updatedAdventureData.result;
      save(getSingleAdventureUrl(preview.adventureId), updatedAdventure);
    }
    setPreview({
      image: null,
      caption: "",
      adventureId: null,
    });
  };

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const displayedData = isReversed ? sortedData.reverse() : sortedData;

  return (
    <>
      <h2 className="text-center">Våre eventyralbum</h2>
      <div className="sort-icon-container mx-auto d-flex justify-content-end">
        <BiSort className="sort-icon" onClick={toggleSortOrder} />
      </div>
      {displayedData.map((adventure) => (
        <div
          key={adventure._id}
          className="d-flex flex-column card-div mx-auto m-4"
          onClick={() => toggleCollapse(adventure._id)}
        >
          <div className="d-flex">
            {adventure.images ? (
              <div className="mt-2">
                <div className="back-image mx-4 my-3"></div>
                <div className="back-image mx-4 my-3 back-image2"></div>

                <img
                  src={
                    adventure.images[0]
                      ? adventure.images[0].imageUrl
                      : "/images/ho-logo.png"
                  }
                  alt={` ${adventure.title} ${adventure.year}`}
                  className="mx-4 my-3 position-relative"
                />
              </div>
            ) : (
              <div className="mt-2">
                <div className="back-image mx-4 my-3"></div>
                <div className="back-image mx-4 my-3 back-image2"></div>

                <img
                  src="/images/ho-logo-icon.png"
                  alt="Default logo"
                  className="mx-4 my-3 position-relative"
                />
              </div>
            )}
            <div className="d-flex flex-column my-auto">
              <h1 className="princess-sofia">{adventure.title}</h1>
              <h2>{adventure.year}</h2>
            </div>
          </div>
          <div
            className={`collapse-buttons ${
              collapsed[adventure._id] ? "expanded" : ""
            } w-100 col-sm-12 d-flex justify-content-center`}
          >
            <div className="w-100 mx-2 mb-2">
              <SecondaryButton className="">
                <label
                  className="cursor-pointer"
                  htmlFor={`icon-button-file-${adventure._id}`}
                >
                  LEGG TIL
                </label>
                <input
                  accept="image/jpeg, image/png, image/heic, image/heif"
                  id={`icon-button-file-${adventure._id}`}
                  className="d-none"
                  type="file"
                  onChange={(e) => handleFileChange(e, adventure._id)}
                />
              </SecondaryButton>
            </div>
            <Link
              className="mx-2 mb-2 w-100"
              to={`/adventure/${adventure._id}`}
            >
              <PrimaryButton className="h-100">ÅPNE</PrimaryButton>
            </Link>
          </div>
        </div>
      ))}
      {preview.image && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          {isUploading && (
            <div className="text-center d-flex justify-content-center pt-5">
              <Jelly size={80} speed={0.9} color="#ffb085" />;
            </div>
          )}
          <img
            src={preview.image}
            alt="Preview"
            style={{ maxWidth: "90%", marginBottom: "20px" }}
          />
          <AccessInput
            className="w-75 mb-2"
            type="text"
            placeholder="Bildetekst?"
            value={preview.caption}
            onChange={(e) =>
              setPreview((prev) => ({ ...prev, caption: e.target.value }))
            }
          />
          <PrimaryButton onClick={handleConfirmUpload}>LEGG TIL</PrimaryButton>
        </div>
      )}
    </>
  );
}
