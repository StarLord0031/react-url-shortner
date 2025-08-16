import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [urlData, setUrlData] = useState(null);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        // 1. Get the original URL
        const data = await getLongUrl(id);
        if (!data || !data.original_url) {
          throw new Error("URL not found");
        }

        setUrlData(data);

        // 2. Optionally store click stats (you can skip user_id here)
        await storeClicks({ id: data.id, originalUrl: data.original_url });

        // 3. Redirect to original URL
        window.location.href = data.original_url;
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchAndRedirect();
  }, [id]);

  if (loading) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
    );
  }

  return <p>Failed to redirect. URL not found.</p>;
};

export default RedirectLink;
