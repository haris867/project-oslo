import { useState } from "react";
import useGetData from "../../hooks/api/getData";
import { fetchUrl } from "../../utils/constants";
import { PrimaryButton, SecondaryButton } from "../commonStyles/buttons";
import { Link } from "react-router-dom";

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
              <SecondaryButton className="">LEGG TIL</SecondaryButton>
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
