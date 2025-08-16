import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirect = async () => {
      try {
        const data = await getLongUrl(id);
        if (!data || !data.original_url) throw new Error("URL not found");

        // Call storeClicks, it records analytics but does NOT redirect
        const redirectUrl = await storeClicks({ id: data.id, originalUrl: data.original_url });

        // Redirect user after recording analytics
        window.location.href = redirectUrl;
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    redirect();
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
