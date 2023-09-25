import { useState } from "react";
import useGetData from "../../hooks/api/getData";
import { fetchUrl } from "../../utils/constants";
import { PrimaryButton, SecondaryButton } from "../commonStyles/buttons";
import { Link } from "react-router-dom";
import heic2any from "heic2any";
import { v4 as uuidv4 } from "uuid";
import { save } from "../../hooks/storage";

function getSingleAdventureUrl(adventureId) {
  return `https://k0wle2wy.api.sanity.io/v2021-10-21/data/query/production?query=*%5B_type+%3D%3D+%22adventures%22+%26%26+_id+%3D%3D+%22${adventureId}%22%5D%7B%0A++_id%2C%0A++title%2C%0A++year%2C%0A++images%5B%5D%7B%0A++++%22imageUrl%22%3A+image.asset-%3Eurl%2C%0A++++caption%0A++%7D%0A%7D%0A%0A%0A`;
}

export default function AdventureCards() {
  // REMOVED ISLOADING AND ISERROR(RE-ADD THEM)
  const { data } = useGetData(fetchUrl);
  const sortedData = data.sort((a, b) => a.year - b.year);
  const [collapsed, setCollapsed] = useState({});

  const toggleCollapse = (id) => {
    setCollapsed((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleUpload = async (fileToUpload) => {
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
      return uploadData.document._id;
    } else {
      console.error("Failed to upload image");
      return null;
    }
  };

  const updateAdventureWithImage = async (adventureId, imageId) => {
    const projectId = "k0wle2wy";
    const dataset = "production";
    const apiVersion = "v2021-10-21";
    const token =
      "skQXBZxoC3J1ch9qK2xi7tE7h3rfUm7dt0OvXDUmsJmEULZO7mg3kQVna8Itj22FSzFGr5rEqBygZfRcO9NdvvNLRUFhQgivM3bcvbkEUJbH0HOcs9gECvR8WBaRh1suom3zp5WKAB5VCkO7HWRM0aTmzH5zsWkZRntVq5GhO04Z31KEEJFl";

    // Fetch the current adventure document
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
        _key: uuidv4(),
        asset: {
          _type: "reference",
          _ref: imageId,
        },
      },
      caption: "",
    };

    currentImages.push(imageWithCaption);

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
    console.log("Adventure ID:", adventureId);
    const file = event.target.files[0];

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
      await updateAdventureWithImage(adventureId, assetId);
      const response = await fetch(getSingleAdventureUrl(adventureId));
      const updatedAdventureData = await response.json();

      // Extract the result field from the response
      const updatedAdventure = updatedAdventureData.result;

      save(getSingleAdventureUrl(adventureId), updatedAdventure);
    }
  };

  return (
    <>
      <h2 className="text-center">Våre eventyralbum</h2>
      {sortedData.map((adventure) => (
        <div
          key={adventure._id}
          className="d-flex flex-column card-div mx-auto m-4"
          onClick={() => toggleCollapse(adventure._id)}
        >
          <div className="d-flex">
            <div className="mt-2">
              <div className="back-image mx-4 my-3"></div>
              <div className="back-image mx-4 my-3 back-image2"></div>
              <img
                src={
                  adventure.images[0]
                    ? adventure.images[0].imageUrl
                    : "/images/test-image.jpg"
                }
                alt={` ${adventure.title} ${adventure.year}`}
                className="mx-4 my-3 position-relative"
              />
            </div>
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
                  capture="environment"
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
    </>
  );
}

// DISPLAYS THREE IMAGES AND NOT JUST ONE (MAYBE?)

// import useGetData from "../../hooks/api/getData";
// import { fetchUrl } from "../../utils/constants";

// export default function AdventureCards() {
//   const { data, isFetchLoading, isFetchError } = useGetData(fetchUrl);

//   console.log(data);
//   const sortedData = data.sort((a, b) => a.year - b.year);

//   return (
//     <>
//       {sortedData.map((adventure) => (
//         <div key={adventure._id} className="d-flex card-div mx-auto m-4">
//           <div className="mt-2">
//             <img
//               src={adventure.images[1].imageUrl}
//               className="back-image mx-4 my-3"
//             />

//             <img
//               src={adventure.images[2].imageUrl}
//               className="back-image mx-4 my-3 back-image2"
//             />
//             <img
//               src={
//                 adventure.images[0]
//                   ? adventure.images[0].imageUrl
//                   : "/images/test-image.jpg"
//               }
//               alt={`Image from ${adventure.title} ${adventure.year}`}
//               className="mx-4 my-3 position-relative"
//             />
//           </div>
//           <div className="d-flex flex-column my-auto">
//             <h1 className="princess-sofia">{adventure.title}</h1>
//             <h2>{adventure.year}</h2>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// }
