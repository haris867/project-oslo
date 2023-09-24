import { useParams } from "react-router-dom";
import {
  MainHeading,
  SubHeading,
} from "../../components/commonStyles/headings";
import useGetData from "../../hooks/api/getData";

export default function Adventure() {
  let { id } = useParams();

  const singleAdventureUrl = `https://k0wle2wy.api.sanity.io/v2021-10-21/data/query/production?query=*%5B_type+%3D%3D+%22adventures%22+%26%26+_id+%3D%3D+%22${id}%22%5D%7B%0A++_id%2C%0A++title%2C%0A++year%2C%0A++images%5B%5D%7B%0A++++%22imageUrl%22%3A+image.asset-%3Eurl%2C%0A++++caption%0A++%7D%0A%7D%0A%0A%0A`;

  // REMOVED ISLOADING AND ISERROR(RE-ADD THEM)

  const { data } = useGetData(singleAdventureUrl);

  console.log(data[0]);

  if (data) {
    const singleAdventure = data[0];
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
            {singleAdventure.images.map((image, index) => (
              <div key={index} className="adventure-image mx-auto mb-3">
                <img
                  className="w-100"
                  src={image.imageUrl}
                  alt={
                    image.caption ||
                    `Image from ${singleAdventure.title} ${singleAdventure.year}`
                  }
                />
              </div>
            ))}
          </div>
        ) : null}
      </>
    );
  }
}
