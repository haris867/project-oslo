import { useParams } from "react-router-dom";
import {
  MainHeading,
  SubHeading,
} from "../../components/commonStyles/headings";
import useGetData from "../../hooks/api/getData";
import { useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../components/commonStyles/buttons";
import { save } from "../../hooks/storage";
import { Jelly } from "@uiball/loaders";

export default function Adventure() {
  let { id } = useParams();
  const singleAdventureUrl = `https://k0wle2wy.api.sanity.io/v2021-10-21/data/query/production?query=*%5B_type+%3D%3D+%22adventures%22+%26%26+_id+%3D%3D+%22${id}%22+%5D%7B%0A++_id%2C%0A++title%2C%0A++year%2C%0A++images%5B%5D%7B%0A++++%22imageUrl%22%3A+image.asset-%3Eurl%2C%0A++++caption%2C%0A++++_key%0A++%7D%0A%7D%0A%0A%0A`;

  const [preview, setPreview] = useState({
    image: null,
    caption: "",
    key: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  console.log(preview.image);

  const handleImageClick = (image) => {
    setPreview({
      image: image.imageUrl,
      caption: image.caption,
      key: image._key,
    });
  };

  // REMOVED ISLOADING AND ISERROR(RE-ADD THEM)

  const { data, isFetchLoading } = useGetData(singleAdventureUrl);

  console.log(data[0]);

  const deleteImage = async (imageKey) => {
    setIsUploading(true);
    const projectId = "k0wle2wy";
    const dataset = "production";
    const apiVersion = "v2021-10-21";
    const token =
      "skQXBZxoC3J1ch9qK2xi7tE7h3rfUm7dt0OvXDUmsJmEULZO7mg3kQVna8Itj22FSzFGr5rEqBygZfRcO9NdvvNLRUFhQgivM3bcvbkEUJbH0HOcs9gECvR8WBaRh1suom3zp5WKAB5VCkO7HWRM0aTmzH5zsWkZRntVq5GhO04Z31KEEJFl"; // Replace with your token

    const postUrl = `https://${projectId}.api.sanity.io/${apiVersion}/data/mutate/${dataset}`;

    console.log("Deleting image with key:", imageKey);

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
              id: id, // this refers to the 'id' from useParams()
              unset: [`images[_key == "${imageKey}"]`],
            },
          },
        ],
      }),
    });

    if (postRes.ok) {
      console.log("Image removed successfully from the document");
      const response = await fetch(singleAdventureUrl);
      const updatedAdventureData = await response.json();
      setIsUploading(false);
      const updatedAdventure = updatedAdventureData.result;

      // Update the local storage
      save(singleAdventureUrl, updatedAdventure);
      // Close the preview
      setPreview({ image: null, caption: "" });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      console.error("Failed to remove image from the document");
    }
  };

  if (isFetchLoading) {
    return (
      <div className="text-center d-flex justify-content-center pt-5">
        <Jelly size={80} speed={0.9} color="#ffb085" />;
      </div>
    );
  }

  if (data) {
    const singleAdventure = data[0];
    let filteredImages = [];
    if (singleAdventure && singleAdventure.images) {
      filteredImages = singleAdventure.images.filter(
        (image) => image._key !== null
      );
    }

    return (
      <>
        <div>
          {singleAdventure ? (
            <div className="text-center pt-5">
              <MainHeading>{singleAdventure.title}</MainHeading>
              <SubHeading>{singleAdventure.year}</SubHeading>
            </div>
          ) : null}
        </div>
        {singleAdventure ? (
          <div>
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="adventure-image d-flex flex-column mx-auto mb-3"
              >
                <img
                  onClick={() => handleImageClick(image)}
                  className="w-100"
                  src={image.imageUrl}
                  alt={
                    image.caption ||
                    `${singleAdventure.title} ${singleAdventure.year}`
                  }
                />
                {image.caption && (
                  <h3 className="princess-sofia mt-2 mb-0 text-center">
                    {image.caption}
                  </h3>
                )}
              </div>
            ))}
          </div>
        ) : null}
        {preview.image && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
            }}
            className="adventure-image"
          >
            {isUploading && (
              <div className="text-center d-flex justify-content-center pt-5">
                <Jelly size={80} speed={0.9} color="#ffb085" />;
              </div>
            )}
            <div
              className="preview-container pb-3 d-flex flex-column align-items-center"
              style={{ maxWidth: "90%" }}
            >
              <img className="w-100 mb-2" src={preview.image} alt="Preview" />
              <h3 className="princess-sofia">{preview.caption}</h3>

              <PrimaryButton
                className="my-2"
                onClick={() => deleteImage(preview.key)}
              >
                SLETT
              </PrimaryButton>
              <SecondaryButton
                onClick={() => setPreview({ image: null, caption: "" })}
              >
                LUKK
              </SecondaryButton>
            </div>
          </div>
        )}
      </>
    );
  }
}
